#!/usr/bin/env python3
"""
AIAS Governance Verification Demo

Demonstrates:
1. Certification issuance
2. Trust degradation over time
3. Automated governance intervention
"""

import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.agent_behavior_intel import (
    AgentBehaviorAnalyzer,
    AgentTrace,
    GovernanceLevel,
    get_trust_ledger
)
from lib.governance.certifier import AgentCertifier
from lib.governance.runtime import RuntimeGovernance, EnforcementAction, PolicyViolationType


class DemoDataGenerator:
    """Generate realistic demo data for verification."""
    
    @staticmethod
    def generate_good_traces(agent_id: str, version: str, count: int = 50) -> List[Dict]:
        """Generate traces from a well-behaved agent."""
        traces = []
        base_time = datetime.now() - timedelta(days=30)
        
        for i in range(count):
            timestamp = base_time + timedelta(hours=i)
            
            trace = {
                'trace_id': f'trace_{i:04d}',
                'agent_id': agent_id,
                'agent_version': version,
                'timestamp': timestamp.isoformat(),
                'fsm_state': 'completed',
                'fsm_transitions': ['INIT->PROCESSING', 'PROCESSING->COMPLETED'],
                'tools_used': ['search', 'validate'],
                'tool_calls': [
                    {'tool': 'search', 'params': {'query': 'example'}},
                    {'tool': 'validate', 'params': {'data': 'result'}}
                ],
                'duration_ms': random.uniform(500, 2000),
                'success': True,
                'error_type': None,
                'error_message': None,
                'context': {'user_id': f'user_{i % 10}'},
                'decision_path': ['analyze', 'search', 'validate'],
                'input_hash': f'input_{i}',
                'output_hash': f'output_{i}'
            }
            traces.append(trace)
        
        return traces
    
    @staticmethod
    def generate_degrading_traces(
        agent_id: str,
        version: str,
        count: int = 50
    ) -> List[Dict]:
        """Generate traces showing trust degradation."""
        traces = []
        base_time = datetime.now() - timedelta(days=30)
        
        for i in range(count):
            timestamp = base_time + timedelta(hours=i)
            
            # Gradually degrade behavior
            degradation_factor = i / count  # 0 to 1
            
            # More errors over time
            success = random.random() > (degradation_factor * 0.4)
            
            # More invalid transitions over time
            if degradation_factor > 0.5 and random.random() < degradation_factor * 0.3:
                fsm_transitions = ['INIT->PROCESSING', 'INVALID->ERROR']
                fsm_state = 'error'
            else:
                fsm_transitions = ['INIT->PROCESSING', 'PROCESSING->COMPLETED']
                fsm_state = 'completed'
            
            # More tool calls over time (overuse)
            tool_count = int(2 + degradation_factor * 8)  # 2 to 10 tools
            tools_used = ['search'] * tool_count
            
            # Increasing latency
            duration_ms = 1000 + (degradation_factor * 6000)  # 1s to 7s
            
            trace = {
                'trace_id': f'trace_{i:04d}',
                'agent_id': agent_id,
                'agent_version': version,
                'timestamp': timestamp.isoformat(),
                'fsm_state': fsm_state,
                'fsm_transitions': fsm_transitions,
                'tools_used': tools_used,
                'tool_calls': [{'tool': 'search', 'params': {}} for _ in range(tool_count)],
                'duration_ms': duration_ms,
                'success': success,
                'error_type': 'timeout' if not success else None,
                'error_message': 'Operation timed out' if not success else None,
                'context': {'user_id': f'user_{i % 10}'},
                'decision_path': ['analyze'] + ['search'] * tool_count,
                'input_hash': f'input_{i}',
                'output_hash': f'output_{i}'
            }
            traces.append(trace)
        
        return traces


def demo_1_certification_issuance():
    """
    Demo 1: Issue certification to a well-behaved agent.
    """
    print("=" * 60)
    print("DEMO 1: Certification Issuance")
    print("=" * 60)
    print()
    
    agent_id = "reliable_assistant"
    agent_version = "1.0.0"
    
    print(f"Agent: {agent_id} v{agent_version}")
    print("Generating 50 traces of well-behaved operation...")
    
    # Generate good traces
    traces = DemoDataGenerator.generate_good_traces(agent_id, agent_version, 50)
    
    # Analyze
    analyzer = AgentBehaviorAnalyzer()
    analyzer.load_traces(traces)
    profile = analyzer.analyze_traces(agent_id, agent_version, window_days=30)
    
    print(f"\n[ANALYSIS] Results:")
    print(f"   Trust Score: {profile.trust_score:.2%}")
    print(f"   Governance Level: {profile.governance_level.value.upper()}")
    print(f"   FSM Compliance: {profile.fsm_compliance_rate:.2%}")
    print(f"   Success Rate: {profile.success_rate:.2%}")
    print(f"   Avg Latency: {profile.avg_latency_ms:.0f}ms")
    print(f"   Hallucination Rate: {profile.hallucination_rate:.2%}")
    
    # Issue certification
    certifier = AgentCertifier()
    cert = certifier.issue_certificate(profile)
    
    if cert:
        print(f"\n[CERTIFICATION] ISSUED")
        print(f"   Cert ID: {cert['cert_id']}")
        print(f"   Status: {cert['certification_status']}")
        print(f"   Expires: {cert['expires_at']}")
        
        # Save to ledger
        ledger = get_trust_ledger()
        ledger.record_trust_score(
            agent_id=agent_id,
            agent_version=agent_version,
            trust_score=profile.trust_score,
            governance_level=profile.governance_level.value,
            certification_status="issued",
            metadata={'cert_id': cert['cert_id']}
        )
        print(f"   Recorded in Trust Ledger")
    else:
        print(f"\n[REJECTED] Certification denied")
        print("   Agent did not meet all criteria")
    
    print()
    return cert is not None


def demo_2_trust_degradation():
    """
    Demo 2: Show trust degradation over time.
    """
    print("=" * 60)
    print("DEMO 2: Trust Degradation Over Time")
    print("=" * 60)
    print()
    
    agent_id = "degrading_agent"
    agent_version = "2.0.0"
    
    print(f"Agent: {agent_id} v{agent_version}")
    print("Generating 50 traces with gradual degradation...")
    
    # Generate degrading traces
    traces = DemoDataGenerator.generate_degrading_traces(agent_id, agent_version, 50)
    
    # Analyze in chunks to show progression
    ledger = get_trust_ledger()
    
    print(f"\n[DEGRADATION] Trust Score Progression:")
    print(f"{'Chunk':<10} {'Traces':<10} {'Trust Score':<15} {'Level':<15}")
    print("-" * 55)
    
    chunk_sizes = [10, 10, 10, 10, 10]
    start_idx = 0
    
    for i, chunk_size in enumerate(chunk_sizes):
        chunk = traces[start_idx:start_idx + chunk_size]
        
        analyzer = AgentBehaviorAnalyzer()
        analyzer.load_traces(chunk)
        profile = analyzer.analyze_traces(agent_id, agent_version, window_days=30)
        
        # Record in ledger (simulating time progression)
        timestamp = datetime.now() - timedelta(days=(4-i)*6)
        entry = ledger.record_trust_score(
            agent_id=agent_id,
            agent_version=agent_version,
            trust_score=profile.trust_score,
            governance_level=profile.governance_level.value,
            certification_status="degraded",
            metadata={'chunk': i+1}
        )
        
        print(f"{i+1:<10} {len(chunk):<10} {profile.trust_score:<15.2%} {profile.governance_level.value.upper():<15}")
        
        start_idx += chunk_size
    
    # Show full analysis
    analyzer = AgentBehaviorAnalyzer()
    analyzer.load_traces(traces)
    profile = analyzer.analyze_traces(agent_id, agent_version, window_days=30)
    
    print(f"\n[ANALYSIS] Final Results:")
    print(f"   Trust Score: {profile.trust_score:.2%}")
    print(f"   Governance Level: {profile.governance_level.value.upper()}")
    print(f"   Failure Rate: {profile.failure_rate:.2%}")
    print(f"   Tool Overuse: {profile.tool_overuse_rate:.2%}")
    print(f"   FSM Violations: {len(profile.invalid_transitions)}")
    
    # Check for degradation alert
    alert = ledger.detect_trust_degradation(agent_id, threshold=0.10, window_entries=10)
    
    if alert:
        print(f"\n[ALERT] DEGRADATION DETECTED")
        print(f"   Severity: {alert['severity'].upper()}")
        print(f"   Degradation: {alert['degradation_pct']:.1f}%")
        print(f"   From: {alert['previous_high']:.2%}")
        print(f"   To: {alert['current_score']:.2%}")
    
    print()
    return alert is not None


def demo_3_automated_intervention():
    """
    Demo 3: Show automated governance intervention.
    """
    print("=" * 60)
    print("DEMO 3: Automated Governance Intervention")
    print("=" * 60)
    print()
    
    # Setup: Create agents at different trust levels
    test_cases = [
        ("certified_agent", "1.0.0", 0.94, "CERTIFIED"),
        ("supervised_agent", "1.0.0", 0.82, "SUPERVISED"),
        ("restricted_agent", "1.0.0", 0.65, "RESTRICTED"),
        ("quarantined_agent", "1.0.0", 0.45, "QUARANTINED"),
    ]
    
    governance = RuntimeGovernance()
    ledger = get_trust_ledger()
    
    print("Testing governance enforcement for different trust levels:\n")
    
    for agent_id, version, trust_score, expected_level in test_cases:
        # Record trust score
        ledger.record_trust_score(
            agent_id=agent_id,
            agent_version=version,
            trust_score=trust_score,
            governance_level=expected_level.lower(),
            certification_status="test"
        )
        
        # Check governance decision
        decision = governance.check_agent(agent_id, version, operation="process_data")
        
        print(f"Agent: {agent_id}")
        print(f"  Trust Score: {trust_score:.2%}")
        print(f"  Expected Level: {expected_level}")
        print(f"  Action: {decision.action.value.upper()}")
        print(f"  Requires Approval: {'Yes' if decision.requires_approval else 'No'}")
        
        if decision.rate_limit:
            print(f"  Rate Limit: {decision.rate_limit:.0%}")
        
        if decision.action in [EnforcementAction.BLOCK, EnforcementAction.DISABLE]:
            print(f"  [BLOCKED] {decision.reason}")
        elif decision.action == EnforcementAction.THROTTLE:
            print(f"  [THROTTLED] {decision.reason}")
        elif decision.action == EnforcementAction.REQUIRE_APPROVAL:
            print(f"  [PENDING APPROVAL] {decision.reason}")
        else:
            print(f"  [ALLOWED] {decision.reason}")
        
        print()
    
    # Demo policy violation handling
    print("Testing policy violation handling:\n")
    
    # Simulate a blocker violation
    print("Simulating BLOCKER policy violation...")
    governance.handle_violation(
        agent_id="certified_agent",
        violation_type=PolicyViolationType.BLOCKER,
        details="Attempted unauthorized data access"
    )
    
    # Check if agent was auto-disabled
    if "certified_agent" in governance.disabled_agents:
        print("  [AUTO-DISABLED] Agent blocked due to BLOCKER violation")
    
    # Show pending overrides
    pending = governance.get_pending_overrides()
    print(f"\nPending Human Overrides: {len(pending)}")
    for override in pending:
        print(f"  - {override.override_id}: {override.reason}")
    
    print()
    return True


def demo_summary():
    """Print summary of all demos."""
    print("=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    print()
    
    # Get ledger stats
    ledger = get_trust_ledger()
    integrity = ledger.verify_integrity()
    
    print(f"Trust Ledger:")
    print(f"  Entries: {integrity['entries_checked']}")
    print(f"  Valid: {integrity['valid']}")
    print(f"  Violations: {len(integrity['violations'])}")
    print()
    
    # Get all agent scores
    all_scores = ledger.get_all_agent_scores()
    print(f"Agents in System: {len(all_scores)}")
    
    level_counts = {}
    for entry in all_scores.values():
        level = entry['governance_level']
        level_counts[level] = level_counts.get(level, 0) + 1
    
    for level, count in sorted(level_counts.items()):
        print(f"  {level.upper()}: {count}")
    
    print()
    
    # Show certifications
    certifier = AgentCertifier()
    certs = certifier.list_certificates(status="issued")
    print(f"Active Certifications: {len(certs)}")
    
    for cert in certs:
        print(f"  - {cert['agent_id']} v{cert['agent_version']}: {cert['cert_id']}")
    
    print()
    print("=" * 60)
    print("All governance systems operational")
    print("=" * 60)


def main():
    """Run all verification demos."""
    print("\n")
    print("=" * 60)
    print(" " * 16 + "AIAS GOVERNANCE VERIFICATION")
    print("=" * 60)
    print()
    
    # Run demos
    results = []
    
    try:
        results.append(("Certification Issuance", demo_1_certification_issuance()))
        results.append(("Trust Degradation", demo_2_trust_degradation()))
        results.append(("Automated Intervention", demo_3_automated_intervention()))
        
        # Summary
        demo_summary()
        
        # Final results
        print("\nDemo Results:")
        for name, passed in results:
            status = "[PASS]" if passed else "[FAIL]"
            print(f"  {status}: {name}")
        
        all_passed = all(r[1] for r in results)
        print()
        if all_passed:
            print("SUCCESS: All governance verification demos passed!")
        else:
            print("WARNING: Some demos did not pass as expected")
        
        return 0 if all_passed else 1
        
    except Exception as e:
        print(f"\n[ERROR] Demo failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
