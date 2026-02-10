'use client';

import FadeIn from '@/components/motion/fade-in';
import { FAQSchema } from '@/components/seo/structured-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FAQSection } from '@/lib/content/schemas';

interface ContentDrivenFAQProps {
  content: FAQSection;
}

export function ContentDrivenFAQ({ content }: ContentDrivenFAQProps) {
  // Flatten FAQs for schema
  const allFAQs = content.categories.flatMap(category =>
    category.questions.map(q => ({
      question: q.question,
      answer: q.answer,
    }))
  );

  return (
    <section className='bg-muted/30 py-20'>
      <FAQSchema faqs={allFAQs} />
      <FadeIn>
        <div className='container mx-auto max-w-4xl'>
          <div className='mb-12 text-center'>
            {content.sectionTitle && (
              <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
                {content.sectionTitle}
              </h2>
            )}
            {content.sectionSubtitle && (
              <p className='text-lg text-muted-foreground'>
                {content.sectionSubtitle}
              </p>
            )}
          </div>

          <div className='space-y-8'>
            {content.categories.map((category, categoryIndex) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className='text-xl'>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion collapsible className='w-full' type='single'>
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${categoryIndex}-${index}`}
                      >
                        <AccordionTrigger className='text-left'>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className='text-muted-foreground'>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <p className='mb-4 text-muted-foreground'>
              Still have questions? We're here to help.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <a
                className='inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                href='/demo'
              >
                Schedule Strategy Call
              </a>
              <a
                className='inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 transition-colors hover:bg-muted'
                href='mailto:support@aiautomatedsystems.ca'
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
