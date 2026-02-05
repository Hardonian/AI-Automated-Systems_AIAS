'use client';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    setIsLoading(true);
    // Simulate API call for now (can be hooked up to Resend later)
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Subscribed!',
      description: "You've been added to our newsletter.",
    });
    setEmail('');
    setIsLoading(false);
  };

  return (
    <footer
      aria-label='Site footer'
      className='mt-auto border-t border-border bg-gradient-to-b from-background to-muted/20 py-12 text-sm text-muted-foreground md:py-16'
      role='contentinfo'
    >
      <div className='container'>
        <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className='mb-4 flex items-center gap-2'>
              <Sparkles aria-hidden='true' className='h-5 w-5 text-primary' />
              <h3 className='text-lg font-bold text-foreground'>
                AI Automated Systems
              </h3>
            </div>
            <p className='mb-6 max-w-sm text-sm leading-relaxed md:text-base'>
              We help organizations design, deploy, and operate reliable agentic
              automations while training teams to run them safely and
              productively. Canadian operations, systems thinking approach.
            </p>
            <div className='flex flex-wrap gap-2 text-xs'>
              <span className='rounded-full bg-primary/10 px-2 py-1 font-medium text-primary'>
                Workflow Design
              </span>
              <span className='rounded-full bg-primary/10 px-2 py-1 font-medium text-primary'>
                Training & Enablement
              </span>
              <span className='rounded-full bg-primary/10 px-2 py-1 font-medium text-primary'>
                Governance & Ops
              </span>
            </div>

            <div className='mt-8 border-t border-border/50 pt-8'>
              <h4 className='mb-2 flex items-center gap-2 text-sm font-bold'>
                <Mail className='h-4 w-4 text-primary' />
                Stay Updated
              </h4>
              <p className='mb-3 text-xs text-muted-foreground'>
                Get the latest on AI automation trends and platform updates.
              </p>
              <form className='flex gap-2' onSubmit={handleSubscribe}>
                <Input
                  required
                  className='h-9 bg-background/50 text-sm'
                  placeholder='Enter your email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button
                  className='h-9 w-9 flex-shrink-0 p-0'
                  disabled={isLoading}
                  size='sm'
                  type='submit'
                >
                  <Send className='h-4 w-4' />
                  <span className='sr-only'>Subscribe</span>
                </Button>
              </form>
            </div>
          </motion.div>
          {[
            {
              title: 'Services',
              links: [
                { href: '/services', label: 'Consulting Services' },
                { href: '/process', label: 'Our Process' },
                { href: '/use-cases', label: 'Use Cases' },
                { href: '/training', label: 'Training' },
                { href: '/case-studies', label: 'Case Studies' },
                { href: '/saas', label: 'SaaS Platform' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { href: '/blog', label: 'Blog (Daily Articles)' },
                { href: '/rss-news', label: 'AI & Tech News Feed' },
                { href: '/help', label: 'Help Center' },
                { href: '/demo', label: 'Book Demo' },
                { href: '/status', label: 'Status' },
              ],
            },
            {
              title: 'Company',
              links: [
                { href: '/about', label: 'About' },
                { href: '/showcase', label: 'Consultancy Showcase' },
                { href: '/why-canadian', label: 'Why Canadian' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/trust', label: 'Trust Center' },
              ],
            },
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h4 className='mb-4 text-base font-bold text-foreground'>
                {section.title}
              </h4>
              <ul className='space-y-3' role='list'>
                {section.links.map(link => (
                  <li key={link.href} role='listitem'>
                    <Link
                      aria-label={`Navigate to ${link.label}`}
                      className='inline-block flex min-h-[44px] items-center text-sm transition-colors hover:text-foreground hover:underline md:text-base'
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
          {...({ className: 'mt-12 pt-8 border-t border-border' } as any)}
        >
          <div className='mb-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground'>
            {[
              { href: '/trust', label: 'Trust Center' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/status', label: 'Status' },
              { href: '/help', label: 'Help' },
              {
                href: 'mailto:support@aiautomatedsystems.ca',
                label: 'Support',
              },
            ].map(link => (
              <Link
                key={link.href}
                aria-label={`Navigate to ${link.label}`}
                className='flex min-h-[44px] items-center transition-colors hover:text-foreground hover:underline'
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className='mb-8 flex flex-wrap justify-center gap-3'>
            {[
              { icon: '🔒', text: 'PIPEDA Practices' },
              { icon: '🛡️', text: 'Security Focused' },
              { icon: '🇨🇦', text: 'Canadian Operations' },
              { icon: '📋', text: 'Audit Ready' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                {...({
                  className:
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all',
                } as any)}
              >
                <span>{badge.icon}</span>
                <span className='text-xs font-medium text-foreground'>
                  {badge.text}
                </span>
              </motion.div>
            ))}
          </div>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-4'>
              <a
                aria-label='Visit our GitHub repository'
                className='text-muted-foreground transition-colors hover:text-foreground'
                href='https://github.com/shardie-github/aias'
                rel='noopener noreferrer'
                target='_blank'
              >
                <svg
                  aria-hidden='true'
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    clipRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    fillRule='evenodd'
                  />
                </svg>
              </a>
            </div>
            <div className='text-center text-xs leading-relaxed text-muted-foreground md:text-sm'>
              © {new Date().getFullYear()} AI Automated Systems. All rights
              reserved.
              <br />
              <span className='mt-2 inline-block'>
                Built in Canada 🇨🇦 • Serving the World 🌍
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
