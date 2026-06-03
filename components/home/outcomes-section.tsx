'use client';

import { Shield, Zap, TrendingUp, Clock, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const outcomes = [
  {
    icon: Clock,
    label: 'Repetitive tasks replaced',
    description:
      'Triage, routing, and coordination tasks move into governed automation flows with human review checkpoints.',
    stat: '78%',
    statLabel: 'faster intake',
  },
  {
    icon: Shield,
    label: 'Human-in-the-loop built in',
    description:
      'Critical decisions stay with your team. Automation handles preparation, routing, and verification.',
    stat: '100%',
    statLabel: 'policy-gated',
  },
  {
    icon: Zap,
    label: 'Faster time to production',
    description:
      'Focused pilot scopes accelerate implementation without redesigning your core stack.',
    stat: '2–4',
    statLabel: 'week pilots',
  },
  {
    icon: TrendingUp,
    label: 'Measurable improvement loops',
    description:
      'Operational telemetry and quarterly reviews drive continuous optimization after launch.',
    stat: '99.2%',
    statLabel: 'success rate',
  },
];

const deliverables = [
  {
    icon: FileText,
    title: 'Workflow Blueprints',
    items: ['State machine diagrams', 'Error handling procedures', 'Human checkpoint definitions'],
  },
  {
    icon: Users,
    title: 'Training & Handoff',
    items: ['Team workshops', 'Documentation & runbooks', 'Ongoing support options'],
  },
  {
    icon: Shield,
    title: 'Governance & Security',
    items: ['Audit trails & event logs', 'SOC2-ready controls', 'PIPEDA compliance framework'],
  },
];

export function OutcomesSection() {
  return (
    <section className="border-b py-20" id="outcomes">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              What actually changes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Real outcome patterns from delivery engagements. Results depend on scope and team readiness.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.label}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <outcome.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-extrabold text-primary">{outcome.stat}</span>
                  <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {outcome.statLabel}
                  </span>
                </div>
                <h3 className="font-bold">{outcome.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {outcome.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              What you own after every engagement
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              All artifacts stay with your team. No lock-in, no dependencies.
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {deliverables.map((category, index) => (
              <motion.div
                key={category.title}
                className="rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold">{category.title}</h4>
                </div>
                <ul className="space-y-2.5">
                  {category.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
