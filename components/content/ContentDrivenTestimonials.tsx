'use client';

import { motion } from 'framer-motion';
import { Play, Star, Quote } from 'lucide-react';

import FadeIn from '@/components/motion/fade-in';
import { StaggerList, StaggerItem } from '@/components/motion/stagger-list';
import { Card, CardContent } from '@/components/ui/card';
import type { TestimonialSection } from '@/lib/content/schemas';

interface ContentDrivenTestimonialsProps {
  content: TestimonialSection;
}

export function ContentDrivenTestimonials({
  content,
}: ContentDrivenTestimonialsProps) {
  return (
    <section className='relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30 py-20'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]' />

      <FadeIn>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'text-center mb-16 relative z-10' } as any)}
        >
          <div className='mb-4 inline-block'>
            <span className='rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
              Trusted Worldwide
            </span>
          </div>
          {content.sectionTitle && (
            <h2 className='mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl'>
              {content.sectionTitle}
            </h2>
          )}
          {content.sectionSubtitle && (
            <p className='mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
              {content.sectionSubtitle}
            </p>
          )}
        </motion.div>
      </FadeIn>

      <StaggerList staggerDelay={0.15}>
        <div className='relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {content.items.map((testimonial, index) => (
            <StaggerItem key={`${testimonial.author}-${index}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                {...({ className: 'h-full' } as any)}
              >
                <Card className='card-hover relative h-full overflow-hidden border-2'>
                  {testimonial.type === 'consultancy' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      {...({ className: 'absolute top-4 right-4 z-10' } as any)}
                    >
                      <span className='rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-semibold text-white shadow-lg'>
                        Consultancy Build
                      </span>
                    </motion.div>
                  )}
                  <CardContent className='pt-6'>
                    <div className='mb-4'>
                      <Quote className='h-8 w-8 text-primary/30' />
                    </div>

                    <div className='mb-4 flex items-center gap-3'>
                      <div className='flex items-center gap-1'>
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className='h-5 w-5 fill-yellow-400 text-yellow-400'
                          />
                        ))}
                      </div>
                      {testimonial.flag && (
                        <span className='text-2xl'>{testimonial.flag}</span>
                      )}
                    </div>

                    {testimonial.hasVideo && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        {...({
                          className:
                            'mb-6 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 aspect-video flex items-center justify-center border-2 border-primary/30 relative group cursor-pointer overflow-hidden',
                        } as any)}
                      >
                        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent' />
                        <div className='absolute inset-0 z-10 flex items-center justify-center'>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            {...({
                              className:
                                'w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow',
                            } as any)}
                          >
                            <Play className='ml-1 h-8 w-8 text-white' />
                          </motion.div>
                        </div>
                        <div className='absolute bottom-3 left-3 rounded-lg border border-border bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm'>
                          Video Testimonial
                        </div>
                      </motion.div>
                    )}

                    <p className='relative mb-6 border-l-2 border-primary/30 pl-4 text-base font-medium leading-relaxed text-foreground'>
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className='space-y-1 border-t border-border pt-4'>
                      <p className='text-base font-bold text-foreground'>
                        {testimonial.author}
                      </p>
                      {testimonial.role && (
                        <p className='text-sm text-muted-foreground'>
                          {testimonial.role}
                        </p>
                      )}
                      {testimonial.company && (
                        <p className='text-xs text-muted-foreground'>
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerList>
    </section>
  );
}
