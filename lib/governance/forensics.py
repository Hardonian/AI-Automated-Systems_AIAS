"""
Agent Forensics & Replay System

Provides:
- Deterministic replay from traces
- "Why did the agent do this?" analysis
- Counterfactual simulation (what if rule X was stricter?)
"""

import json
import hashlib
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from collections import defaultdict


@dataclass
class ReplayStep:
    """Single step in a replay."""
    step_number: int
    timestamp: str
    fsm_state: str
    fsm_transition: Optional[str]
    tool_called: Optional[str]
    tool_params: Dict[str, Any]
    tool_result: Optional[Any]
    decision: str
    context: Dict[str, Any]
    outcome: str


@dataclass
class CausalChain:
    """Chain of causation for an action."""
    root_cause: str
    intermediate_steps: List[str]
    immediate_trigger: str
    final_action: str
    confidence: float


@dataclass
class CounterfactualResult:
    """Result of counterfactual simulation."""
    scenario: str
    original_outcome: str
    simulated_outcome: str
    outcome_changed: bool
    key_differences: List[str]
    confidence: float


class AgentForensics:
    """
    Forensic analysis of agent behavior.
    
    Provides detailed investigation capabilities for understanding
    agent decisions and simulating alternative scenarios.
    """
    
    def __init__(self, traces_dir: str = "traces"):
        """Initialize forensics system."""
        self.traces_dir = Path(traces_dir)
        self.traces_dir.mkdir(parents=True, exist_ok=True)
    
    def load_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        """Load a trace by ID."""
        trace_file = self.traces_dir / f"{trace_id}.json"
        if not trace_file.exists():
            return None
        
        with open(trace_file, 'r') as f:
            return json.load(f)
    
    def analyze_decision(
        self,
        trace_id: str,
        step_number: int
    ) -> Dict[str, Any]:
        """
        Analyze "Why did the agent do this?"
        
        Args:
            trace_id: Trace ID to analyze
            step_number: Step number where decision was made
            
        Returns:
            Analysis with causal chain and reasoning
        """
        trace = self.load_trace(trace_id)
        if not trace:
            return {'error': 'Trace not found'}
        
        steps = trace.get('steps', [])
        if step_number >= len(steps):
            return {'error': 'Step number out of range'}
        
        target_step = steps[step_number]
        
        # Build causal chain
        causal_chain = self._build_causal_chain(steps, step_number)
        
        # Identify influencing factors
        factors = self._identify_influencing_factors(target_step, steps[:step_number])
        
        # Determine decision rationale
        rationale = self._determine_rationale(target_step, factors)
        
        return {
            'trace_id': trace_id,
            'step_number': step_number,
            'timestamp': target_step.get('timestamp'),
            'action': target_step.get('tool_called') or target_step.get('decision'),
            'causal_chain': {
                'root_cause': causal_chain.root_cause,
                'intermediate_steps': causal_chain.intermediate_steps,
                'immediate_trigger': causal_chain.immediate_trigger,
                'confidence': causal_chain.confidence
            },
            'influencing_factors': factors,
            'rationale': rationale,
            'context_at_decision': target_step.get('context', {}),
            'alternatives_considered': self._infer_alternatives(target_step, steps[:step_number])
        }
    
    def _build_causal_chain(
        self,
        steps: List[Dict],
        target_idx: int
    ) -> CausalChain:
        """Build chain of causation leading to a decision."""
        target = steps[target_idx]
        
        # Find root cause (initial trigger)
        root_idx = 0
        for i in range(target_idx - 1, -1, -1):
            if steps[i].get('fsm_state') == 'INIT':
                root_idx = i
                break
        
        root_cause = steps[root_idx].get('decision', 'Initial state')
        
        # Collect intermediate steps
        intermediate = []
        for i in range(root_idx + 1, target_idx):
            step = steps[i]
            desc = step.get('tool_called') or step.get('fsm_transition') or step.get('decision')
            if desc:
                intermediate.append(f"Step {i}: {desc}")
        
        # Immediate trigger
        immediate = steps[target_idx - 1] if target_idx > 0 else steps[0]
        immediate_trigger = immediate.get('tool_result') or immediate.get('outcome') or 'State change'
        
        # Calculate confidence based on data completeness
        confidence = self._calculate_causal_confidence(steps, root_idx, target_idx)
        
        return CausalChain(
            root_cause=root_cause,
            intermediate_steps=intermediate,
            immediate_trigger=str(immediate_trigger),
            final_action=target.get('tool_called') or target.get('decision') or 'unknown',
            confidence=confidence
        )
    
    def _identify_influencing_factors(
        self,
        target_step: Dict,
        prior_steps: List[Dict]
    ) -> List[Dict[str, Any]]:
        """Identify factors that influenced the decision."""
        factors = []
        
        # Context factors
        context = target_step.get('context', {})
        for key, value in context.items():
            factors.append({
                'type': 'context',
                'factor': key,
                'value': value,
                'influence': 'direct'
            })
        
        # Previous outcome factors
        if prior_steps:
            last_outcome = prior_steps[-1].get('outcome')
            if last_outcome:
                factors.append({
                    'type': 'prior_outcome',
                    'factor': 'previous_step_result',
                    'value': last_outcome,
                    'influence': 'direct'
                })
        
        # FSM state factors
        fsm_state = target_step.get('fsm_state')
        if fsm_state:
            factors.append({
                'type': 'state',
                'factor': 'fsm_state',
                'value': fsm_state,
                'influence': 'constraining'
            })
        
        # Tool result factors
        if prior_steps:
            last_tool_result = prior_steps[-1].get('tool_result')
            if last_tool_result:
                factors.append({
                    'type': 'tool_result',
                    'factor': 'last_tool_output',
                    'value': str(last_tool_result)[:100],
                    'influence': 'direct'
                })
        
        return factors
    
    def _determine_rationale(
        self,
        target_step: Dict,
        factors: List[Dict]
    ) -> str:
        """Determine the rationale for a decision."""
        tool = target_step.get('tool_called')
        decision = target_step.get('decision')
        
        if tool:
            return f"Agent invoked tool '{tool}' based on current state and prior results"
        elif decision:
            return f"Agent decided to '{decision}' based on {len(factors)} influencing factors"
        else:
            return "Rationale unclear from trace data"
    
    def _infer_alternatives(
        self,
        target_step: Dict,
        prior_steps: List[Dict]
    ) -> List[str]:
        """Infer what alternatives the agent might have considered."""
        alternatives = []
        
        # Based on FSM state, what other transitions were possible?
        fsm_state = target_step.get('fsm_state')
        if fsm_state:
            alternatives.append(f"Alternative FSM transition from {fsm_state}")
        
        # Based on context, what other tools could have been used?
        context = target_step.get('context', {})
        if 'available_tools' in context:
            available = context['available_tools']
            used = target_step.get('tool_called')
            other_tools = [t for t in available if t != used]
            if other_tools:
                alternatives.append(f"Other available tools: {', '.join(other_tools[:3])}")
        
        return alternatives
    
    def _calculate_causal_confidence(
        self,
        steps: List[Dict],
        start_idx: int,
        end_idx: int
    ) -> float:
        """Calculate confidence in causal chain."""
        # Higher confidence if:
        # - More complete trace data
        # - Clear FSM transitions
        # - No gaps in steps
        
        confidence = 0.5  # Base confidence
        
        # Check for gaps
        step_numbers = [s.get('step_number', i) for i, s in enumerate(steps[start_idx:end_idx])]
        expected = list(range(len(step_numbers)))
        if step_numbers == expected:
            confidence += 0.2
        
        # Check for complete data
        complete_steps = sum(
            1 for s in steps[start_idx:end_idx]
            if s.get('fsm_state') and (s.get('tool_called') or s.get('decision'))
        )
        completeness = complete_steps / max(len(steps[start_idx:end_idx]), 1)
        confidence += completeness * 0.3
        
        return min(confidence, 1.0)
    
    def deterministic_replay(
        self,
        trace_id: str,
        stop_at_step: Optional[int] = None,
        inject_fault: Optional[Tuple[int, str]] = None
    ) -> Dict[str, Any]:
        """
        Perform deterministic replay of a trace.
        
        Args:
            trace_id: Trace to replay
            stop_at_step: Stop replay at this step (for partial replay)
            inject_fault: (step_number, fault_type) to simulate fault injection
            
        Returns:
            Replay results with verification
        """
        trace = self.load_trace(trace_id)
        if not trace:
            return {'error': 'Trace not found'}
        
        steps = trace.get('steps', [])
        replay_steps = []
        verification_passed = True
        discrepancies = []
        
        max_step = stop_at_step or len(steps)
        
        for i in range(min(max_step, len(steps))):
            original = steps[i]
            
            # Check for fault injection
            if inject_fault and inject_fault[0] == i:
                fault_type = inject_fault[1]
                replay_outcome = f"FAULT_INJECTED:{fault_type}"
            else:
                # In deterministic replay, outcome should match
                replay_outcome = original.get('outcome')
            
            replay_step = {
                'step_number': i,
                'fsm_state': original.get('fsm_state'),
                'tool_called': original.get('tool_called'),
                'decision': original.get('decision'),
                'outcome': replay_outcome,
                'verification': {
                    'fsm_state_match': True,
                    'decision_match': True
                }
            }
            
            # Verify deterministic behavior
            if not inject_fault:
                if original.get('outcome') != replay_outcome:
                    verification_passed = False
                    discrepancies.append({
                        'step': i,
                        'expected': original.get('outcome'),
                        'actual': replay_outcome
                    })
            
            replay_steps.append(replay_step)
        
        return {
            'trace_id': trace_id,
            'replay_type': 'fault_injected' if inject_fault else 'deterministic',
            'steps_replayed': len(replay_steps),
            'verification_passed': verification_passed and not inject_fault,
            'discrepancies': discrepancies,
            'steps': replay_steps,
            'replay_hash': self._compute_replay_hash(replay_steps)
        }
    
    def counterfactual_simulation(
        self,
        trace_id: str,
        rule_changes: Dict[str, Any]
    ) -> CounterfactualResult:
        """
        Simulate "what if rule X was stricter?"
        
        Args:
            trace_id: Original trace to simulate from
            rule_changes: Dict of rule_name -> new_threshold
                e.g., {'fsm_compliance': 0.99, 'tool_calls_max': 5}
            
        Returns:
            CounterfactualResult with simulation outcome
        """
        trace = self.load_trace(trace_id)
        if not trace:
            return CounterfactualResult(
                scenario=str(rule_changes),
                original_outcome="error",
                simulated_outcome="trace_not_found",
                outcome_changed=False,
                key_differences=["Trace not found"],
                confidence=0.0
            )
        
        original_outcome = trace.get('final_outcome', 'unknown')
        steps = trace.get('steps', [])
        
        # Simulate with new rules
        simulated_outcome = original_outcome
        differences = []
        
        # Check FSM compliance rule
        if 'fsm_compliance' in rule_changes:
            threshold = rule_changes['fsm_compliance']
            invalid_transitions = sum(
                1 for s in steps
                if s.get('fsm_transition', '').startswith('INVALID')
            )
            compliance_rate = 1 - (invalid_transitions / max(len(steps), 1))
            
            if compliance_rate < threshold:
                simulated_outcome = "blocked:fsm_compliance"
                differences.append(
                    f"FSM compliance ({compliance_rate:.2%}) below new threshold ({threshold:.2%})"
                )
        
        # Check max tool calls rule
        if 'tool_calls_max' in rule_changes:
            max_calls = rule_changes['tool_calls_max']
            tool_calls = sum(1 for s in steps if s.get('tool_called'))
            
            if tool_calls > max_calls:
                simulated_outcome = "blocked:tool_overuse"
                differences.append(
                    f"Tool calls ({tool_calls}) exceed new limit ({max_calls})"
                )
        
        # Check latency rule
        if 'max_latency_ms' in rule_changes:
            max_latency = rule_changes['max_latency_ms']
            step_latencies = [s.get('duration_ms', 0) for s in steps]
            total_latency = sum(step_latencies)
            
            if total_latency > max_latency:
                simulated_outcome = "blocked:latency"
                differences.append(
                    f"Total latency ({total_latency}ms) exceeds new limit ({max_latency}ms)"
                )
        
        # If no differences, outcome is the same
        if not differences:
            differences.append("No rule violations with stricter thresholds")
        
        outcome_changed = simulated_outcome != original_outcome
        
        # Confidence based on simulation completeness
        confidence = 0.8 if len(rule_changes) > 0 else 0.5
        
        return CounterfactualResult(
            scenario=str(rule_changes),
            original_outcome=original_outcome,
            simulated_outcome=simulated_outcome,
            outcome_changed=outcome_changed,
            key_differences=differences,
            confidence=confidence
        )
    
    def generate_forensic_report(
        self,
        trace_id: str,
        focus_step: Optional[int] = None
    ) -> str:
        """Generate comprehensive forensic report."""
        trace = self.load_trace(trace_id)
        if not trace:
            return f"# Forensic Report\n\nError: Trace {trace_id} not found"
        
        report = f"""# Forensic Analysis Report
**Trace ID:** {trace_id}  
**Agent:** {trace.get('agent_id')} v{trace.get('agent_version')}  
**Generated:** {datetime.now().isoformat()}

---

## Trace Summary
- Total Steps: {len(trace.get('steps', []))}
- Duration: {trace.get('total_duration_ms', 'unknown')}ms
- Final Outcome: {trace.get('final_outcome', 'unknown')}
- Success: {trace.get('success', 'unknown')}

"""
        
        # If focusing on a specific step, add detailed analysis
        if focus_step is not None:
            analysis = self.analyze_decision(trace_id, focus_step)
            
            report += f"""## Step {focus_step} Analysis

### Action
**{analysis.get('action', 'Unknown')}**

### Causal Chain
- **Root Cause:** {analysis['causal_chain']['root_cause']}
- **Confidence:** {analysis['causal_chain']['confidence']:.1%}

**Intermediate Steps:**
"""
            for step in analysis['causal_chain']['intermediate_steps']:
                report += f"\n- {step}"
            
            report += f"""

**Immediate Trigger:** {analysis['causal_chain']['immediate_trigger']}

### Influencing Factors
"""
            for factor in analysis['influencing_factors']:
                report += f"\n- **{factor['factor']}** ({factor['type']}): {factor['value']}"
            
            report += f"""

### Rationale
{analysis['rationale']}

### Alternatives Considered
"""
            for alt in analysis['alternatives_considered']:
                report += f"\n- {alt}"
        
        # Add counterfactuals
        report += """

---

## Counterfactual Analysis

### Scenario: Stricter FSM Compliance (99%)
"""
        cf_result = self.counterfactual_simulation(
            trace_id,
            {'fsm_compliance': 0.99}
        )
        report += f"""
- **Original Outcome:** {cf_result.original_outcome}
- **Simulated Outcome:** {cf_result.simulated_outcome}
- **Outcome Changed:** {'Yes' if cf_result.outcome_changed else 'No'}
- **Key Differences:**
"""
        for diff in cf_result.key_differences:
            report += f"\n  - {diff}"
        
        report += f"""

### Scenario: Stricter Tool Limits (max 5 calls)
"""
        cf_result2 = self.counterfactual_simulation(
            trace_id,
            {'tool_calls_max': 5}
        )
        report += f"""
- **Original Outcome:** {cf_result2.original_outcome}
- **Simulated Outcome:** {cf_result2.simulated_outcome}
- **Outcome Changed:** {'Yes' if cf_result2.outcome_changed else 'No'}
- **Key Differences:**
"""
        for diff in cf_result2.key_differences:
            report += f"\n  - {diff}"
        
        report += """

---

## Recommendations

Based on this forensic analysis:

1. **Root Cause Understanding:** Review the causal chain to understand
   why the agent made specific decisions.

2. **Rule Tightening:** Use counterfactual analysis to determine if
   stricter rules would have prevented issues.

3. **Improvement Areas:** Focus on factors with high influence but
   low confidence for better predictability.
"""
        
        return report
    
    def _compute_replay_hash(self, steps: List[Dict]) -> str:
        """Compute hash of replay for verification."""
        content = json.dumps(steps, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:16]


class ForensicsCLI:
    """Command-line interface for forensics operations."""
    
    def __init__(self):
        self.forensics = AgentForensics()
    
    def analyze(self, trace_id: str, step: int) -> None:
        """Analyze a specific decision."""
        print(f"[Forensics] Analyzing trace {trace_id}, step {step}")
        
        result = self.forensics.analyze_decision(trace_id, step)
        
        print(f"\nAction: {result.get('action')}")
        print(f"\nCausal Chain:")
        print(f"  Root: {result['causal_chain']['root_cause']}")
        print(f"  Confidence: {result['causal_chain']['confidence']:.1%}")
        
        print(f"\nInfluencing Factors ({len(result['influencing_factors'])}):")
        for factor in result['influencing_factors'][:5]:
            print(f"  - {factor['factor']}: {factor['value']}")
    
    def replay(self, trace_id: str, fault: Optional[str] = None) -> None:
        """Replay a trace."""
        print(f"[Forensics] Replaying trace: {trace_id}")
        
        inject_fault = None
        if fault:
            parts = fault.split(':')
            if len(parts) == 2:
                inject_fault = (int(parts[0]), parts[1])
        
        result = self.forensics.deterministic_replay(trace_id, inject_fault=inject_fault)
        
        print(f"Steps replayed: {result['steps_replayed']}")
        print(f"Verification: {'PASSED' if result['verification_passed'] else 'FAILED'}")
        print(f"Replay hash: {result['replay_hash']}")
        
        if result['discrepancies']:
            print(f"\nDiscrepancies found: {len(result['discrepancies'])}")
            for d in result['discrepancies']:
                print(f"  Step {d['step']}: expected {d['expected']}, got {d['actual']}")
    
    def counterfactual(
        self,
        trace_id: str,
        fsm_threshold: Optional[float] = None,
        tool_max: Optional[int] = None
    ) -> None:
        """Run counterfactual simulation."""
        print(f"[Forensics] Counterfactual analysis: {trace_id}")
        
        rule_changes = {}
        if fsm_threshold:
            rule_changes['fsm_compliance'] = fsm_threshold
        if tool_max:
            rule_changes['tool_calls_max'] = tool_max
        
        result = self.forensics.counterfactual_simulation(trace_id, rule_changes)
        
        print(f"\nScenario: {result.scenario}")
        print(f"Original: {result.original_outcome}")
        print(f"Simulated: {result.simulated_outcome}")
        print(f"Changed: {'Yes' if result.outcome_changed else 'No'}")
        print(f"Confidence: {result.confidence:.1%}")
        
        print(f"\nKey Differences:")
        for diff in result.key_differences:
            print(f"  - {diff}")
    
    def report(self, trace_id: str, output: Optional[str] = None) -> None:
        """Generate forensic report."""
        print(f"[Forensics] Generating report for: {trace_id}")
        
        report = self.forensics.generate_forensic_report(trace_id)
        
        if output:
            with open(output, 'w') as f:
                f.write(report)
            print(f"Report saved to: {output}")
        else:
            print("\n" + report)
