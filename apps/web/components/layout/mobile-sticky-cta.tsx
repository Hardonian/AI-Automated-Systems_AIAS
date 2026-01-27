"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface MobileStickyCTAProps {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function MobileStickyCTA({
  primaryLabel = "Book Strategy Call",
  primaryHref = "/demo",
  secondaryLabel = "View Pricing",
  secondaryHref = "/pricing",
}: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      const shouldShow = window.scrollY > 300;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          initial={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...({
            className:
              "fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-50 md:hidden pb-safe",
          } as any)}
        >
          <div className="flex gap-3">
            <Button asChild className="flex-1 font-bold shadow-lg" size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild className="flex-1" size="lg" variant="outline">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
