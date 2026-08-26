"use client";

import { motion } from "framer-motion";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

const stepColors = [
  "from-blue-500/20 to-blue-600/10",
  "from-indigo-500/20 to-indigo-600/10",
  "from-violet-500/20 to-violet-600/10",
  "from-purple-500/20 to-purple-600/10",
  "from-fuchsia-500/20 to-fuchsia-600/10",
];

export function HowWeWorkSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section
      aria-labelledby="how-we-work-heading"
      className="relative overflow-hidden border-b bg-gradient-to-b from-muted/20 to-background py-20"
      id="how-we-work"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            id="how-we-work-heading"
          >
            How every engagement runs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Structured delivery with shared ownership from discovery to handoff.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="mt-14 hidden lg:block">
          {/* Connecting line */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5" />
            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Step number node */}
                  <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stepColors[index] || stepColors[0]}`}
                    />
                    <span className="relative text-lg font-extrabold text-primary">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mt-12 lg:hidden">
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-7 top-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative flex gap-5 pb-8 last:pb-0"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stepColors[index] || stepColors[0]}`}
                  />
                  <span className="relative text-sm font-extrabold text-primary">
                    {String(step.step).padStart(2, "0")}
                  </span>
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
