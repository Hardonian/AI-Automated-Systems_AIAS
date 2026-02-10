import { AIChat } from './AIChat';

export const ChatShowcase = () => {
  return (
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-5xl'>
          {/* Section Header */}
          <div className='mb-8 space-y-3 text-center sm:mb-12 sm:space-y-4'>
            <h2 className='px-4 text-3xl font-bold sm:text-4xl md:text-5xl'>
              Experience AI-Powered
              <span className='to-primary-glow mt-2 block bg-gradient-to-r from-primary bg-clip-text text-transparent'>
                Conversations
              </span>
            </h2>
            <p className='mx-auto max-w-2xl px-4 text-lg text-muted-foreground sm:text-xl'>
              Try our intelligent assistant right now. Ask anything and see the
              power of advanced AI in action.
            </p>
          </div>

          {/* Chat Component */}
          <div className='mx-auto max-w-3xl'>
            <AIChat />
          </div>

          {/* Info Cards */}
          <div className='mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6'>
            <div className='bg-gradient-card rounded-xl border border-border p-4 text-center backdrop-blur-sm sm:p-6'>
              <div className='mb-2 text-2xl font-bold text-primary sm:text-3xl'>
                &lt;100ms
              </div>
              <div className='text-xs text-muted-foreground sm:text-sm'>
                Average Response Time
              </div>
            </div>
            <div className='bg-gradient-card rounded-xl border border-border p-4 text-center backdrop-blur-sm sm:p-6'>
              <div className='mb-2 text-2xl font-bold text-primary sm:text-3xl'>
                95%
              </div>
              <div className='text-xs text-muted-foreground sm:text-sm'>
                Accuracy Rate
              </div>
            </div>
            <div className='bg-gradient-card rounded-xl border border-border p-4 text-center backdrop-blur-sm sm:p-6'>
              <div className='mb-2 text-2xl font-bold text-primary sm:text-3xl'>
                50+
              </div>
              <div className='text-xs text-muted-foreground sm:text-sm'>
                Languages Supported
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
