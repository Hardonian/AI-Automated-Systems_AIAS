"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, CheckCircle2, ArrowRight, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Zap, text: "Save 10+ Hours/Week", color: "text-yellow-500" },
  { icon: TrendingUp, text: "40% ROI Increase", color: "text-green-500" },
  { icon: Shield, text: "Enterprise Security", color: "text-blue-500" },
  { icon: CheckCircle2, text: "99.9% Uptime SLA", color: "text-purple-500" },
];

export function ConversionCTA() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Calculate time until end of day for urgency
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 md:p-10">
              {/* Urgency indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock aria-hidden="true" className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  Limited Time Offer: {timeLeft} remaining today
                </span>
              </div>

              {/* Main headline */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                  whileInView={{ scale: 1 }}
                  {...({ className: "inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-xl" } as any)}
                >
                  <Sparkles aria-hidden="true" className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Start Saving 10+ Hours/Week Today
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join 2,000+ businesses worldwide automating with AI Automated Systems. 
                  <span className="font-bold text-foreground"> No credit card required.</span> 30-day free trial. Cancel anytime.
                </p>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      {...({ className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/50 hover:shadow-lg transition-all" } as any)}
                    >
                      <Icon aria-hidden="true" className={`h-6 w-6 md:h-8 md:w-8 ${benefit.color}`} />
                      <span className="text-xs md:text-sm font-semibold text-center text-foreground">
                        {benefit.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pricing highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
                {...({ className: "bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 rounded-xl border-2 border-primary/20 mb-8" } as any)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      CAD $49/month
                    </span>
                  </div>
                  <p className="text-foreground font-bold mb-2 text-lg">
                    Transparent pricing, no hidden fees
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Save 10+ hours/week • Reduce errors by 90% • Focus on high-value work
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm">
                    <span className="px-3 py-1.5 rounded-full bg-card border border-border font-medium">
                      🇨🇦 Built in Canada
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-card border border-border font-medium">
                      🌍 Trusted Worldwide
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-card border border-border font-medium">
                      🔒 Enterprise Security
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                {...({ className: "flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6" } as any)}
              >
                <Button 
                  asChild 
                  className="text-base md:text-lg px-8 md:px-12 h-12 md:h-14 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group min-h-[48px] w-full sm:w-auto" 
                  size="lg"
                >
                  <Link aria-label="Start your 30-day free trial - no credit card required" href="/signup">
                    <span className="flex items-center justify-center gap-2">
                      Start 30-Day Free Trial
                      <ArrowRight aria-hidden="true" className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="text-base md:text-lg px-8 md:px-12 h-12 md:h-14 font-bold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all hover:scale-105 min-h-[48px] w-full sm:w-auto" 
                  size="lg" 
                  variant="outline"
                >
                  <Link aria-label="Book a free demo call" href="/demo">
                    Book Free Demo
                  </Link>
                </Button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.p
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1 }}
                {...({ className: "text-xs md:text-sm text-muted-foreground text-center font-medium space-x-2" } as any)}
              >
                <span>✨ No credit card required</span>
                <span>•</span>
                <span>🎁 30-day free trial</span>
                <span>•</span>
                <span>🔄 Cancel anytime</span>
                <span>•</span>
                <span>🔒 100% secure</span>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
