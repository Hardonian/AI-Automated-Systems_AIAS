import { ExternalLink, BookOpen, Github, Cpu, Sparkles } from 'lucide-react';
// import { Button } from '@/components/ui/button';

const resources = [
  {
    icon: Github,
    title: 'GitHub AI Resources',
    description: 'Open-source AI models, tools, and frameworks',
    link: 'https://github.com/topics/artificial-intelligence',
    category: 'Code & Tools',
  },
  {
    icon: Cpu,
    title: 'Hugging Face',
    description: 'State-of-the-art AI models and datasets',
    link: 'https://huggingface.co/',
    category: 'Models & Datasets',
  },
  {
    icon: Sparkles,
    title: 'Ollama',
    description: 'Run large language models locally',
    link: 'https://ollama.ai/',
    category: 'Local AI',
  },
  {
    icon: BookOpen,
    title: 'Papers with Code',
    description: 'Latest AI research papers with implementations',
    link: 'https://paperswithcode.com/',
    category: 'Research',
  },
  {
    icon: BookOpen,
    title: 'Towards Data Science',
    description: 'AI and machine learning insights',
    link: 'https://towardsdatascience.com/',
    category: 'Learning',
  },
  {
    icon: Cpu,
    title: 'AI News by The Verge',
    description: 'Latest AI industry news and trends',
    link: 'https://www.theverge.com/ai-artificial-intelligence',
    category: 'News',
  },
];

export const ResourceLinks = () => {
  return (
    <section className='relative bg-gradient-to-b from-card to-background py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl space-y-4 text-center'>
          <h2 className='text-4xl font-bold md:text-5xl'>
            AI Knowledge
            <span className='to-primary-glow mt-2 block bg-gradient-to-r from-primary bg-clip-text text-transparent'>
              Hub
            </span>
          </h2>
          <p className='text-xl text-muted-foreground'>
            Curated resources from industry-leading AI platforms and communities
          </p>
        </div>

        <div className='mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {resources.map((resource, index) => (
            <a
              key={`resource-${index}`}
              className='bg-gradient-card hover:shadow-glow group rounded-xl border border-border p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50'
              href={resource.link}
              rel='noopener noreferrer'
              target='_blank'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20'>
                  <resource.icon className='h-6 w-6 text-primary' />
                </div>
                <ExternalLink className='h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary' />
              </div>

              <div className='mb-2'>
                <span className='text-xs font-semibold text-primary'>
                  {resource.category}
                </span>
              </div>

              <h3 className='mb-2 text-lg font-semibold transition-colors group-hover:text-primary'>
                {resource.title}
              </h3>

              <p className='text-sm text-muted-foreground'>
                {resource.description}
              </p>
            </a>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-3'>
            <Sparkles className='h-5 w-5 text-primary' />
            <span className='text-sm font-medium'>
              All resources are free and open to the community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
