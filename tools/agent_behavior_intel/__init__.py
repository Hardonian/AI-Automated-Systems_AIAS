"""
Agent Behavior Intelligence System

Comprehensive agent behavior profiling, trust scoring, and governance.
"""

from .analyzer import (
    AgentBehaviorAnalyzer,
    BehaviorProfile,
    GovernanceLevel,
    HallucinationMarker,
    TrustScoreComponents,
    AgentTrace,
    analyze_agent_traces,
    compute_trust_score,
)

from .trust_ledger import (
    TrustLedger,
    TrustLedgerEntry,
    TrustScoreHistory,
    get_trust_ledger,
)

from .profiler import (
    AgentProfiler,
    AnomalyAlert,
    LiveTrace,
    ProfiledTrace,
    create_profiler,
)

__version__ = "1.0.0"
__all__ = [
    # Analyzer
    "AgentBehaviorAnalyzer",
    "BehaviorProfile",
    "GovernanceLevel",
    "HallucinationMarker",
    "TrustScoreComponents",
    "AgentTrace",
    "analyze_agent_traces",
    "compute_trust_score",
    # Trust Ledger
    "TrustLedger",
    "TrustLedgerEntry",
    "TrustScoreHistory",
    "get_trust_ledger",
    # Profiler
    "AgentProfiler",
    "AnomalyAlert",
    "LiveTrace",
    "ProfiledTrace",
    "create_profiler",
]
