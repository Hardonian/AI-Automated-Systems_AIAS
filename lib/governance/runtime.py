"""
Runtime Governance Engine

Enforces governance policies at runtime:
- Throttle agents with degrading trust
- Auto-disable agents violating BLOCKER rules
- Require human override for uncertified agents
"""

import json
import time
import asyncio
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import threading

from tools.agent_behavior_intel import (
    GovernanceLevel,
    get_trust_ledger,
    AgentProfiler
)
from lib.governance.certifier import AgentCertifier


class EnforcementAction(Enum):
    """Possible enforcement actions."""
    ALLOW = "allow"
    THROTTLE = "throttle"
    BLOCK = "block"
    DISABLE = "disable"
    REQUIRE_APPROVAL = "require_approval"


class PolicyViolationType(Enum):
    """Types of policy violations."""
    BLOCKER = "blocker"
    WARNING = "warning"
    ADVISORY = "advisory"


@dataclass
class GovernanceDecision:
    """Decision from runtime governance."""
    agent_id: str
    action: EnforcementAction
    reason: str
    trust_score: float
    governance_level: str
    requires_approval: bool
    rate_limit: Optional[float] = None  # 0.0-1.0
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class HumanOverride:
    """Human override request/response."""
    override_id: str
    agent_id: str
    request_type: str
    reason: str
    requested_at: str
    resolved_at: Optional[str] = None
    approved: Optional[bool] = None
    approved_by: Optional[str] = None
    notes: Optional[str] = None


class RuntimeGovernance:
    """
    Runtime Governance Engine.
    
    Monitors agent execution and enforces governance policies:
    - Throttles low-trust agents
    - Blocks uncertified or quarantined agents
    - Requires human approval for sensitive operations
    - Auto-disables on BLOCKER violations
    """
    
    def __init__(
        self,
        check_interval_seconds: float = 60.0,
        auto_disable_threshold: float = 0.50
    ):
        """
        Initialize runtime governance.
        
        Args:
            check_interval_seconds: How often to check agent trust scores
            auto_disable_threshold: Trust score below which to auto-disable
        """
        self.check_interval = check_interval_seconds
        self.auto_disable_threshold = auto_disable_threshold
        
        # Dependencies
        self.ledger = get_trust_ledger()
        self.certifier = AgentCertifier()
        self.profiler = AgentProfiler()
        
        # State
        self.throttled_agents: Dict[str, float] = {}  # agent_id -> rate_limit
        self.disabled_agents: set = set()
        self.pending_overrides: Dict[str, HumanOverride] = {}
        self.resolved_overrides: List[HumanOverride] = []
        
        # Callbacks
        self.violation_handlers: List[Callable[[str, PolicyViolationType, str], None]] = []
        self.decision_log: List[Dict] = []
        
        # Monitoring
        self._monitoring = False
        self._monitor_thread: Optional[threading.Thread] = None
        self._lock = threading.RLock()
    
    def check_agent(
        self,
        agent_id: str,
        agent_version: str,
        operation: str = "default",
        sensitivity: str = "normal"
    ) -> GovernanceDecision:
        """
        Check if agent is allowed to execute.
        
        Args:
            agent_id: Agent identifier
            agent_version: Agent version
            operation: Type of operation being requested
            sensitivity: Operation sensitivity (low, normal, high, critical)
            
        Returns:
            GovernanceDecision with action and constraints
        """
        with self._lock:
            # Check if disabled
            if agent_id in self.disabled_agents:
                return GovernanceDecision(
                    agent_id=agent_id,
                    action=EnforcementAction.BLOCK,
                    reason="Agent is disabled",
                    trust_score=0.0,
                    governance_level="quarantined",
                    requires_approval=True
                )
            
            # Get current trust score
            trust_entry = self.ledger.get_current_trust_score(agent_id, agent_version)
            trust_score = trust_entry['trust_score'] if trust_entry else 0.0
            
            # Determine governance level
            governance_level = self._determine_level(trust_score)
            
            # Check certification
            cert = self.certifier.get_certificate(agent_id, agent_version)
            cert_valid = False
            if cert:
                validation = self.certifier.validate_certificate(cert)
                cert_valid = validation['valid']
            
            # Make decision based on level and sensitivity
            decision = self._make_decision(
                agent_id=agent_id,
                trust_score=trust_score,
                governance_level=governance_level,
                cert_valid=cert_valid,
                operation=operation,
                sensitivity=sensitivity
            )
            
            # Log decision
            self._log_decision(decision)
            
            return decision
    
    def _make_decision(
        self,
        agent_id: str,
        trust_score: float,
        governance_level: str,
        cert_valid: bool,
        operation: str,
        sensitivity: str
    ) -> GovernanceDecision:
        """Make governance decision based on agent status."""
        
        # Critical operations always require approval if not certified
        if sensitivity == "critical" and governance_level != "certified":
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.REQUIRE_APPROVAL,
                reason=f"Critical operation requires certified agent (current: {governance_level})",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=True
            )
        
        # Uncertified agents require approval for sensitive operations
        if not cert_valid and sensitivity in ["high", "critical"]:
            override_id = self._request_human_override(
                agent_id=agent_id,
                request_type="uncertified_sensitive",
                reason=f"Uncertified agent attempting {sensitivity} operation: {operation}"
            )
            
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.REQUIRE_APPROVAL,
                reason=f"Uncertified agent - human approval required (override: {override_id})",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=True,
                metadata={'override_id': override_id}
            )
        
        # Apply governance level rules
        if governance_level == "quarantined":
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.DISABLE,
                reason="Trust score below threshold - agent quarantined",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=True
            )
        
        elif governance_level == "restricted":
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.THROTTLE,
                reason="Restricted governance level - throttled to 50%",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=False,
                rate_limit=0.5
            )
        
        elif governance_level == "supervised":
            # Supervised agents OK for normal, require approval for high sensitivity
            if sensitivity == "high":
                return GovernanceDecision(
                    agent_id=agent_id,
                    action=EnforcementAction.REQUIRE_APPROVAL,
                    reason="Supervised agent requires approval for high-sensitivity operations",
                    trust_score=trust_score,
                    governance_level=governance_level,
                    requires_approval=True
                )
            
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.ALLOW,
                reason="Supervised agent approved for normal operations",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=False
            )
        
        elif governance_level == "certified":
            return GovernanceDecision(
                agent_id=agent_id,
                action=EnforcementAction.ALLOW,
                reason="Certified agent - full permissions",
                trust_score=trust_score,
                governance_level=governance_level,
                requires_approval=False
            )
        
        # Default: require approval
        return GovernanceDecision(
            agent_id=agent_id,
            action=EnforcementAction.REQUIRE_APPROVAL,
            reason="Unknown governance status - approval required",
            trust_score=trust_score,
            governance_level="unknown",
            requires_approval=True
        )
    
    def handle_violation(
        self,
        agent_id: str,
        violation_type: PolicyViolationType,
        details: str
    ) -> None:
        """
        Handle a policy violation.
        
        Args:
            agent_id: Agent that violated policy
            violation_type: Type of violation
            details: Violation details
        """
        with self._lock:
            # Notify handlers
            for handler in self.violation_handlers:
                try:
                    handler(agent_id, violation_type, details)
                except Exception as e:
                    print(f"[RuntimeGovernance] Violation handler error: {e}")
            
            # Take action based on violation type
            if violation_type == PolicyViolationType.BLOCKER:
                self._auto_disable(agent_id, f"BLOCKER violation: {details}")
            
            elif violation_type == PolicyViolationType.WARNING:
                # Log but don't block
                self._log_decision({
                    'agent_id': agent_id,
                    'action': 'warning',
                    'reason': details,
                    'timestamp': datetime.now().isoformat()
                })
    
    def _auto_disable(self, agent_id: str, reason: str) -> None:
        """Auto-disable an agent."""
        self.disabled_agents.add(agent_id)
        
        # Remove from throttled if present
        if agent_id in self.throttled_agents:
            del self.throttled_agents[agent_id]
        
        print(f"[RuntimeGovernance] Auto-disabled agent: {agent_id}")
        print(f"  Reason: {reason}")
        
        # Request human review
        self._request_human_override(
            agent_id=agent_id,
            request_type="auto_disable",
            reason=reason
        )
    
    def throttle_agent(self, agent_id: str, rate_limit: float = 0.5) -> None:
        """
        Throttle an agent.
        
        Args:
            agent_id: Agent to throttle
            rate_limit: Rate limit (0.0-1.0, where 1.0 = full speed)
        """
        with self._lock:
            if agent_id not in self.disabled_agents:
                self.throttled_agents[agent_id] = rate_limit
                print(f"[RuntimeGovernance] Throttled agent: {agent_id} (rate: {rate_limit})")
    
    def unthrottle_agent(self, agent_id: str) -> None:
        """Remove throttle from agent."""
        with self._lock:
            if agent_id in self.throttled_agents:
                del self.throttled_agents[agent_id]
                print(f"[RuntimeGovernance] Unthrottled agent: {agent_id}")
    
    def disable_agent(self, agent_id: str, reason: str) -> None:
        """Manually disable an agent."""
        with self._lock:
            self._auto_disable(agent_id, reason)
    
    def enable_agent(self, agent_id: str) -> None:
        """Re-enable a disabled agent (requires human override)."""
        with self._lock:
            if agent_id in self.disabled_agents:
                self.disabled_agents.remove(agent_id)
                print(f"[RuntimeGovernance] Enabled agent: {agent_id}")
    
    def _request_human_override(
        self,
        agent_id: str,
        request_type: str,
        reason: str
    ) -> str:
        """Request human override."""
        override_id = f"ovr_{int(time.time() * 1000)}_{agent_id}"
        
        override = HumanOverride(
            override_id=override_id,
            agent_id=agent_id,
            request_type=request_type,
            reason=reason,
            requested_at=datetime.now().isoformat()
        )
        
        self.pending_overrides[override_id] = override
        
        print(f"[RuntimeGovernance] Human override requested: {override_id}")
        print(f"  Agent: {agent_id}")
        print(f"  Type: {request_type}")
        print(f"  Reason: {reason}")
        
        return override_id
    
    def resolve_human_override(
        self,
        override_id: str,
        approved: bool,
        approved_by: str,
        notes: Optional[str] = None
    ) -> bool:
        """
        Resolve a human override request.
        
        Returns:
            True if resolved, False if not found
        """
        with self._lock:
            if override_id not in self.pending_overrides:
                return False
            
            override = self.pending_overrides.pop(override_id)
            override.resolved_at = datetime.now().isoformat()
            override.approved = approved
            override.approved_by = approved_by
            override.notes = notes
            
            self.resolved_overrides.append(override)
            
            # If approved for disabled agent, re-enable
            if approved and override.request_type == "auto_disable":
                self.enable_agent(override.agent_id)
            
            print(f"[RuntimeGovernance] Override resolved: {override_id}")
            print(f"  Approved: {approved}")
            print(f"  By: {approved_by}")
            
            return True
    
    def get_pending_overrides(self) -> List[HumanOverride]:
        """Get all pending human override requests."""
        return list(self.pending_overrides.values())
    
    def start_monitoring(self) -> None:
        """Start background monitoring of agent trust scores."""
        if self._monitoring:
            return
        
        self._monitoring = True
        self._monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._monitor_thread.start()
        print("[RuntimeGovernance] Monitoring started")
    
    def stop_monitoring(self) -> None:
        """Stop background monitoring."""
        self._monitoring = False
        if self._monitor_thread:
            self._monitor_thread.join(timeout=5.0)
        print("[RuntimeGovernance] Monitoring stopped")
    
    def _monitor_loop(self) -> None:
        """Background monitoring loop."""
        while self._monitoring:
            try:
                self._check_all_agents()
                time.sleep(self.check_interval)
            except Exception as e:
                print(f"[RuntimeGovernance] Monitor error: {e}")
    
    def _check_all_agents(self) -> None:
        """Check trust scores for all agents and take action."""
        # Get all agent scores from ledger
        all_scores = self.ledger.get_all_agent_scores()
        
        for agent_key, entry in all_scores.items():
            agent_id = entry['agent_id']
            trust_score = entry['trust_score']
            
            # Check for degradation
            alert = self.ledger.detect_trust_degradation(agent_id)
            if alert:
                print(f"[RuntimeGovernance] Trust degradation detected: {agent_id}")
                print(f"  Degradation: {alert['degradation_pct']:.1f}%")
                
                # Auto-throttle if degrading but not yet critical
                if trust_score >= self.auto_disable_threshold:
                    self.throttle_agent(agent_id, rate_limit=0.7)
            
            # Auto-disable if below threshold
            if trust_score < self.auto_disable_threshold:
                if agent_id not in self.disabled_agents:
                    self._auto_disable(
                        agent_id,
                        f"Trust score ({trust_score:.2%}) below threshold ({self.auto_disable_threshold:.2%})"
                    )
    
    def _determine_level(self, trust_score: float) -> str:
        """Determine governance level from trust score."""
        if trust_score >= 0.90:
            return "certified"
        elif trust_score >= 0.70:
            return "supervised"
        elif trust_score >= 0.50:
            return "restricted"
        else:
            return "quarantined"
    
    def _log_decision(self, decision: Any) -> None:
        """Log governance decision."""
        if isinstance(decision, GovernanceDecision):
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'agent_id': decision.agent_id,
                'action': decision.action.value,
                'reason': decision.reason,
                'trust_score': decision.trust_score,
                'governance_level': decision.governance_level
            }
        else:
            log_entry = decision
        
        self.decision_log.append(log_entry)
        
        # Keep log size manageable
        if len(self.decision_log) > 10000:
            self.decision_log = self.decision_log[-5000:]
    
    def get_decision_log(
        self,
        agent_id: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """Get decision log, optionally filtered."""
        logs = self.decision_log
        
        if agent_id:
            logs = [l for l in logs if l.get('agent_id') == agent_id]
        
        return logs[-limit:]
    
    def register_violation_handler(
        self,
        handler: Callable[[str, PolicyViolationType, str], None]
    ) -> None:
        """Register a handler for policy violations."""
        self.violation_handlers.append(handler)
    
    def export_state(self) -> Dict[str, Any]:
        """Export current governance state."""
        return {
            'timestamp': datetime.now().isoformat(),
            'throttled_agents': self.throttled_agents,
            'disabled_agents': list(self.disabled_agents),
            'pending_overrides': len(self.pending_overrides),
            'total_decisions': len(self.decision_log)
        }


# Singleton instance
_governance_instance: Optional[RuntimeGovernance] = None


def get_runtime_governance() -> RuntimeGovernance:
    """Get singleton runtime governance instance."""
    global _governance_instance
    if _governance_instance is None:
        _governance_instance = RuntimeGovernance()
    return _governance_instance


# Convenience functions
def check_agent_permission(
    agent_id: str,
    agent_version: str,
    operation: str = "default"
) -> bool:
    """Quick check if agent is allowed to execute."""
    governance = get_runtime_governance()
    decision = governance.check_agent(agent_id, agent_version, operation)
    return decision.action not in [EnforcementAction.BLOCK, EnforcementAction.DISABLE]


def require_human_approval(agent_id: str, reason: str) -> str:
    """Request human approval for an agent operation."""
    governance = get_runtime_governance()
    return governance._request_human_override(agent_id, "manual", reason)
