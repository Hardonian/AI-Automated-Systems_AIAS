"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface StaggerListProps extends PropsWithChildren {
  delay?: number;
  staggerDelay?: number;
}

export function StaggerList({ children, delay = 0, staggerDelay = 0.1 }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: PropsWithChildren) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 120,
            damping: 18,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
