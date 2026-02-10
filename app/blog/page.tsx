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
import { getLatestArticles, getFeaturedArticles } from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Blog — Systems Thinking + AI | Daily Articles | AIAS Platform',
  description:
    'Daily articles on systems thinking, AI automation, and business success. RSS feed of AI and tech news analyzed through systems thinking. AI-moderated comments for quality discussions.',
};

export default function BlogPage() {
  const articles = getLatestArticles(14); // All existing articles
  const featuredArticles = getFeaturedArticles();

  return (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Systems Thinking + AI Blog
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Daily articles on systems thinking, AI automation, and business
          success.
          <strong className='text-foreground'>
            {' '}
            New articles published daily.
          </strong>{' '}
          RSS feed of AI and tech news with systems thinking analysis.
        </p>
        <div className='mt-4 flex flex-wrap justify-center gap-2'>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            📰 Daily Publishing
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            🧠 Systems Thinking Focus
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            🤖 AI & Tech News RSS
          </span>
          <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            💬 AI-Moderated Comments
          </span>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className='mb-12'>
          <h2 className='mb-6 text-2xl font-bold'>Featured Articles</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {featuredArticles.map(article => (
              <Card
                key={article.slug}
                className='border-primary/20 transition-shadow hover:shadow-lg'
              >
                <CardHeader>
                  <div className='mb-2 flex items-center gap-2'>
                    <span className='rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
                      {article.category}
                    </span>
                    {article.systemsThinking && (
                      <span className='rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
                        🧠 Systems Thinking
                      </span>
                    )}
                  </div>
                  <CardTitle className='text-xl'>
                    <Link
                      className='hover:underline'
                      href={`/blog/${article.slug}`}
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <time className='text-xs text-muted-foreground'>
                      {new Date(article.publishedDate).toLocaleDateString(
                        'en-CA',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </time>
                    <Link
                      className='text-sm font-medium text-primary hover:underline'
                      href={`/blog/${article.slug}`}
                    >
                      Read more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className='mb-12'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>
            All Articles ({articles.length})
          </h2>
          <div className='flex gap-2'>
            <Button asChild size='sm' variant='outline'>
              <Link href='/rss-news'>AI & Tech News Feed</Link>
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {articles.map(article => (
            <Card
              key={article.slug}
              className='transition-shadow hover:shadow-lg'
            >
              <CardHeader>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>
                    {article.category}
                  </span>
                  {article.systemsThinking && (
                    <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>
                      🧠
                    </span>
                  )}
                  {article.genAIContentEngine && (
                    <span className='rounded bg-primary/10 px-2 py-1 text-xs text-primary'>
                      🤖
                    </span>
                  )}
                </div>
                <CardTitle className='text-lg'>
                  <Link
                    className='hover:underline'
                    href={`/blog/${article.slug}`}
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className='text-sm'>
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <time className='text-xs text-muted-foreground'>
                    {new Date(article.publishedDate).toLocaleDateString(
                      'en-CA',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </time>
                  <Link
                    className='text-xs text-primary hover:underline'
                    href={`/blog/${article.slug}`}
                  >
                    Read →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Publishing Notice */}
      <Card className='mb-8 border-primary/20 bg-primary/10'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            📅 Daily Publishing Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4 text-muted-foreground'>
            <strong>New articles published daily.</strong> Each article is
            analyzed through systems thinking and optimized for SEO, user
            experience, and conversion.
          </p>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
            <div>
              <p className='mb-1 font-semibold'>Article Types:</p>
              <ul className='space-y-1 text-muted-foreground'>
                <li>• Systems Thinking</li>
                <li>• AI Automation</li>
                <li>• Business Success</li>
                <li>• Case Studies</li>
              </ul>
            </div>
            <div>
              <p className='mb-1 font-semibold'>RSS Feed:</p>
              <ul className='space-y-1 text-muted-foreground'>
                <li>• AI & Tech News</li>
                <li>• Systems Thinking Analysis</li>
                <li>• Daily Curation</li>
              </ul>
            </div>
            <div>
              <p className='mb-1 font-semibold'>Comments:</p>
              <ul className='space-y-1 text-muted-foreground'>
                <li>• AI-Moderated</li>
                <li>• Systems Thinking Focus</li>
                <li>• Quality Discussions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card className='mb-8 border-primary/20 bg-primary/10'>
        <CardHeader>
          <CardTitle className='text-2xl'>Automation & Systems Tools</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground'>
            When building your content system, consider <strong>Notion</strong> for
            interconnected knowledge management, <strong>Zapier</strong> for process
            automation (remember: automation alone isn't enough — apply systems
            thinking), or <strong>Make</strong> for advanced
            workflow orchestration. Each tool is powerful, but systems thinking
            ensures they work together effectively.
          </p>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button asChild>
              <Link href='/demo'>Schedule Strategy Call</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/contact'>Request Access</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RSS News Feed */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='text-2xl'>AI & Tech News RSS Feed</CardTitle>
          <CardDescription>
            Curated AI and tech news analyzed through systems thinking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4 text-muted-foreground'>
            Get daily AI and tech news from top sources (TechCrunch, The Verge,
            MIT Technology Review, Hacker News, etc.) analyzed through our
            systems thinking framework. Each news item is evaluated for systems
            thinking relevance and provided with insights.
          </p>
          <Button asChild>
            <Link href='/rss-news'>View News Feed</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Subscribe */}
      <div className='text-center'>
        <Card className='mx-auto max-w-md'>
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Get daily articles and AI/tech news delivered to your inbox.
              Systems thinking insights included.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <input
                className='w-full rounded-md border px-4 py-2'
                placeholder='your@email.com'
                type='email'
              />
              <button className='w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'>
                Subscribe to Daily Updates
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
