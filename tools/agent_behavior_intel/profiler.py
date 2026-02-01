"""
Agent Profiler

Real-time behavior profiling and anomaly detection.
"""

import time
import json
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from datetime import datetime
from collections import deque
import threading


@dataclass
class LiveTrace:
    """Live execution trace."""
    trace_id: str
    agent_id: str
    started_at: float
    fsm_states: List[str] = field(default_factory=list)
    tools_used: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AnomalyAlert:
    """Anomaly detection alert."""
    alert_id: str
    timestamp: str
    agent_id: str
    anomaly_type: str
    severity: str  # low, medium, high, critical
    description: str
    trace_ids: List[str]
    recommended_action: str


class AgentProfiler:
    """
    Real-time agent behavior profiler.
    
    Features:
    - Live trace capture
    - Anomaly detection
    - Pattern recognition
    - Alert generation
    """
    
    def __init__(self, window_size: int = 1000):
        """
        Initialize profiler.
        
        Args:
            window_size: Number of traces to keep in memory
        """
        self.window_size = window_size
        self.active_traces: Dict[str, LiveTrace] = {}
        self.completed_traces: deque = deque(maxlen=window_size)
        self.anomaly_handlers: List[Callable[[AnomalyAlert], None]] = []
        self._lock = threading.Lock()
        self._patterns: Dict[str, Any] = {}
        
        # Anomaly detection thresholds
        self.thresholds = {
            'max_tool_calls': 15,
            'max_fsm_transitions': 20,
            'max_errors_per_trace': 3,
            'max_latency_ms': 10000,
            'rapid_tool_reuse': 5  # Same tool used 5+ times in one trace
        }
    
    def start_trace(self, agent_id: str, trace_id: Optional[str] = None) -> str:
        """Start profiling a new trace."""
        trace_id = trace_id or f"trace_{int(time.time() * 1000)}"
        
        with self._lock:
            self.active_traces[trace_id] = LiveTrace(
                trace_id=trace_id,
                agent_id=agent_id,
                started_at=time.time()
            )
        
        return trace_id
    
    def record_fsm_transition(self, trace_id: str, from_state: str, to_state: str) -> None:
        """Record an FSM state transition."""
        with self._lock:
            if trace_id in self.active_traces:
                trace = self.active_traces[trace_id]
                transition = f"{from_state}->{to_state}"
                trace.fsm_states.append(transition)
                
                # Check for anomaly: too many transitions
                if len(trace.fsm_states) > self.thresholds['max_fsm_transitions']:
                    self._emit_anomaly(
                        trace.agent_id,
                        'excessive_fsm_transitions',
                        'medium',
                        f"FSM transitions ({len(trace.fsm_states)}) exceed threshold",
                        [trace_id],
                        'Review FSM logic for infinite loops'
                    )
    
    def record_tool_use(self, trace_id: str, tool_name: str, params: Optional[Dict] = None) -> None:
        """Record a tool usage."""
        with self._lock:
            if trace_id in self.active_traces:
                trace = self.active_traces[trace_id]
                trace.tools_used.append(tool_name)
                
                # Check for tool overuse
                tool_count = trace.tools_used.count(tool_name)
                if tool_count > self.thresholds['rapid_tool_reuse']:
                    self._emit_anomaly(
                        trace.agent_id,
                        'tool_overuse',
                        'high',
                        f"Tool '{tool_name}' used {tool_count} times in single trace",
                        [trace_id],
                        'Consider throttling or disabling agent'
                    )
                
                # Check for total tool calls
                if len(trace.tools_used) > self.thresholds['max_tool_calls']:
                    self._emit_anomaly(
                        trace.agent_id,
                        'excessive_tool_calls',
                        'high',
                        f"Total tool calls ({len(trace.tools_used)}) exceed threshold",
                        [trace_id],
                        'Review agent efficiency'
                    )
    
    def record_error(self, trace_id: str, error_type: str, error_message: str) -> None:
        """Record an error in the trace."""
        with self._lock:
            if trace_id in self.active_traces:
                trace = self.active_traces[trace_id]
                trace.errors.append(f"{error_type}: {error_message}")
                
                # Check for error threshold
                if len(trace.errors) >= self.thresholds['max_errors_per_trace']:
                    self._emit_anomaly(
                        trace.agent_id,
                        'error_storm',
                        'critical',
                        f"Multiple errors ({len(trace.errors)}) in single trace",
                        [trace_id],
                        'Auto-disable agent and alert operator'
                    )
    
    def end_trace(
        self,
        trace_id: str,
        success: bool,
        output: Optional[Dict] = None
    ) -> Optional[LiveTrace]:
        """End a trace and move to completed queue."""
        with self._lock:
            if trace_id not in self.active_traces:
                return None
            
            trace = self.active_traces.pop(trace_id)
            
            # Calculate duration
            duration_ms = (time.time() - trace.started_at) * 1000
            
            # Check for latency anomaly
            if duration_ms > self.thresholds['max_latency_ms']:
                self._emit_anomaly(
                    trace.agent_id,
                    'high_latency',
                    'medium',
                    f"Trace completed in {duration_ms:.0f}ms (threshold: {self.thresholds['max_latency_ms']}ms)",
                    [trace_id],
                    'Review performance optimization'
                )
            
            # Store completed trace
            self.completed_traces.append({
                'trace': trace,
                'success': success,
                'duration_ms': duration_ms,
                'output': output,
                'completed_at': datetime.now().isoformat()
            })
            
            return trace
    
    def _emit_anomaly(
        self,
        agent_id: str,
        anomaly_type: str,
        severity: str,
        description: str,
        trace_ids: List[str],
        recommended_action: str
    ) -> None:
        """Emit an anomaly alert."""
        alert = AnomalyAlert(
            alert_id=f"alert_{int(time.time() * 1000)}",
            timestamp=datetime.now().isoformat(),
            agent_id=agent_id,
            anomaly_type=anomaly_type,
            severity=severity,
            description=description,
            trace_ids=trace_ids,
            recommended_action=recommended_action
        )
        
        # Call all registered handlers
        for handler in self.anomaly_handlers:
            try:
                handler(alert)
            except Exception as e:
                print(f"[AgentProfiler] Alert handler error: {e}")
    
    def register_anomaly_handler(self, handler: Callable[[AnomalyAlert], None]) -> None:
        """Register a handler for anomaly alerts."""
        self.anomaly_handlers.append(handler)
    
    def get_active_traces(self) -> List[Dict[str, Any]]:
        """Get all currently active traces."""
        with self._lock:
            return [
                {
                    'trace_id': t.trace_id,
                    'agent_id': t.agent_id,
                    'started_at': t.started_at,
                    'fsm_states': t.fsm_states,
                    'tools_used': t.tools_used,
                    'error_count': len(t.errors)
                }
                for t in self.active_traces.values()
            ]
    
    def get_recent_traces(self, n: int = 10) -> List[Dict[str, Any]]:
        """Get recent completed traces."""
        with self._lock:
            return [
                {
                    'trace_id': t['trace'].trace_id,
                    'agent_id': t['trace'].agent_id,
                    'success': t['success'],
                    'duration_ms': t['duration_ms'],
                    'tool_count': len(t['trace'].tools_used),
                    'error_count': len(t['trace'].errors)
                }
                for t in list(self.completed_traces)[-n:]
            ]
    
    def detect_patterns(self) -> Dict[str, Any]:
        """Detect patterns in recent traces."""
        with self._lock:
            traces = list(self.completed_traces)
        
        if not traces:
            return {'patterns': [], 'confidence': 0.0}
        
        patterns = {
            'common_tool_sequences': self._find_tool_sequences(traces),
            'error_patterns': self._find_error_patterns(traces),
            'performance_trends': self._analyze_performance_trends(traces),
            'agent_comparison': self._compare_agents(traces)
        }
        
        return patterns
    
    def _find_tool_sequences(self, traces: List[Dict]) -> List[Dict]:
        """Find common tool usage sequences."""
        sequences = {}
        
        for trace_data in traces:
            tools = trace_data['trace'].tools_used
            if len(tools) >= 2:
                # Look at pairs
                for i in range(len(tools) - 1):
                    seq = f"{tools[i]}->{tools[i+1]}"
                    sequences[seq] = sequences.get(seq, 0) + 1
        
        # Return sequences that appear 3+ times
        return [
            {'sequence': seq, 'frequency': count}
            for seq, count in sequences.items()
            if count >= 3
        ]
    
    def _find_error_patterns(self, traces: List[Dict]) -> List[Dict]:
        """Find recurring error patterns."""
        error_counts = {}
        
        for trace_data in traces:
            for error in trace_data['trace'].errors:
                error_counts[error] = error_counts.get(error, 0) + 1
        
        return [
            {'error': err, 'frequency': count}
            for err, count in error_counts.items()
            if count >= 2
        ]
    
    def _analyze_performance_trends(self, traces: List[Dict]) -> Dict:
        """Analyze performance trends."""
        if len(traces) < 2:
            return {'trend': 'insufficient_data'}
        
        durations = [t['duration_ms'] for t in traces]
        successes = [t['success'] for t in traces]
        
        avg_duration = sum(durations) / len(durations)
        success_rate = sum(successes) / len(successes)
        
        # Simple trend: compare first half vs second half
        mid = len(durations) // 2
        first_half_avg = sum(durations[:mid]) / max(mid, 1)
        second_half_avg = sum(durations[mid:]) / max(len(durations) - mid, 1)
        
        if second_half_avg > first_half_avg * 1.2:
            trend = 'degrading'
        elif second_half_avg < first_half_avg * 0.8:
            trend = 'improving'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'avg_duration_ms': avg_duration,
            'success_rate': success_rate,
            'sample_size': len(traces)
        }
    
    def _compare_agents(self, traces: List[Dict]) -> Dict:
        """Compare performance across agents."""
        agent_stats = {}
        
        for trace_data in traces:
            agent_id = trace_data['trace'].agent_id
            if agent_id not in agent_stats:
                agent_stats[agent_id] = {'durations': [], 'successes': 0, 'total': 0}
            
            agent_stats[agent_id]['durations'].append(trace_data['duration_ms'])
            if trace_data['success']:
                agent_stats[agent_id]['successes'] += 1
            agent_stats[agent_id]['total'] += 1
        
        # Calculate averages
        comparison = {}
        for agent_id, stats in agent_stats.items():
            comparison[agent_id] = {
                'avg_duration_ms': sum(stats['durations']) / len(stats['durations']),
                'success_rate': stats['successes'] / stats['total'],
                'trace_count': stats['total']
            }
        
        return comparison
    
    def export_session(self, output_path: str) -> None:
        """Export current profiling session to file."""
        session_data = {
            'exported_at': datetime.now().isoformat(),
            'active_traces': self.get_active_traces(),
            'recent_traces': self.get_recent_traces(n=100),
            'patterns': self.detect_patterns()
        }
        
        with open(output_path, 'w') as f:
            json.dump(session_data, f, indent=2)


# Context manager for profiling
class ProfiledTrace:
    """Context manager for automatic trace profiling."""
    
    def __init__(
        self,
        profiler: AgentProfiler,
        agent_id: str,
        trace_id: Optional[str] = None
    ):
        self.profiler = profiler
        self.agent_id = agent_id
        self.trace_id = trace_id
        self._trace_id: Optional[str] = None
    
    def __enter__(self) -> str:
        self._trace_id = self.profiler.start_trace(self.agent_id, self.trace_id)
        return self._trace_id
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        success = exc_type is None
        if self._trace_id is not None:
            self.profiler.end_trace(self._trace_id, success)


def create_profiler(window_size: int = 1000) -> AgentProfiler:
    """Create a new profiler instance."""
    return AgentProfiler(window_size=window_size)
