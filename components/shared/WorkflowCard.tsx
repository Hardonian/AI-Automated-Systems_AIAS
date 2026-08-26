"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

interface WorkflowCardProps {
  step: number;
  title: string;
  description: string;
  details?: string[];
  index?: number;
}

export function WorkflowCard({
  step,
  title,
  description,
  details = [],
  index = 0,
}: WorkflowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="relative h-full border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {step}
            </span>
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          {details.length > 0 && (
            <ul className="space-y-2">
              {details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
