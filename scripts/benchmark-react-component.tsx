import React from 'react';
import { renderToString } from 'react-dom/server';
import { performance } from 'perf_hooks';

// Simulate Framer Motion to test pure React rendering performance
const motion = {
  line: (props: any) => <line {...props} />,
  div: (props: any) => <div {...props} />
};

// Larger data to show quadratic scaling
const NODE_COUNT = 5000;
const CONN_COUNT = 5000;

const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: i + 1,
  label: `Node ${i + 1}`,
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: 'bg-blue-500'
}));

const connections = Array.from({ length: CONN_COUNT }, (_, i) => ({
  from: Math.floor(Math.random() * NODE_COUNT) + 1,
  to: Math.floor(Math.random() * NODE_COUNT) + 1
}));

// Unoptimized component
function BaselineDiagram() {
  return (
    <div>
      <svg>
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          return <motion.line key={i} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} />;
        })}
      </svg>
    </div>
  );
}

// Optimized component
const nodeMap = new Map(nodes.map(n => [n.id, n]));

function OptimizedDiagram() {
  return (
    <div>
      <svg>
        {connections.map((conn, i) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;
          return <motion.line key={i} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} />;
        })}
      </svg>
    </div>
  );
}

// Run benchmarks
function runBenchmark() {
  // Warm up
  for (let i = 0; i < 2; i++) {
    renderToString(<BaselineDiagram />);
    renderToString(<OptimizedDiagram />);
  }

  // Measure
  const ITERATIONS = 10;

  const start1 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    renderToString(<BaselineDiagram />);
  }
  const end1 = performance.now();

  const start2 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    renderToString(<OptimizedDiagram />);
  }
  const end2 = performance.now();

  const time1 = (end1 - start1) / ITERATIONS;
  const time2 = (end2 - start2) / ITERATIONS;

  console.log(`Baseline Component Render: ${time1.toFixed(4)} ms`);
  console.log(`Optimized Component Render: ${time2.toFixed(4)} ms`);
  console.log(`Improvement: ${((time1 - time2) / time1 * 100).toFixed(2)}% faster`);
}

runBenchmark();
