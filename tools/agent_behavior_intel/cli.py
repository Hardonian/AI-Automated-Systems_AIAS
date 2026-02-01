#!/usr/bin/env python3
"""
Agent Behavior Intelligence CLI

Command-line interface for agent behavior profiling and governance.
"""

import argparse
import json
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_behavior_intel import (
    AgentBehaviorAnalyzer,
    TrustLedger,
    AgentProfiler,
    GovernanceLevel,
)


def cmd_analyze(args):
    """Analyze agent traces and generate report."""
    print(f"[AIAS-Governance] Analyzing agent: {args.agent_id} v{args.agent_version or 'latest'}")
    
    # Load traces
    with open(args.traces_file, 'r') as f:
        trace_data = json.load(f)
    
    # Analyze
    analyzer = AgentBehaviorAnalyzer()
    analyzer.load_traces(trace_data)
    profile = analyzer.analyze_traces(
        agent_id=args.agent_id,
        agent_version=args.agent_version,
        window_days=args.window_days
    )
    
    # Output
    if args.json:
        print(json.dumps(profile.to_dict(), indent=2))
    else:
        print(analyzer.generate_report(args.agent_id, args.agent_version))
    
    # Record to ledger if requested
    if args.record:
        ledger = TrustLedger()
        ledger.record_trust_score(
            agent_id=profile.agent_id,
            agent_version=profile.agent_version,
            trust_score=profile.trust_score,
            governance_level=profile.governance_level.value,
            certification_status="analyzed",
            metadata={
                'fsm_compliance': profile.fsm_compliance_rate,
                'tool_discipline': profile.tool_discipline_score,
                'success_rate': profile.success_rate,
                'hallucination_rate': profile.hallucination_rate
            }
        )
        print(f"\n[Ledger] Trust score recorded: {profile.trust_score:.2%}")


def cmd_ledger_history(args):
    """Show trust score history for an agent."""
    ledger = TrustLedger()
    history = ledger.get_trust_history(
        agent_id=args.agent_id,
        agent_version=args.agent_version,
        limit=args.limit
    )
    
    print(f"\n# Trust Score History: {history.agent_id} ({history.agent_version})")
    print(f"Trend: {history.trend.upper()} | Volatility: {history.volatility:.4f}\n")
    
    print(f"{'Timestamp':<25} {'Score':<8} {'Level':<12} {'Status':<12}")
    print("-" * 60)
    
    for entry in history.scores:
        ts = entry['timestamp'][:19].replace('T', ' ')
        score = f"{entry['trust_score']:.2%}"
        level = entry['governance_level']
        status = entry['certification_status']
        print(f"{ts:<25} {score:<8} {level:<12} {status:<12}")


def cmd_ledger_verify(args):
    """Verify ledger integrity."""
    print("[AIAS-Governance] Verifying trust ledger integrity...")
    
    ledger = TrustLedger()
    result = ledger.verify_integrity()
    
    print(f"Entries checked: {result['entries_checked']}")
    print(f"Valid: {result['valid']}")
    
    if result['violations']:
        print(f"\n⚠️  {len(result['violations'])} violations found:")
        for v in result['violations']:
            print(f"  - Entry {v['entry_index']}: {v['type']}")
    else:
        print("\n✅ Ledger integrity verified")


def cmd_degradation_check(args):
    """Check for trust score degradation."""
    print(f"[AIAS-Governance] Checking degradation for: {args.agent_id}")
    
    ledger = TrustLedger()
    alert = ledger.detect_trust_degradation(
        agent_id=args.agent_id,
        threshold=args.threshold,
        window_entries=args.window
    )
    
    if alert:
        print(f"\n🚨 DEGRADATION ALERT")
        print(f"Severity: {alert['severity'].upper()}")
        print(f"Degradation: {alert['degradation_pct']:.1f}%")
        print(f"Previous High: {alert['previous_high']:.2%}")
        print(f"Current Score: {alert['current_score']:.2%}")
        print(f"\nRecommendation: {alert['recommendation']}")
        sys.exit(1)
    else:
        print("\n✅ No significant degradation detected")


def cmd_profile_live(args):
    """Start live profiling session."""
    print(f"[AIAS-Governance] Starting live profiler (window: {args.window} traces)")
    
    profiler = AgentProfiler(window_size=args.window)
    
    # Register alert handler
    def on_anomaly(alert):
        print(f"\n🚨 ANOMALY DETECTED")
        print(f"Type: {alert.anomaly_type}")
        print(f"Severity: {alert.severity}")
        print(f"Description: {alert.description}")
        print(f"Action: {alert.recommended_action}")
    
    profiler.register_anomaly_handler(on_anomaly)
    
    print("Profiler active. Press Ctrl+C to stop and view patterns.")
    print("(Simulating traces - in production, this would connect to agent stream)")
    
    try:
        # Simulate for demo
        import time
        time.sleep(2)
        
        # Show patterns detected
        patterns = profiler.detect_patterns()
        print("\n" + "="*50)
        print("PROFILING SESSION SUMMARY")
        print("="*50)
        print(json.dumps(patterns, indent=2, default=str))
        
    except KeyboardInterrupt:
        print("\n\nProfiler stopped.")


def cmd_export_ledger(args):
    """Export ledger to JSON."""
    ledger = TrustLedger()
    ledger.export_to_json(args.output)
    print(f"[AIAS-Governance] Ledger exported to: {args.output}")


def main():
    parser = argparse.ArgumentParser(
        prog='agent-behavior-intel',
        description='AIAS Agent Behavior Intelligence System'
    )
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Analyze command
    analyze_parser = subparsers.add_parser('analyze', help='Analyze agent traces')
    analyze_parser.add_argument('traces_file', help='JSON file with traces')
    analyze_parser.add_argument('--agent-id', required=True, help='Agent ID')
    analyze_parser.add_argument('--agent-version', help='Agent version')
    analyze_parser.add_argument('--window-days', type=int, default=30, help='Analysis window')
    analyze_parser.add_argument('--json', action='store_true', help='Output JSON')
    analyze_parser.add_argument('--record', action='store_true', help='Record to ledger')
    analyze_parser.set_defaults(func=cmd_analyze)
    
    # Ledger history command
    history_parser = subparsers.add_parser('history', help='Show trust score history')
    history_parser.add_argument('agent_id', help='Agent ID')
    history_parser.add_argument('--agent-version', help='Agent version')
    history_parser.add_argument('--limit', type=int, default=20, help='Max entries')
    history_parser.set_defaults(func=cmd_ledger_history)
    
    # Ledger verify command
    verify_parser = subparsers.add_parser('verify', help='Verify ledger integrity')
    verify_parser.set_defaults(func=cmd_ledger_verify)
    
    # Degradation check command
    degrade_parser = subparsers.add_parser('degradation', help='Check for trust degradation')
    degrade_parser.add_argument('agent_id', help='Agent ID')
    degrade_parser.add_argument('--threshold', type=float, default=0.10, help='Degradation threshold')
    degrade_parser.add_argument('--window', type=int, default=10, help='Window size')
    degrade_parser.set_defaults(func=cmd_degradation_check)
    
    # Live profile command
    profile_parser = subparsers.add_parser('profile', help='Start live profiling')
    profile_parser.add_argument('--window', type=int, default=1000, help='Trace window size')
    profile_parser.set_defaults(func=cmd_profile_live)
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export ledger')
    export_parser.add_argument('output', help='Output file path')
    export_parser.set_defaults(func=cmd_export_ledger)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    args.func(args)


if __name__ == '__main__':
    main()
