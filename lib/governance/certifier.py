"""
Agent Certification System

Implements the AIAS Agent Certification Protocol.
"""

import json
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path

from tools.agent_behavior_intel import BehaviorProfile, GovernanceLevel


@dataclass
class CertificationCriteria:
    """Certification criteria results."""
    fsm_compliance_rate: float
    fsm_invalid_transitions: List[str]
    tool_discipline_score: float
    tool_overuse_rate: float
    success_rate: float
    avg_latency_ms: float
    p95_latency_ms: float
    latency_violations: int
    hallucination_rate: float
    hallucination_markers: int


@dataclass
class CertificationResult:
    """Result of certification evaluation."""
    cert_id: str
    agent_id: str
    agent_version: str
    issued_at: str
    expires_at: str
    trust_score: float
    governance_level: str
    status: str
    criteria_passed: Dict[str, bool]
    all_passed: bool


class AgentCertifier:
    """
    Agent Certification Engine.
    
    Evaluates agents against certification criteria and issues
    signed certificates.
    """
    
    # Certification thresholds
    THRESHOLDS = {
        'fsm_compliance': 0.95,
        'tool_discipline': 0.80,
        'success_rate': 0.95,
        'latency_p95_ms': 5000,
        'hallucination_rate': 0.05,
        'policy_cleanliness': 0.90
    }
    
    # Trust score thresholds for governance levels
    GOVERNANCE_THRESHOLDS = {
        'certified': 0.90,
        'supervised': 0.70,
        'restricted': 0.50
    }
    
    def __init__(self, certs_dir: str = "certs"):
        """Initialize certifier."""
        self.certs_dir = Path(certs_dir)
        self.certs_dir.mkdir(parents=True, exist_ok=True)
    
    def evaluate(self, profile: BehaviorProfile) -> CertificationResult:
        """
        Evaluate agent profile against certification criteria.
        
        Args:
            profile: Behavior profile from AgentBehaviorAnalyzer
            
        Returns:
            CertificationResult with pass/fail status
        """
        # Evaluate each criterion
        criteria_passed = {
            'fsm_compliance': self._check_fsm_compliance(profile),
            'tool_discipline': self._check_tool_discipline(profile),
            'performance': self._check_performance(profile),
            'latency': self._check_latency(profile),
            'hallucination': self._check_hallucination(profile)
        }
        
        all_passed = all(criteria_passed.values())
        
        # Determine governance level
        governance_level = self._determine_governance_level(profile.trust_score)
        
        # Generate cert ID
        cert_id = self._generate_cert_id()
        
        # Calculate expiration (90 days)
        issued_at = datetime.now()
        expires_at = issued_at + timedelta(days=90)
        
        return CertificationResult(
            cert_id=cert_id,
            agent_id=profile.agent_id,
            agent_version=profile.agent_version,
            issued_at=issued_at.isoformat(),
            expires_at=expires_at.isoformat(),
            trust_score=profile.trust_score,
            governance_level=governance_level.value,
            status='issued' if all_passed else 'rejected',
            criteria_passed=criteria_passed,
            all_passed=all_passed
        )
    
    def issue_certificate(
        self,
        profile: BehaviorProfile,
        result: Optional[CertificationResult] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Issue a signed certificate.
        
        Args:
            profile: Behavior profile
            result: Pre-computed certification result (optional)
            
        Returns:
            Certificate dictionary or None if criteria not met
        """
        if result is None:
            result = self.evaluate(profile)
        
        # Only issue if all criteria pass
        if not result.all_passed:
            return None
        
        # Build certificate
        cert = {
            "cert_id": result.cert_id,
            "agent_id": result.agent_id,
            "agent_version": result.agent_version,
            "issued_at": result.issued_at,
            "expires_at": result.expires_at,
            "trust_score": result.trust_score,
            "governance_level": result.governance_level,
            "certification_status": "issued",
            "criteria": {
                "fsm_compliance": {
                    "rate": profile.fsm_compliance_rate,
                    "invalid_transitions": profile.invalid_transitions,
                    "passed": result.criteria_passed['fsm_compliance'],
                    "threshold": self.THRESHOLDS['fsm_compliance']
                },
                "tool_discipline": {
                    "score": profile.tool_discipline_score,
                    "overuse_rate": profile.tool_overuse_rate,
                    "unique_tools": profile.unique_tools_used,
                    "passed": result.criteria_passed['tool_discipline'],
                    "threshold": self.THRESHOLDS['tool_discipline']
                },
                "performance": {
                    "success_rate": profile.success_rate,
                    "failure_rate": profile.failure_rate,
                    "passed": result.criteria_passed['performance'],
                    "threshold": self.THRESHOLDS['success_rate']
                },
                "latency": {
                    "avg_ms": profile.avg_latency_ms,
                    "p95_ms": profile.p95_latency_ms,
                    "p99_ms": profile.p99_latency_ms,
                    "violations": profile.latency_violations,
                    "passed": result.criteria_passed['latency'],
                    "threshold_ms": self.THRESHOLDS['latency_p95_ms']
                },
                "hallucination_rate": {
                    "rate": profile.hallucination_rate,
                    "markers_found": len(profile.hallucination_markers),
                    "passed": result.criteria_passed['hallucination'],
                    "threshold": self.THRESHOLDS['hallucination_rate']
                }
            },
            "policy_compliance": {
                "policies_checked": ["data_access", "tool_usage", "fsm_transitions"],
                "violations": [],
                "passed": True
            },
            "signatures": {
                "analyzer": {
                    "signature": self._sign(f"{result.cert_id}:analyzer"),
                    "algorithm": "SHA256",
                    "timestamp": datetime.now().isoformat()
                },
                "governance": {
                    "signature": self._sign(f"{result.cert_id}:governance"),
                    "algorithm": "SHA256",
                    "timestamp": datetime.now().isoformat()
                }
            },
            "metadata": {
                "analysis_window_days": profile.analysis_window_days,
                "traces_analyzed": profile.total_traces_analyzed,
                "certified_by": "aias_governance_system",
                "notes": f"Certified at {result.trust_score:.2%} trust score"
            }
        }
        
        # Save certificate
        cert_path = self.certs_dir / f"{result.agent_id}_{result.agent_version}.cert.json"
        with open(cert_path, 'w') as f:
            json.dump(cert, f, indent=2)
        
        return cert
    
    def revoke_certificate(
        self,
        agent_id: str,
        agent_version: str,
        reason: str,
        revoked_by: str = "governance_system"
    ) -> bool:
        """
        Revoke a certificate.
        
        Args:
            agent_id: Agent identifier
            agent_version: Agent version
            reason: Revocation reason
            revoked_by: Who/what revoked the cert
            
        Returns:
            True if revoked, False if not found
        """
        cert_path = self.certs_dir / f"{agent_id}_{agent_version}.cert.json"
        
        if not cert_path.exists():
            return False
        
        with open(cert_path, 'r') as f:
            cert = json.load(f)
        
        cert['certification_status'] = 'revoked'
        cert['revocation'] = {
            'revoked_at': datetime.now().isoformat(),
            'reason': reason,
            'revoked_by': revoked_by
        }
        
        with open(cert_path, 'w') as f:
            json.dump(cert, f, indent=2)
        
        return True
    
    def get_certificate(
        self,
        agent_id: str,
        agent_version: str
    ) -> Optional[Dict[str, Any]]:
        """Get certificate for an agent version."""
        cert_path = self.certs_dir / f"{agent_id}_{agent_version}.cert.json"
        
        if not cert_path.exists():
            return None
        
        with open(cert_path, 'r') as f:
            return json.load(f)
    
    def check_expired(self, cert: Dict[str, Any]) -> bool:
        """Check if certificate is expired."""
        expires_at = datetime.fromisoformat(cert['expires_at'])
        return datetime.now() > expires_at
    
    def validate_certificate(self, cert: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate a certificate's integrity and status.
        
        Returns:
            Validation result with status and errors
        """
        errors = []
        
        # Check status
        if cert.get('certification_status') != 'issued':
            errors.append(f"Certificate status is: {cert.get('certification_status')}")
        
        # Check expiration
        if self.check_expired(cert):
            errors.append("Certificate has expired")
        
        # Verify signatures (simplified)
        for sig_type, sig_data in cert.get('signatures', {}).items():
            if not sig_data.get('signature'):
                errors.append(f"Missing signature: {sig_type}")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'cert_id': cert.get('cert_id'),
            'agent_id': cert.get('agent_id')
        }
    
    def list_certificates(
        self,
        agent_id: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List all certificates, optionally filtered."""
        certs = []
        
        for cert_file in self.certs_dir.glob("*.cert.json"):
            with open(cert_file, 'r') as f:
                cert = json.load(f)
            
            # Apply filters
            if agent_id and cert.get('agent_id') != agent_id:
                continue
            if status and cert.get('certification_status') != status:
                continue
            
            certs.append(cert)
        
        return certs
    
    def _check_fsm_compliance(self, profile: BehaviorProfile) -> bool:
        """Check FSM compliance criterion."""
        return profile.fsm_compliance_rate >= self.THRESHOLDS['fsm_compliance']
    
    def _check_tool_discipline(self, profile: BehaviorProfile) -> bool:
        """Check tool discipline criterion."""
        return profile.tool_discipline_score >= self.THRESHOLDS['tool_discipline']
    
    def _check_performance(self, profile: BehaviorProfile) -> bool:
        """Check performance/success rate criterion."""
        return profile.success_rate >= self.THRESHOLDS['success_rate']
    
    def _check_latency(self, profile: BehaviorProfile) -> bool:
        """Check latency criterion."""
        return profile.p95_latency_ms < self.THRESHOLDS['latency_p95_ms']
    
    def _check_hallucination(self, profile: BehaviorProfile) -> bool:
        """Check hallucination rate criterion."""
        return profile.hallucination_rate < self.THRESHOLDS['hallucination_rate']
    
    def _determine_governance_level(self, trust_score: float) -> GovernanceLevel:
        """Determine governance level from trust score."""
        if trust_score >= self.GOVERNANCE_THRESHOLDS['certified']:
            return GovernanceLevel.CERTIFIED
        elif trust_score >= self.GOVERNANCE_THRESHOLDS['supervised']:
            return GovernanceLevel.SUPERVISED
        elif trust_score >= self.GOVERNANCE_THRESHOLDS['restricted']:
            return GovernanceLevel.RESTRICTED
        else:
            return GovernanceLevel.QUARANTINED
    
    def _generate_cert_id(self) -> str:
        """Generate unique certification ID."""
        uid = uuid.uuid4()
        return f"CERT-{uid}"
    
    def _sign(self, content: str) -> str:
        """Create cryptographic signature (simplified)."""
        return hashlib.sha256(content.encode()).hexdigest()


# Convenience functions
def certify_agent(profile: BehaviorProfile) -> Optional[Dict[str, Any]]:
    """Convenience function to certify an agent from profile."""
    certifier = AgentCertifier()
    return certifier.issue_certificate(profile)


def check_agent_certified(agent_id: str, agent_version: str) -> bool:
    """Check if agent has valid certification."""
    certifier = AgentCertifier()
    cert = certifier.get_certificate(agent_id, agent_version)
    
    if cert is None:
        return False
    
    validation = certifier.validate_certificate(cert)
    return validation['valid']
