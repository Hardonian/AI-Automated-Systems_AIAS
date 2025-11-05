"use client";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";

const testimonials = [
  {
    quote: "The best shopping experience I've had online. Fast, beautiful, and easy to use.",
    author: "Sarah Johnson",
    role: "Customer",
  },
  {
    quote: "Incredible attention to detail. Every interaction feels polished and intentional.",
    author: "Mike Chen",
    role: "Designer",
  },
  {
    quote: "Accessibility features are top-notch. This is how all sites should be built.",
    author: "Alex Rivera",
    role: "Accessibility Advocate",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
        </div>
      </FadeIn>
      <StaggerList staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerList>
    </section>
  );
}
