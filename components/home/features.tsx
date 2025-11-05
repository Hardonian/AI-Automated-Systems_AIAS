"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized for performance with instant page loads and smooth interactions.",
  },
  {
    title: "Fully Accessible",
    description: "WCAG 2.2 AA compliant with keyboard navigation and screen reader support.",
  },
  {
    title: "Mobile First",
    description: "Beautiful on every device with responsive design and touch-friendly interfaces.",
  },
  {
    title: "Dark Mode",
    description: "Seamless light and dark themes that respect your system preferences.",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Hardonia</h2>
          <p className="text-muted-foreground text-lg">Built with modern best practices</p>
        </div>
      </FadeIn>
      <StaggerList>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerList>
    </section>
  );
}
