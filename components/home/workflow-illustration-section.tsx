import { HeroIllustration } from '@/components/visual/HeroIllustration';

export function WorkflowIllustrationSection() {
  return (
    <section className='border-y bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16'>
      <div className='container'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold text-white'>How It Works</h2>
          <p className='mt-4 text-slate-400'>
            Our agentic workflow engine processes inputs through classification, planning, and execution—with human
            oversight at every critical step.
          </p>
        </div>
        <div className='mt-12'>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
