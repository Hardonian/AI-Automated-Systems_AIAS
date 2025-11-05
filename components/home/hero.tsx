"use client";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/motion/fade-in";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <FadeIn>
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Modern Commerce
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of online shopping with fast, accessible, and beautiful design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
