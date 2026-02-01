# Agent Behavior Intelligence System

Comprehensive agent behavior profiling, trust scoring, and governance for AIAS.

## Components

### 1. Analyzer (`analyzer.py`)
- Analyzes historical agent traces
- Profiles decision entropy, tool overuse, failure loops, hallucination markers
- Computes Trust Scores per agent version

### 2. Trust Ledger (`trust_ledger.py`)
- Immutable trust score history
- Blockchain-style verification
- Trust degradation tracking

### 3. Profiler (`profiler.py`)
- Real-time behavior profiling
- Anomaly detection
- Pattern recognition

## Usage

```python
from agent_behavior_intel import AgentBehaviorAnalyzer, TrustLedger, AgentProfiler

# Analyze an agent
analyzer = AgentBehaviorAnalyzer()
profile = analyzer.analyze_traces(agent_id="agent_v1", traces=traces)

# Get trust score
trust_score = profile.trust_score  # 0.0 - 1.0

# Query ledger
ledger = TrustLedger()
history = ledger.get_trust_history(agent_id="agent_v1")
```

## Trust Score Formula

```
Trust Score = (
  FSM_Compliance * 0.25 +
  Tool_Discipline * 0.20 +
  Success_Rate * 0.20 +
  Latency_Adherence * 0.15 +
  (1 - Hallucination_Rate) * 0.20
)
```

## Governance Levels

- **CERTIFIED** (>= 0.90): Fully autonomous
- **SUPERVISED** (0.70 - 0.89): Human oversight required
- **RESTRICTED** (0.50 - 0.69): Limited tool access
- **QUARANTINED** (< 0.50): Auto-disabled
