import { Gift, Download, Mail } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const LeadGenForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Success! 🎉',
        description: 'Check your email for the Master System Prompts Guide PDF',
      });
      setEmail('');
      setName('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className='relative overflow-hidden py-24'>
      <div className='absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent' />

      <div className='container relative z-10 mx-auto px-4'>
        <div className='mx-auto max-w-4xl'>
          <div className='bg-gradient-card shadow-glow rounded-2xl border border-primary/20 p-12 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <div className='mb-6 inline-flex items-center gap-3 rounded-full bg-primary/10 px-6 py-3'>
                <Gift className='h-6 w-6 text-primary' />
                <span className='text-lg font-semibold'>Free Resource</span>
              </div>

              <h2 className='mb-4 px-4 text-3xl font-bold sm:text-4xl md:text-5xl'>
                Get Your Free
                <span className='to-primary-glow mt-2 block bg-gradient-to-r from-primary bg-clip-text text-transparent'>
                  AI Agent System Prompts Guide
                </span>
              </h2>

              <p className='mb-6 px-4 text-lg text-muted-foreground sm:mb-8 sm:text-xl'>
                10-page master guide on crafting perfect system prompts and
                fine-tuning your AI agents for maximum performance
              </p>

              <div className='mb-6 grid gap-4 px-4 sm:mb-8 sm:grid-cols-3 sm:gap-6'>
                <div className='rounded-lg bg-card/50 p-3 sm:p-4'>
                  <Download className='mx-auto mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8' />
                  <div className='mb-1 text-sm font-semibold sm:text-base'>
                    10-Page PDF
                  </div>
                  <div className='text-xs text-muted-foreground sm:text-sm'>
                    Comprehensive guide
                  </div>
                </div>
                <div className='rounded-lg bg-card/50 p-3 sm:p-4'>
                  <Mail className='mx-auto mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8' />
                  <div className='mb-1 text-sm font-semibold sm:text-base'>
                    Instant Delivery
                  </div>
                  <div className='text-xs text-muted-foreground sm:text-sm'>
                    Sent to your inbox
                  </div>
                </div>
                <div className='rounded-lg bg-card/50 p-3 sm:p-4'>
                  <Gift className='mx-auto mb-2 h-6 w-6 text-primary sm:h-8 sm:w-8' />
                  <div className='mb-1 text-sm font-semibold sm:text-base'>
                    Completely Free
                  </div>
                  <div className='text-xs text-muted-foreground sm:text-sm'>
                    No credit card
                  </div>
                </div>
              </div>
            </div>

            <form
              className='mx-auto max-w-md space-y-4'
              onSubmit={handleSubmit}
            >
              <Input
                required
                className='border-primary/20 bg-background/50'
                placeholder='Your Name'
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                required
                className='border-primary/20 bg-background/50'
                placeholder='Your Email Address'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                className='bg-gradient-primary shadow-glow w-full text-lg'
                disabled={isLoading}
                size='lg'
                type='submit'
              >
                {isLoading ? 'Sending...' : 'Download Free Guide'}
                <Download className='ml-2 h-5 w-5' />
              </Button>
              <p className='text-center text-xs text-muted-foreground'>
                By subscribing, you&apos;ll also receive our weekly AI
                automation insights newsletter. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
