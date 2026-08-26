"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQContent } from "@/components/content/types";

export function ContentDrivenFAQ({ content }: { content: FAQContent }) {
  return (
    <section className="bg-muted/30 py-24" id="faq">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {content.sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.sectionSubtitle}
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          {content.categories.map((cat, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="mb-6 text-xl font-semibold">{cat.category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {cat.questions.map((q, qIdx) => (
                  <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent>{q.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
