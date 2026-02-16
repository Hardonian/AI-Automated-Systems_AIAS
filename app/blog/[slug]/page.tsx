import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CommentsSection } from '@/components/blog/comments-section';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getArticleBySlug,
  getLatestArticles,
  type BlogArticle,
} from '@/lib/blog/articles';
import { formatDateConsistent } from '@/lib/utils';
import { sanitizeHTMLServer } from '@/lib/utils/sanitize-html';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | AIAS Platform Blog`,
    description: article.excerpt,
    keywords: article.seoKeywords || article.tags,
  };
}

export async function generateStaticParams() {
  const articles = getLatestArticles(100);
  return articles.map(article => ({
    slug: article.slug,
  }));
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const relatedArticles = getLatestArticles(3).filter(a => a.slug !== slug);

  if (!article) {
    notFound();
  }

  return (
    <div className='container max-w-4xl py-16'>
      <article>
        {/* Back to Blog */}
        <div className='mb-6'>
          <Link
            className='text-sm text-muted-foreground hover:underline'
            href='/blog'
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className='mb-8'>
          <div className='mb-4 flex items-center gap-2'>
            <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              {article.category}
            </span>
            {article.systemsThinking && (
              <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                🧠 Systems Thinking
              </span>
            )}
          </div>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
            {article.title}
          </h1>
          <p className='mb-6 text-xl text-muted-foreground'>
            {article.excerpt}
          </p>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <span>By {article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedDate}>
              {formatDateConsistent(article.publishedDate)}
            </time>
          </div>
        </header>

        {/* Article Content */}
        <div className='prose prose-lg mb-12 max-w-none dark:prose-invert'>
          {article.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTMLServer(article.content),
              }}
            />
          ) : (
            <ArticleContent article={article} />
          )}

          {/* Systems Thinking Callout */}
          {article.systemsThinking && (
            <div className='my-8 rounded-r-lg border-l-4 border-primary bg-primary/10 p-6'>
              <h3 className='mb-2 text-lg font-semibold'>
                🧠 Systems Thinking Perspective
              </h3>
              <p className='text-muted-foreground'>
                This article emphasizes systems thinking — THE critical skill
                for the AI age. Systems thinking is what makes you stand out in
                the job market, succeed in business, and achieve optimal
                outcomes.
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className='mb-12'>
          <div className='flex flex-wrap gap-2'>
            {article.tags.map(tag => (
              <span
                key={tag}
                className='rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection articleSlug={slug} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className='mt-16'>
          <h2 className='mb-6 text-2xl font-bold'>Related Articles</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {relatedArticles.map(related => (
              <Card
                key={related.slug}
                className='transition-shadow hover:shadow-lg'
              >
                <CardHeader>
                  <CardTitle className='text-lg'>
                    <Link
                      className='hover:underline'
                      href={`/blog/${related.slug}`}
                    >
                      {related.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    {related.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    className='text-sm text-primary hover:underline'
                    href={`/blog/${related.slug}`}
                  >
                    Read more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className='mt-12 rounded-lg bg-muted/50 p-8 text-center'>
        <h2 className='mb-4 text-2xl font-bold'>
          Want More Systems Thinking Content?
        </h2>
        <p className='mb-6 text-muted-foreground'>
          Get daily articles on systems thinking, AI automation, and business
          success. Plus RSS feed of AI and tech news analyzed through systems
          thinking.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/blog'>View All Articles</Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href={`mailto:${siteContent.contact.email}`}>
              Request RSS Access
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Component to render article content
function ArticleContent({ article }: { article: BlogArticle }) {
  // Render content based on article tags
  return (
    <div className='space-y-6'>
      <p className='text-lg'>{article.excerpt}</p>

      {article.tags.includes('shopify') && (
        <div className='space-y-4'>
          <h2>E-Commerce Automation with Shopify</h2>
          <p>
            If you're running an e-commerce store, <strong>Shopify</strong> is one of
            the most powerful platforms for Canadian businesses. Automating your
            Shopify store can save you 10+ hours per week on order processing,
            inventory management, and customer support.
          </p>
        </div>
      )}

      {article.tags.includes('wave') && (
        <div className='space-y-4'>
          <h2>Accounting Automation with Wave</h2>
          <p>
            <strong>Wave Accounting</strong> is a
            Canadian-made accounting tool that's perfect for small businesses.
            Automating your bookkeeping with Wave can save you 5+ hours per week
            on invoicing, expense tracking, and financial reporting.
          </p>
        </div>
      )}

      {article.tags.includes('stripe') && (
        <div className='space-y-4'>
          <h2>Payment Processing with Stripe</h2>
          <p>
            <strong>Stripe</strong> offers
            powerful payment processing with excellent Canadian support.
            Automating payment workflows can reduce manual errors and save time
            on reconciliation.
          </p>
        </div>
      )}

      {article.tags.includes('notion') && (
        <div className='space-y-4'>
          <h2>Productivity with Notion</h2>
          <p>
            <strong>Notion</strong> is an
            excellent tool for knowledge management and productivity. When
            combined with systems thinking, it becomes a powerful platform for
            organizing your business processes.
          </p>
        </div>
      )}

      {article.tags.includes('automation') && (
        <div className='space-y-4'>
          <h2>Automation Tools</h2>
          <p>
            While tools like <strong>Zapier</strong> and <strong>Make</strong> are powerful,
            they require systems thinking to design effective workflows.
            Automation alone isn't enough — you need to understand the systems
            you're automating.
          </p>
        </div>
      )}

      <div className='rounded-r-lg border-l-4 border-primary bg-primary/10 p-6'>
        <h3 className='mb-2 text-lg font-semibold'>
          Ready to Start Automating?
        </h3>
        <p className='mb-4 text-muted-foreground'>
          AIAS helps Canadian businesses automate their workflows with
          AI agents. Connect Shopify, Wave, Stripe, and 100+ other tools.
        </p>
        <Button asChild>
          <Link href={getPrimaryCtaHref()}>
            {siteContent.positioning.primaryCTA.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
