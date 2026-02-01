"""
Trust Ledger

Immutable, blockchain-style ledger for trust score history.
"""

import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path
import threading


@dataclass
class TrustLedgerEntry:
    """Single entry in the trust ledger."""
    entry_id: str
    timestamp: str
    agent_id: str
    agent_version: str
    trust_score: float
    governance_level: str
    certification_status: str
    previous_hash: Optional[str]
    sha256: str
    metadata: Dict[str, Any]


@dataclass
class TrustScoreHistory:
    """Trust score history for an agent."""
    agent_id: str
    agent_version: str
    scores: List[Dict[str, Any]]
    trend: str  # improving, stable, degrading
    volatility: float


class TrustLedger:
    """
    Immutable trust ledger with blockchain-style verification.
    
    Each entry contains:
    - Trust score snapshot
    - Governance level
    - Certification status
    - Cryptographic hash
    - Link to previous entry
    """
    
    def __init__(self, ledger_path: str = "guardian/logs/trust_ledger.jsonl"):
        """Initialize trust ledger."""
        self.ledger_path = Path(ledger_path)
        self.ledger_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._last_hash: Optional[str] = None
        self._load_last_hash()
    
    def _load_last_hash(self) -> None:
        """Load last hash from existing ledger."""
        if self.ledger_path.exists():
            with open(self.ledger_path, 'r') as f:
                lines = f.readlines()
                if lines:
                    last_entry = json.loads(lines[-1])
                    self._last_hash = last_entry.get('sha256')
    
    def _compute_hash(self, entry_data: str) -> str:
        """Compute SHA256 hash for entry."""
        return hashlib.sha256(entry_data.encode()).hexdigest()
    
    def record_trust_score(
        self,
        agent_id: str,
        agent_version: str,
        trust_score: float,
        governance_level: str,
        certification_status: str = "pending",
        metadata: Optional[Dict[str, Any]] = None
    ) -> TrustLedgerEntry:
        """
        Record a trust score in the ledger.
        
        Args:
            agent_id: Unique agent identifier
            agent_version: Agent version string
            trust_score: Computed trust score (0.0 - 1.0)
            governance_level: Current governance level
            certification_status: Certification status
            metadata: Additional metadata
            
        Returns:
            TrustLedgerEntry: The recorded entry
        """
        with self._lock:
            entry_id = f"{agent_id}:{agent_version}:{datetime.now().isoformat()}"
            timestamp = datetime.now().isoformat()
            
            # Create entry without hash first
            entry_dict = {
                'entry_id': entry_id,
                'timestamp': timestamp,
                'agent_id': agent_id,
                'agent_version': agent_version,
                'trust_score': trust_score,
                'governance_level': governance_level,
                'certification_status': certification_status,
                'previous_hash': self._last_hash,
                'metadata': metadata or {}
            }
            
            # Compute hash
            hash_content = json.dumps(entry_dict, sort_keys=True)
            sha256 = self._compute_hash(hash_content)
            
            # Create final entry
            entry = TrustLedgerEntry(
                entry_id=entry_id,
                timestamp=timestamp,
                agent_id=agent_id,
                agent_version=agent_version,
                trust_score=trust_score,
                governance_level=governance_level,
                certification_status=certification_status,
                previous_hash=self._last_hash,
                sha256=sha256,
                metadata=metadata or {}
            )
            
            # Append to ledger
            with open(self.ledger_path, 'a') as f:
                f.write(json.dumps(asdict(entry)) + '\n')
            
            # Update last hash
            self._last_hash = sha256
            
            return entry
    
    def get_trust_history(
        self,
        agent_id: str,
        agent_version: Optional[str] = None,
        limit: int = 100
    ) -> TrustScoreHistory:
        """
        Get trust score history for an agent.
        
        Args:
            agent_id: Agent identifier
            agent_version: Optional version filter
            limit: Maximum entries to return
            
        Returns:
            TrustScoreHistory: Trust score history with trend analysis
        """
        entries = []
        
        if self.ledger_path.exists():
            with open(self.ledger_path, 'r') as f:
                for line in f:
                    entry = json.loads(line.strip())
                    if entry['agent_id'] == agent_id:
                        if agent_version is None or entry['agent_version'] == agent_version:
                            entries.append(entry)
        
        # Sort by timestamp (newest first)
        entries.sort(key=lambda x: x['timestamp'], reverse=True)
        entries = entries[:limit]
        
        # Calculate trend
        trend = self._calculate_trend(entries)
        volatility = self._calculate_volatility(entries)
        
        return TrustScoreHistory(
            agent_id=agent_id,
            agent_version=agent_version or 'all',
            scores=list(reversed(entries)),  # Oldest first for charting
            trend=trend,
            volatility=volatility
        )
    
    def _calculate_trend(self, entries: List[Dict[str, Any]]) -> str:
        """Calculate trust score trend."""
        if len(entries) < 2:
            return 'stable'
        
        # Compare first and last (newest)
        scores = [e['trust_score'] for e in entries]
        
        if scores[0] > scores[-1] * 1.05:
            return 'degrading'
        elif scores[0] < scores[-1] * 0.95:
            return 'improving'
        else:
            return 'stable'
    
    def _calculate_volatility(self, entries: List[Dict[str, Any]]) -> float:
        """Calculate trust score volatility (standard deviation)."""
        if len(entries) < 2:
            return 0.0
        
        scores = [e['trust_score'] for e in entries]
        mean = sum(scores) / len(scores)
        variance = sum((s - mean) ** 2 for s in scores) / len(scores)
        return variance ** 0.5
    
    def verify_integrity(self) -> Dict[str, Any]:
        """
        Verify ledger integrity using hash chain.
        
        Returns:
            Dict with 'valid' boolean and list of 'violations'
        """
        violations = []
        previous_hash = None
        
        if not self.ledger_path.exists():
            return {'valid': True, 'violations': [], 'entries_checked': 0}
        
        with open(self.ledger_path, 'r') as f:
            lines = f.readlines()
        
        for i, line in enumerate(lines):
            entry = json.loads(line.strip())
            
            # Verify previous hash chain
            if previous_hash is not None:
                if entry.get('previous_hash') != previous_hash:
                    violations.append({
                        'entry_index': i,
                        'type': 'hash_chain_break',
                        'expected': previous_hash,
                        'actual': entry.get('previous_hash'),
                        'entry_id': entry.get('entry_id')
                    })
            
            # Verify entry hash
            entry_dict = {
                'entry_id': entry['entry_id'],
                'timestamp': entry['timestamp'],
                'agent_id': entry['agent_id'],
                'agent_version': entry['agent_version'],
                'trust_score': entry['trust_score'],
                'governance_level': entry['governance_level'],
                'certification_status': entry['certification_status'],
                'previous_hash': entry['previous_hash'],
                'metadata': entry['metadata']
            }
            expected_hash = self._compute_hash(json.dumps(entry_dict, sort_keys=True))
            
            if entry.get('sha256') != expected_hash:
                violations.append({
                    'entry_index': i,
                    'type': 'invalid_hash',
                    'expected': expected_hash,
                    'actual': entry.get('sha256'),
                    'entry_id': entry.get('entry_id')
                })
            
            previous_hash = entry.get('sha256')
        
        return {
            'valid': len(violations) == 0,
            'violations': violations,
            'entries_checked': len(lines)
        }
    
    def get_current_trust_score(
        self,
        agent_id: str,
        agent_version: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Get the most recent trust score for an agent."""
        history = self.get_trust_history(agent_id, agent_version, limit=1)
        
        if history.scores:
            return history.scores[-1]  # Most recent
        return None
    
    def get_all_agent_scores(self) -> Dict[str, Dict[str, Any]]:
        """Get current trust scores for all agents."""
        scores = {}
        
        if self.ledger_path.exists():
            with open(self.ledger_path, 'r') as f:
                for line in f:
                    entry = json.loads(line.strip())
                    agent_key = f"{entry['agent_id']}:{entry['agent_version']}"
                    # Keep only the most recent entry per agent
                    if agent_key not in scores:
                        scores[agent_key] = entry
                    else:
                        # Update if this entry is newer
                        if entry['timestamp'] > scores[agent_key]['timestamp']:
                            scores[agent_key] = entry
        
        return scores
    
    def detect_trust_degradation(
        self,
        agent_id: str,
        threshold: float = 0.10,
        window_entries: int = 10
    ) -> Optional[Dict[str, Any]]:
        """
        Detect if trust score is degrading significantly.
        
        Args:
            agent_id: Agent to check
            threshold: Degradation threshold (0.10 = 10% drop)
            window_entries: Number of recent entries to analyze
            
        Returns:
            Degradation alert or None if stable
        """
        history = self.get_trust_history(agent_id, limit=window_entries)
        
        if len(history.scores) < 2:
            return None
        
        scores = [e['trust_score'] for e in history.scores]
        max_score = max(scores)
        current_score = scores[-1]
        
        degradation = (max_score - current_score) / max_score if max_score > 0 else 0
        
        if degradation >= threshold:
            return {
                'agent_id': agent_id,
                'alert_type': 'trust_degradation',
                'severity': 'high' if degradation >= 0.25 else 'medium',
                'degradation_pct': degradation * 100,
                'previous_high': max_score,
                'current_score': current_score,
                'recommendation': 'Review agent behavior and consider human oversight'
            }
        
        return None
    
    def export_to_json(self, output_path: str) -> None:
        """Export entire ledger to JSON file."""
        entries = []
        
        if self.ledger_path.exists():
            with open(self.ledger_path, 'r') as f:
                for line in f:
                    entries.append(json.loads(line.strip()))
        
        with open(output_path, 'w') as f:
            json.dump({
                'exported_at': datetime.now().isoformat(),
                'total_entries': len(entries),
                'entries': entries
            }, f, indent=2)


# Singleton instance
_ledger_instance: Optional[TrustLedger] = None


def get_trust_ledger() -> TrustLedger:
    """Get singleton trust ledger instance."""
    global _ledger_instance
    if _ledger_instance is None:
        _ledger_instance = TrustLedger()
    return _ledger_instance
