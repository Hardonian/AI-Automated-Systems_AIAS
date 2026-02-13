'use client';

import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Discover', desc: 'Map value stream', color: 'from-blue-500 to-cyan-500' },
  { num: '02', title: 'Map', desc: 'Design architecture', color: 'from-cyan-500 to-teal-500' },
  { num: '03', title: 'Automate', desc: 'Build agents', color: 'from-teal-500 to-emerald-500' },
  { num: '04', title: 'Ship', desc: 'Deploy safely', color: 'from-emerald-500 to-green-500' },
  { num: '05', title: 'Monitor', desc: 'Continuous improvement', color: 'from-green-500 to-lime-500' },
];

export function ProcessStepsVisual() {
  return (
    <div className="relative rounded-2xl border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold">Our Methodology</h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} text-sm font-bold text-white`}>
              {step.num}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Visual connector */}
      <div className="absolute left-[2.25rem] top-[4.5rem] h-[calc(100%-6rem)] w-0.5 bg-gradient-to-b from-blue-500 via-teal-500 to-green-500 opacity-20" />
    </div>
  );
}
