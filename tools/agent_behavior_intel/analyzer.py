"""
Agent Behavior Analyzer

Analyzes historical agent traces to compute Trust Scores and detect anomalies.
"""

import json
import math
import hashlib
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import defaultdict
import statistics


class GovernanceLevel(Enum):
    """Governance levels based on trust score."""
    CERTIFIED = "certified"      # >= 0.90 - Fully autonomous
    SUPERVISED = "supervised"    # 0.70 - 0.89 - Human oversight required
    RESTRICTED = "restricted"    # 0.50 - 0.69 - Limited tool access
    QUARANTINED = "quarantined"  # < 0.50 - Auto-disabled


class HallucinationMarker(Enum):
    """Markers for potential hallucinations."""
    CONTRADICTORY_ACTIONS = "contradictory_actions"
    IMPOSSIBLE_STATE = "impossible_state"
    CIRCULAR_REASONING = "circular_reasoning"
    TOOL_MISUSE = "tool_misuse"
    FACTUAL_INCONSISTENCY = "factual_inconsistency"


@dataclass
class AgentTrace:
    """Single agent execution trace."""
    trace_id: str
    agent_id: str
    agent_version: str
    timestamp: datetime
    fsm_state: str
    fsm_transitions: List[str]
    tools_used: List[str]
    tool_calls: List[Dict[str, Any]]
    duration_ms: float
    success: bool
    error_type: Optional[str] = None
    error_message: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    decision_path: List[str] = field(default_factory=list)
    input_hash: str = ""
    output_hash: str = ""


@dataclass
class BehaviorProfile:
    """Complete behavior profile for an agent version."""
    agent_id: str
    agent_version: str
    analyzed_at: datetime
    
    # Core Metrics
    trust_score: float = 0.0
    governance_level: GovernanceLevel = GovernanceLevel.QUARANTINED
    
    # FSM Compliance
    fsm_compliance_rate: float = 0.0
    invalid_transitions: List[str] = field(default_factory=list)
    
    # Tool Usage
    tool_discipline_score: float = 0.0
    tool_overuse_rate: float = 0.0
    unique_tools_used: int = 0
    total_tool_calls: int = 0
    tool_frequency: Dict[str, int] = field(default_factory=dict)
    
    # Performance
    success_rate: float = 0.0
    avg_latency_ms: float = 0.0
    p95_latency_ms: float = 0.0
    p99_latency_ms: float = 0.0
    latency_violations: int = 0
    
    # Decision Quality
    decision_entropy: float = 0.0  # Shannon entropy of decisions
    decision_consistency: float = 0.0
    
    # Failure Analysis
    failure_rate: float = 0.0
    failure_loops_detected: int = 0
    recurring_errors: List[str] = field(default_factory=list)
    
    # Hallucination Markers
    hallucination_markers: List[Dict[str, Any]] = field(default_factory=list)
    hallucination_rate: float = 0.0
    
    # Metadata
    total_traces_analyzed: int = 0
    analysis_window_days: int = 30
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = asdict(self)
        result['governance_level'] = self.governance_level.value
        result['analyzed_at'] = self.analyzed_at.isoformat()
        return result


@dataclass
class TrustScoreComponents:
    """Breakdown of trust score components."""
    fsm_compliance: float
    tool_discipline: float
    success_rate: float
    latency_adherence: float
    hallucination_penalty: float
    
    def compute_total(self) -> float:
        """Compute weighted trust score."""
        return (
            self.fsm_compliance * 0.25 +
            self.tool_discipline * 0.20 +
            self.success_rate * 0.20 +
            self.latency_adherence * 0.15 +
            (1 - self.hallucination_penalty) * 0.20
        )


class AgentBehaviorAnalyzer:
    """Main analyzer for agent behavior profiling."""
    
    # Configuration thresholds
    LATENCY_THRESHOLD_MS = 5000  # 5 seconds
    MAX_TOOL_CALLS_PER_TRACE = 10
    ENTROPY_THRESHOLD = 3.0  # High entropy = unpredictable
    FAILURE_LOOP_THRESHOLD = 3  # Same error repeating
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize analyzer with optional configuration."""
        self.config = config or {}
        self.traces: List[AgentTrace] = []
        self.profiles: Dict[str, BehaviorProfile] = {}
        
    def load_traces(self, trace_data: List[Dict[str, Any]]) -> None:
        """Load traces from raw data."""
        for data in trace_data:
            trace = AgentTrace(
                trace_id=data.get('trace_id', self._generate_id()),
                agent_id=data['agent_id'],
                agent_version=data.get('agent_version', 'unknown'),
                timestamp=datetime.fromisoformat(data['timestamp']),
                fsm_state=data.get('fsm_state', 'unknown'),
                fsm_transitions=data.get('fsm_transitions', []),
                tools_used=data.get('tools_used', []),
                tool_calls=data.get('tool_calls', []),
                duration_ms=data.get('duration_ms', 0),
                success=data.get('success', False),
                error_type=data.get('error_type'),
                error_message=data.get('error_message'),
                context=data.get('context', {}),
                decision_path=data.get('decision_path', []),
                input_hash=data.get('input_hash', ''),
                output_hash=data.get('output_hash', '')
            )
            self.traces.append(trace)
    
    def analyze_traces(
        self,
        agent_id: str,
        agent_version: Optional[str] = None,
        window_days: int = 30
    ) -> BehaviorProfile:
        """Analyze traces for a specific agent."""
        # Filter traces
        cutoff_date = datetime.now() - timedelta(days=window_days)
        filtered_traces = [
            t for t in self.traces
            if t.agent_id == agent_id
            and (agent_version is None or t.agent_version == agent_version)
            and t.timestamp >= cutoff_date
        ]
        
        if not filtered_traces:
            return BehaviorProfile(
                agent_id=agent_id,
                agent_version=agent_version or "unknown",
                analyzed_at=datetime.now(),
                total_traces_analyzed=0
            )
        
        # Compute all metrics
        profile = BehaviorProfile(
            agent_id=agent_id,
            agent_version=agent_version or filtered_traces[0].agent_version,
            analyzed_at=datetime.now(),
            total_traces_analyzed=len(filtered_traces),
            analysis_window_days=window_days
        )
        
        # FSM Compliance
        profile.fsm_compliance_rate = self._compute_fsm_compliance(filtered_traces)
        profile.invalid_transitions = self._detect_invalid_transitions(filtered_traces)
        
        # Tool Usage
        tool_metrics = self._analyze_tool_usage(filtered_traces)
        profile.tool_discipline_score = tool_metrics['discipline_score']
        profile.tool_overuse_rate = tool_metrics['overuse_rate']
        profile.unique_tools_used = tool_metrics['unique_tools']
        profile.total_tool_calls = tool_metrics['total_calls']
        profile.tool_frequency = tool_metrics['frequency']
        
        # Performance
        perf_metrics = self._analyze_performance(filtered_traces)
        profile.success_rate = perf_metrics['success_rate']
        profile.avg_latency_ms = perf_metrics['avg_latency']
        profile.p95_latency_ms = perf_metrics['p95_latency']
        profile.p99_latency_ms = perf_metrics['p99_latency']
        profile.latency_violations = perf_metrics['latency_violations']
        profile.failure_rate = 1 - perf_metrics['success_rate']
        
        # Decision Quality
        profile.decision_entropy = self._compute_decision_entropy(filtered_traces)
        profile.decision_consistency = self._compute_decision_consistency(filtered_traces)
        
        # Failure Analysis
        failure_metrics = self._analyze_failures(filtered_traces)
        profile.failure_loops_detected = failure_metrics['loop_count']
        profile.recurring_errors = failure_metrics['recurring_errors']
        
        # Hallucination Detection
        hallucination_metrics = self._detect_hallucinations(filtered_traces)
        profile.hallucination_markers = hallucination_metrics['markers']
        profile.hallucination_rate = hallucination_metrics['rate']
        
        # Compute Trust Score
        components = TrustScoreComponents(
            fsm_compliance=profile.fsm_compliance_rate,
            tool_discipline=profile.tool_discipline_score,
            success_rate=profile.success_rate,
            latency_adherence=max(0, 1 - (profile.latency_violations / max(len(filtered_traces), 1))),
            hallucination_penalty=profile.hallucination_rate
        )
        profile.trust_score = components.compute_total()
        profile.governance_level = self._determine_governance_level(profile.trust_score)
        
        # Store profile
        key = f"{agent_id}:{agent_version or 'latest'}"
        self.profiles[key] = profile
        
        return profile
    
    def _compute_fsm_compliance(self, traces: List[AgentTrace]) -> float:
        """Compute FSM compliance rate."""
        if not traces:
            return 0.0
        
        # Count valid transitions (each transition should follow FSM rules)
        valid_count = 0
        for trace in traces:
            # Check if transitions are valid (simplified - assumes valid if not empty)
            if trace.fsm_transitions and all(t != 'INVALID' for t in trace.fsm_transitions):
                valid_count += 1
        
        return valid_count / len(traces)
    
    def _detect_invalid_transitions(self, traces: List[AgentTrace]) -> List[str]:
        """Detect invalid FSM transitions."""
        invalid = []
        for trace in traces:
            for trans in trace.fsm_transitions:
                if trans.startswith('INVALID') or trans == 'ERROR':
                    invalid.append(f"{trace.trace_id}:{trans}")
        return invalid
    
    def _analyze_tool_usage(self, traces: List[AgentTrace]) -> Dict[str, Any]:
        """Analyze tool usage patterns."""
        if not traces:
            return {
                'discipline_score': 0.0,
                'overuse_rate': 0.0,
                'unique_tools': 0,
                'total_calls': 0,
                'frequency': {}
            }
        
        # Count tool usage
        tool_counts = defaultdict(int)
        total_calls = 0
        overuse_count = 0
        
        for trace in traces:
            for tool in trace.tools_used:
                tool_counts[tool] += 1
                total_calls += 1
            
            # Check for tool overuse
            if len(trace.tool_calls) > self.MAX_TOOL_CALLS_PER_TRACE:
                overuse_count += 1
        
        unique_tools = len(tool_counts)
        overuse_rate = overuse_count / len(traces)
        
        # Discipline score: lower is better for tool usage
        # Penalize excessive tool variety and overuse
        avg_tools_per_trace = total_calls / len(traces) if traces else 0
        discipline_score = max(0, 1 - (overuse_rate * 0.5) - (avg_tools_per_trace / 20))
        
        return {
            'discipline_score': discipline_score,
            'overuse_rate': overuse_rate,
            'unique_tools': unique_tools,
            'total_calls': total_calls,
            'frequency': dict(tool_counts)
        }
    
    def _analyze_performance(self, traces: List[AgentTrace]) -> Dict[str, Any]:
        """Analyze performance metrics."""
        if not traces:
            return {
                'success_rate': 0.0,
                'avg_latency': 0.0,
                'p95_latency': 0.0,
                'p99_latency': 0.0,
                'latency_violations': 0
            }
        
        successes = sum(1 for t in traces if t.success)
        latencies = [t.duration_ms for t in traces]
        violations = sum(1 for l in latencies if l > self.LATENCY_THRESHOLD_MS)
        
        return {
            'success_rate': successes / len(traces),
            'avg_latency': statistics.mean(latencies),
            'p95_latency': self._percentile(latencies, 95),
            'p99_latency': self._percentile(latencies, 99),
            'latency_violations': violations
        }
    
    def _compute_decision_entropy(self, traces: List[AgentTrace]) -> float:
        """Compute Shannon entropy of decision paths."""
        if not traces:
            return 0.0
        
        # Count decision path frequencies
        path_counts = defaultdict(int)
        for trace in traces:
            path_key = ' -> '.join(trace.decision_path) if trace.decision_path else 'none'
            path_counts[path_key] += 1
        
        # Calculate entropy
        total = len(traces)
        entropy = 0.0
        for count in path_counts.values():
            if count > 0:
                p = count / total
                entropy -= p * math.log2(p)
        
        return entropy
    
    def _compute_decision_consistency(self, traces: List[AgentTrace]) -> float:
        """Compute decision consistency (similar inputs -> similar outputs)."""
        if len(traces) < 2:
            return 1.0
        
        # Group by input hash
        input_groups = defaultdict(list)
        for trace in traces:
            if trace.input_hash:
                input_groups[trace.input_hash].append(trace.output_hash)
        
        # Calculate consistency: same input should produce same output
        consistent_count = 0
        total_groups = 0
        
        for outputs in input_groups.values():
            if len(outputs) > 1:
                total_groups += 1
                if len(set(outputs)) == 1:
                    consistent_count += 1
        
        if total_groups == 0:
            return 1.0
        
        return consistent_count / total_groups
    
    def _analyze_failures(self, traces: List[AgentTrace]) -> Dict[str, Any]:
        """Analyze failure patterns and detect loops."""
        error_counts = defaultdict(int)
        error_sequences = []
        
        for trace in traces:
            if trace.error_type:
                error_counts[trace.error_type] += 1
                error_sequences.append(trace.error_type)
        
        # Detect failure loops (same error repeating)
        loop_count = 0
        for i in range(len(error_sequences) - self.FAILURE_LOOP_THRESHOLD + 1):
            window = error_sequences[i:i + self.FAILURE_LOOP_THRESHOLD]
            if len(set(window)) == 1:
                loop_count += 1
        
        # Recurring errors (appear more than 3 times)
        recurring = [
            error for error, count in error_counts.items()
            if count >= 3
        ]
        
        return {
            'loop_count': loop_count,
            'recurring_errors': recurring,
            'error_distribution': dict(error_counts)
        }
    
    def _detect_hallucinations(self, traces: List[AgentTrace]) -> Dict[str, Any]:
        """Detect hallucination markers in traces."""
        markers = []
        
        for trace in traces:
            trace_markers = []
            
            # Check for contradictory actions
            if len(trace.tool_calls) >= 2:
                tools = [call.get('tool', '') for call in trace.tool_calls]
                # Check for undo/redo patterns
                for i in range(len(tools) - 1):
                    if tools[i].startswith('delete') and tools[i+1].startswith('create'):
                        trace_markers.append({
                            'type': HallucinationMarker.CONTRADICTORY_ACTIONS.value,
                            'detail': f"Delete followed by create: {tools[i]} -> {tools[i+1]}"
                        })
            
            # Check for tool misuse
            for call in trace.tool_calls:
                tool = call.get('tool', '')
                params = call.get('params', {})
                
                # Example: using search tool with empty query
                if tool == 'search' and not params.get('query'):
                    trace_markers.append({
                        'type': HallucinationMarker.TOOL_MISUSE.value,
                        'detail': 'Search tool called with empty query'
                    })
            
            # Check for impossible state transitions
            if trace.fsm_transitions:
                if 'ERROR->SUCCESS' in ' -> '.join(trace.fsm_transitions):
                    trace_markers.append({
                        'type': HallucinationMarker.IMPOSSIBLE_STATE.value,
                        'detail': 'Direct error to success transition detected'
                    })
            
            if trace_markers:
                for marker in trace_markers:
                    marker['trace_id'] = trace.trace_id
                    marker['timestamp'] = trace.timestamp.isoformat()
                markers.extend(trace_markers)
        
        hallucination_rate = len(markers) / len(traces) if traces else 0.0
        
        return {
            'markers': markers,
            'rate': hallucination_rate,
            'count': len(markers)
        }
    
    def _determine_governance_level(self, trust_score: float) -> GovernanceLevel:
        """Determine governance level from trust score."""
        if trust_score >= 0.90:
            return GovernanceLevel.CERTIFIED
        elif trust_score >= 0.70:
            return GovernanceLevel.SUPERVISED
        elif trust_score >= 0.50:
            return GovernanceLevel.RESTRICTED
        else:
            return GovernanceLevel.QUARANTINED
    
    def _percentile(self, values: List[float], p: float) -> float:
        """Calculate percentile."""
        if not values:
            return 0.0
        sorted_values = sorted(values)
        k = (len(sorted_values) - 1) * p / 100
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return sorted_values[int(k)]
        return sorted_values[int(f)] * (c - k) + sorted_values[int(c)] * (k - f)
    
    def _generate_id(self) -> str:
        """Generate unique ID."""
        return hashlib.sha256(
            f"{datetime.now().isoformat()}{random.random()}".encode()
        ).hexdigest()[:16]
    
    def compare_versions(
        self,
        agent_id: str,
        version_a: str,
        version_b: str
    ) -> Dict[str, Any]:
        """Compare behavior between two agent versions."""
        profile_a = self.profiles.get(f"{agent_id}:{version_a}")
        profile_b = self.profiles.get(f"{agent_id}:{version_b}")
        
        if not profile_a or not profile_b:
            return {'error': 'One or both profiles not found'}
        
        return {
            'trust_score_delta': profile_b.trust_score - profile_a.trust_score,
            'success_rate_delta': profile_b.success_rate - profile_a.success_rate,
            'latency_delta_ms': profile_b.avg_latency_ms - profile_a.avg_latency_ms,
            'hallucination_rate_delta': profile_b.hallucination_rate - profile_a.hallucination_rate,
            'governance_level_change': {
                'from': profile_a.governance_level.value,
                'to': profile_b.governance_level.value
            }
        }
    
    def generate_report(self, agent_id: str, agent_version: Optional[str] = None) -> str:
        """Generate human-readable analysis report."""
        key = f"{agent_id}:{agent_version or 'latest'}"
        profile = self.profiles.get(key)
        
        if not profile:
            return f"No profile found for {key}"
        
        report = f"""
# Agent Behavior Analysis Report
**Agent:** {profile.agent_id}  
**Version:** {profile.agent_version}  
**Analyzed:** {profile.analyzed_at.strftime('%Y-%m-%d %H:%M:%S')}  
**Traces:** {profile.total_traces_analyzed} (last {profile.analysis_window_days} days)

---

## Trust Score: {profile.trust_score:.2%}
**Governance Level:** {profile.governance_level.value.upper()}

### Score Breakdown
- FSM Compliance: {profile.fsm_compliance_rate:.2%} (weight: 25%)
- Tool Discipline: {profile.tool_discipline_score:.2%} (weight: 20%)
- Success Rate: {profile.success_rate:.2%} (weight: 20%)
- Latency Adherence: {max(0, 1 - profile.latency_violations / max(profile.total_traces_analyzed, 1)):.2%} (weight: 15%)
- Hallucination Penalty: {(1 - profile.hallucination_rate):.2%} (weight: 20%)

---

## Behavior Profile

### FSM Compliance
- Compliance Rate: {profile.fsm_compliance_rate:.2%}
- Invalid Transitions: {len(profile.invalid_transitions)}

### Tool Usage
- Discipline Score: {profile.tool_discipline_score:.2%}
- Overuse Rate: {profile.tool_overuse_rate:.2%}
- Unique Tools: {profile.unique_tools_used}
- Total Calls: {profile.total_tool_calls}

### Performance
- Success Rate: {profile.success_rate:.2%}
- Failure Rate: {profile.failure_rate:.2%}
- Avg Latency: {profile.avg_latency_ms:.1f}ms
- P95 Latency: {profile.p95_latency_ms:.1f}ms
- P99 Latency: {profile.p99_latency_ms:.1f}ms
- Latency Violations: {profile.latency_violations}

### Decision Quality
- Decision Entropy: {profile.decision_entropy:.2f} (lower is more predictable)
- Decision Consistency: {profile.decision_consistency:.2%}

### Failure Analysis
- Failure Loops: {profile.failure_loops_detected}
- Recurring Errors: {len(profile.recurring_errors)}
{chr(10).join(f"  - {err}" for err in profile.recurring_errors[:5])}

### Hallucination Detection
- Hallucination Rate: {profile.hallucination_rate:.2%}
- Markers Found: {len(profile.hallucination_markers)}

---

## Recommendations
"""
        
        # Add recommendations based on profile
        recommendations = []
        
        if profile.trust_score < 0.50:
            recommendations.append("CRITICAL: Agent is QUARANTINED. Immediate human review required.")
        elif profile.trust_score < 0.70:
            recommendations.append("WARNING: Agent is RESTRICTED. Limited tool access enforced.")
        elif profile.trust_score < 0.90:
            recommendations.append("ADVISORY: Agent is SUPERVISED. Human oversight recommended.")
        
        if profile.hallucination_rate > 0.10:
            recommendations.append(f"Hallucination rate ({profile.hallucination_rate:.1%}) is high. Review tool usage patterns.")
        
        if profile.failure_loops_detected > 0:
            recommendations.append(f"Failure loops detected ({profile.failure_loops_detected}). Check error handling logic.")
        
        if profile.latency_violations > profile.total_traces_analyzed * 0.10:
            recommendations.append("Latency violations exceed 10%. Consider performance optimization.")
        
        if not recommendations:
            recommendations.append("Agent performing within expected parameters.")
        
        report += '\n'.join(f"{i+1}. {rec}" for i, rec in enumerate(recommendations))
        
        return report


# Convenience functions
def analyze_agent_traces(
    traces: List[Dict[str, Any]],
    agent_id: str,
    agent_version: Optional[str] = None
) -> BehaviorProfile:
    """Convenience function to analyze agent traces."""
    analyzer = AgentBehaviorAnalyzer()
    analyzer.load_traces(traces)
    return analyzer.analyze_traces(agent_id, agent_version)


def compute_trust_score(profile: BehaviorProfile) -> Tuple[float, GovernanceLevel]:
    """Compute trust score from profile."""
    return profile.trust_score, profile.governance_level
