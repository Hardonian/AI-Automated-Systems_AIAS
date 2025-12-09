"use client";
import { motion } from "framer-motion";
import { Shield, Award, CheckCircle2, Users, TrendingUp, Clock, Globe, Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    icon: CheckCircle2,
    value: "100%",
    label: "Projects Delivered On Time",
    description: "Every custom platform delivered as promised",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Average ROI Increase",
    description: "Clients see measurable business impact",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Users,
    value: "2,000+",
    label: "Active Users",
    description: "Trusted by businesses worldwide",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Clock,
    value: "8-16",
    label: "Weeks Average Timeline",
    description: "From strategy to deployment",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const certifications = [
  {
    name: "PIPEDA Compliant",
    icon: Shield,
    description: "Canadian privacy law compliance",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "SOC 2 Ready",
    icon: Lock,
    description: "Enterprise security standards",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "ISO 27001 Aligned",
    icon: Award,
    description: "Information security management",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "99.9% Uptime SLA",
    icon: CheckCircle2,
    description: "Guaranteed reliability",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const clientTypes = [
  "E-Commerce Brands",
  "Marketing Agencies",
  "Enterprise Companies",
  "SaaS Platforms",
  "Healthcare Organizations",
  "Financial Services",
  "Retail Businesses",
  "Tech Startups",
];

export function TrustBadges() {
  return (
    <section aria-label="Trust signals and social proof" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Metrics */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: "text-3xl md:text-4xl font-extrabold text-center mb-4" } as any)}
          >
            Proven Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: "text-center text-muted-foreground mb-8 text-lg" } as any)}
          >
            Real numbers from real businesses using our platforms
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className="h-full text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardContent className="pt-6 pb-6 px-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${metric.bgColor} flex items-center justify-center mx-auto mb-4`}>
                        <Icon aria-hidden="true" className={`h-6 w-6 md:h-7 md:w-7 ${metric.color}`} />
                      </div>
                      <div className={`text-3xl md:text-4xl font-extrabold ${metric.color} mb-2`}>
                        {metric.value}
                      </div>
                      <div className="font-bold text-sm md:text-base mb-1">{metric.label}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{metric.description}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: "text-2xl md:text-3xl font-bold text-center mb-8" } as any)}
          >
            Security & Compliance
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardContent className="pt-6 pb-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${cert.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon aria-hidden="true" className={`h-6 w-6 md:h-7 md:w-7 ${cert.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm md:text-base mb-1">{cert.name}</div>
                          <div className="text-xs md:text-sm text-muted-foreground">{cert.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Client Types */}
        <div className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: "text-2xl md:text-3xl font-bold mb-6" } as any)}
          >
            Trusted By Industry Leaders
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
            {...({ className: "flex flex-wrap items-center justify-center gap-3 md:gap-4" } as any)}
          >
            {clientTypes.map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                {...({ className: "px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-card border-2 border-border hover:border-primary/50 text-sm md:text-base font-semibold transition-all hover:shadow-md" } as any)}
              >
                {type}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: "mt-12 pt-8 border-t border-border" } as any)}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Globe aria-hidden="true" className="h-5 w-5 text-primary" />
              <span>🇨🇦 Built in Canada</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Globe aria-hidden="true" className="h-5 w-5 text-primary" />
              <span>🌍 Serving Global Clients</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Shield aria-hidden="true" className="h-5 w-5 text-primary" />
              <span>🔒 Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-primary" />
              <span>⭐ 4.9/5 Customer Rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
