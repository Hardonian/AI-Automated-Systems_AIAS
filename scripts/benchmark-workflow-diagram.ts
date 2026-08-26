import { performance } from "perf_hooks";

const generateData = (nodeCount: number, connectionCount: number) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i + 1,
    label: `Node ${i + 1}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: "bg-blue-500",
  }));

  const connections = Array.from({ length: connectionCount }, (_, i) => ({
    from: Math.floor(Math.random() * nodeCount) + 1,
    to: Math.floor(Math.random() * nodeCount) + 1,
  }));

  return { nodes, connections };
};

const { nodes, connections } = generateData(10000, 20000);

// Baseline: O(N^2)
const start1 = performance.now();
const result1 = connections.map((conn) => {
  const fromNode = nodes.find((n) => n.id === conn.from);
  const toNode = nodes.find((n) => n.id === conn.to);
  if (!fromNode || !toNode) return null;
  return { fromNode, toNode };
});
const end1 = performance.now();
console.log(`Baseline (O(N^2)): ${(end1 - start1).toFixed(2)} ms`);

// Optimized: O(N)
const start2 = performance.now();
const nodeMap = new Map(nodes.map((n) => [n.id, n]));
const result2 = connections.map((conn) => {
  const fromNode = nodeMap.get(conn.from);
  const toNode = nodeMap.get(conn.to);
  if (!fromNode || !toNode) return null;
  return { fromNode, toNode };
});
const end2 = performance.now();
console.log(`Optimized (O(N)): ${(end2 - start2).toFixed(2)} ms`);
