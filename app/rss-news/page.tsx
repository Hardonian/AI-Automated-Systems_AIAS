import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateQuickTake } from '@/lib/blog/rss-editorial';
import { rssFeeds, RSSFeedItem } from '@/lib/blog/rss-feed';

export const metadata: Metadata = {
  title: 'AI & Tech News Feed | Systems Thinking Analysis | AIAS Platform',
  description:
    'Curated AI and tech news from top sources, analyzed through systems thinking. Get daily insights on AI, automation, and technology with systems thinking perspectives.',
};

// Mock RSS items - in production, fetch from database/API
function getSampleRSSItems(): RSSFeedItem[] {
  return [
    {
      id: 'news-1',
      title: 'OpenAI Releases GPT-5 with Systems Thinking Capabilities',
      link: 'https://example.com/news/gpt5',
      description:
        "OpenAI's latest model includes systems thinking analysis features, enabling multi-perspective problem solving.",
      pubDate: new Date().toISOString(),
      source: 'TechCrunch AI',
      category: 'AI',
      relevance: 'high',
      systemsThinkingAngle: 'Directly relates to systems thinking concepts',
      perspectives: ['Technology', 'Systems', 'Automation'],
      discussionEnabled: true,
    },
    {
      id: 'news-2',
      title: 'New AI Automation Tools Hit the Market',
      link: 'https://example.com/news/ai-tools',
      description:
        'Several new AI automation platforms launch, promising to revolutionize business workflows.',
      pubDate: new Date(Date.now() - 86400000).toISOString(),
      source: 'The Verge AI',
      category: 'AI',
      relevance: 'medium',
      systemsThinkingAngle:
        'AI/automation topic - systems thinking perspective can be applied',
      perspectives: ['Technology', 'Process', 'Automation'],
      discussionEnabled: true,
    },
    {
      id: 'news-3',
      title: 'Systems Thinking Becomes Required Skill in Tech Jobs',
      link: 'https://example.com/news/systems-thinking-jobs',
      description:
        'Tech companies increasingly require systems thinking skills for senior positions.',
      pubDate: new Date(Date.now() - 172800000).toISOString(),
      source: 'MIT Technology Review',
      category: 'Business',
      relevance: 'high',
      systemsThinkingAngle: 'Directly relates to systems thinking concepts',
      perspectives: ['People', 'Systems'],
      discussionEnabled: true,
    },
  ];
}

export default function RSSNewsPage() {
  const items = getSampleRSSItems();

  return (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          AI & Tech News Feed
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Curated AI and tech news from top sources, analyzed through systems
          thinking.
          <strong className='text-foreground'>
            {' '}
            Editorial takes + open discussion.
          </strong>{' '}
          Get daily insights on AI, automation, and technology with systems
          thinking perspectives.
        </p>
        <div className='mt-4 flex flex-wrap justify-center gap-2'>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            📰 Daily News
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            ✍️ Editorial Takes
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            💬 Open Discussion
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            🧠 Systems Thinking Analysis
          </span>
        </div>
      </div>

      <div className='mx-auto max-w-4xl space-y-8'>
        {/* Latest News Items with Editorial Takes */}
        <section>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>
              Latest News with Editorial Takes
            </h2>
            <span className='text-sm text-muted-foreground'>
              {items.length} items
            </span>
          </div>
          <div className='space-y-6'>
            {items.map(item => {
              const quickTake = generateQuickTake(item);
              return (
                <Card
                  key={item.id}
                  className='transition-shadow hover:shadow-lg'
                >
                  <CardHeader>
                    <div className='mb-2 flex items-center gap-2'>
                      <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                        {item.source}
                      </span>
                      {item.category && (
                        <span className='rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground'>
                          {item.category}
                        </span>
                      )}
                      {item.relevance && (
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            item.relevance === 'high'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : item.relevance === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {item.relevance.charAt(0).toUpperCase() +
                            item.relevance.slice(1)}
                        </span>
                      )}
                    </div>
                    <CardTitle className='mb-2 text-xl'>
                      <Link
                        className='hover:underline'
                        href={`/rss-news/${item.id}`}
                      >
                        {item.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Quick Editorial Take */}
                    <div className='rounded-r-lg border-l-4 border-primary bg-primary/10 p-4'>
                      <p className='mb-2 flex items-center gap-2 text-sm font-semibold'>
                        ✍️ Quick Editorial Take
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {quickTake}
                      </p>
                    </div>

                    {/* Systems Thinking Info */}
                    {item.perspectives && item.perspectives.length > 0 && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <span className='font-semibold'>Perspectives:</span>
                        <div className='flex flex-wrap gap-1'>
                          {item.perspectives.map(perspective => (
                            <span
                              key={perspective}
                              className='rounded bg-primary/20 px-2 py-0.5 text-xs text-primary'
                            >
                              {perspective}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className='flex items-center justify-between border-t pt-2'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <time dateTime={item.pubDate}>
                          {new Date(item.pubDate).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span>•</span>
                        <a
                          className='text-primary hover:underline'
                          href={item.link}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          Original Article →
                        </a>
                      </div>
                      <div className='flex gap-2'>
                        <Button asChild size='sm' variant='outline'>
                          <Link href={`/rss-news/${item.id}`}>
                            Read Editorial + Discussion
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>How It Works</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                    1
                  </div>
                  <div>
                    <p className='font-semibold'>RSS Feed Aggregation</p>
                    <p className='text-sm text-muted-foreground'>
                      We aggregate news from top AI and tech sources:
                      TechCrunch, The Verge, MIT Technology Review, Hacker News,
                      Product Hunt, and more.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                    2
                  </div>
                  <div>
                    <p className='font-semibold'>
                      Systems Thinking Analysis + Editorial Take
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Each news item is analyzed through systems thinking. We
                      provide a quick editorialized take on the news,
                      identifying which perspectives apply and what it means
                      systemically.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                    3
                  </div>
                  <div>
                    <p className='font-semibold'>Open Discussion</p>
                    <p className='text-sm text-muted-foreground'>
                      Every news item opens for discussion. Share your systems
                      thinking perspective, debate implications, and engage with
                      the community. AI-moderated comments ensure quality
                      discussions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className='mb-6 text-2xl font-bold'>News Sources</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {rssFeeds.map(feed => (
              <Card key={feed.name}>
                <CardHeader>
                  <CardTitle className='text-lg'>{feed.name}</CardTitle>
                  <CardDescription>
                    {feed.category} • {feed.enabled ? 'Active' : 'Inactive'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className='bg-primary/10'>
            <CardHeader>
              <CardTitle className='text-2xl'>
                Editorial Takes + Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4 text-muted-foreground'>
                Every news item gets:
              </p>
              <ul className='mb-4 space-y-2 text-muted-foreground'>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>✍️</span>
                  <span>
                    <strong>Quick Editorial Take:</strong> Our immediate systems
                    thinking perspective on the news
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>📝</span>
                  <span>
                    <strong>Full Editorial:</strong> Detailed analysis with key
                    takeaways and systems thinking insights
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>💬</span>
                  <span>
                    <strong>Open Discussion:</strong> AI-moderated comments for
                    community dialogue and diverse perspectives
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>🧠</span>
                  <span>
                    <strong>Systems Thinking Analysis:</strong> Relevance,
                    perspectives, and implications
                  </span>
                </li>
              </ul>
              <p className='rounded-lg bg-white/50 p-3 text-sm text-muted-foreground dark:bg-black/20'>
                <strong>Why Editorial Takes?</strong> We don't just share news —
                we provide context, analysis, and invite discussion. Every news
                item gets our quick take on what it means systemically, then we
                open it up for your perspective. It's blog-style commentary
                meets news aggregation.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className='space-y-6 rounded-lg bg-muted/50 p-8 text-center'>
            <h2 className='text-2xl font-bold'>Get Daily AI & Tech News</h2>
            <p className='text-muted-foreground'>
              Subscribe to receive daily curated AI and tech news with systems
              thinking analysis. Stay informed about the latest developments
              with systems thinking insights.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/blog'>View Blog Articles</Link>
              </Button>
              <Button asChild size='lg' variant='outline'>
                <Link href='/demo'>Get Daily Updates</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
