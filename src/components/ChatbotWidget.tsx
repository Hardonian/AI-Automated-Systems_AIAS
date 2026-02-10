import { MessageCircle, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { AIChat } from './AIChat';

import { Button } from '@/components/ui/button';

const agentSkills = [
  'Answer product questions',
  'Schedule consultations',
  'Calculate ROI estimates',
  'Recommend solutions',
  'Provide case studies',
  'Guide automation setup',
];

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className='fixed bottom-6 right-6 z-50'>
        {!isOpen && (
          <div className='relative'>
            {/* Skills Popup */}
            {showSkills && (
              <div className='shadow-glow animate-slide-in absolute bottom-full right-0 mb-4 w-72 rounded-xl border border-primary/20 bg-card p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <Sparkles className='h-5 w-5 text-primary' />
                  <h4 className='font-semibold'>I can help you with:</h4>
                </div>
                <ul className='space-y-2'>
                  {agentSkills.map((skill, index) => (
                    <li
                      key={`skill-${index}`}
                      className='flex items-start gap-2 text-sm'
                    >
                      <span className='text-primary'>•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              className='bg-gradient-primary shadow-glow animate-float h-16 w-16 rounded-full transition-all hover:shadow-xl'
              size='lg'
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setShowSkills(true)}
              onMouseLeave={() => setShowSkills(false)}
            >
              <MessageCircle className='h-6 w-6' />
            </Button>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className='shadow-glow animate-slide-in fixed bottom-6 right-6 z-50 flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-primary/20 bg-card'>
          {/* Header */}
          <div className='bg-gradient-primary flex items-center justify-between border-b border-primary/20 p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-card'>
                <Sparkles className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h3 className='font-semibold text-primary-foreground'>
                  AIAS Assistant
                </h3>
                <p className='text-xs text-primary-foreground/80'>
                  AI Automation Expert
                </p>
              </div>
            </div>
            <Button
              className='h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/10'
              size='sm'
              variant='ghost'
              onClick={() => setIsOpen(false)}
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          {/* Chat Content */}
          <div className='flex-1 overflow-hidden'>
            <AIChat />
          </div>
        </div>
      )}
    </>
  );
};
