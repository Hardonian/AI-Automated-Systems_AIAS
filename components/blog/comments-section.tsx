'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  status: 'approved' | 'pending';
  systemsThinkingInsight?: string;
  likes?: number;
  replies?: Comment[];
}

interface CommentsSectionProps {
  articleSlug: string;
}

export function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleSlug,
          author,
          email,
          content: newComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
        setAuthor('');
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='mt-12'>
      <Card>
        <CardHeader>
          <CardTitle>AI-Moderated Comments</CardTitle>
          <CardDescription>
            Join the discussion. All comments are moderated by AI using systems
            thinking principles to ensure quality, relevance, and constructive
            dialogue.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Comment Form */}
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label className='mb-2 block text-sm font-medium'>Name</label>
              <Input
                required
                placeholder='Your name'
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>Email</label>
              <Input
                required
                placeholder='your@email.com'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>Comment</label>
              <textarea
                required
                className='w-full rounded-md border px-4 py-2'
                placeholder='Share your thoughts... (AI moderation ensures quality discussions)'
                rows={4}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                💡 Tip: Comments that demonstrate systems thinking or multiple
                perspectives are highly valued!
              </p>
            </div>
            <Button disabled={isSubmitting} type='submit'>
              {isSubmitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </form>

          {/* Comments List */}
          <div className='mt-8 space-y-4'>
            <h3 className='font-semibold'>
              Comments ({comments.filter(c => c.status === 'approved').length})
            </h3>
            {comments.filter(c => c.status === 'approved').length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments
                .filter(c => c.status === 'approved')
                .map(comment => (
                  <Card key={comment.id} className='bg-muted/30'>
                    <CardContent className='pt-6'>
                      <div className='mb-2 flex items-start justify-between'>
                        <div>
                          <p className='font-semibold'>{comment.author}</p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(comment.timestamp).toLocaleDateString(
                              'en-CA',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className='mb-3 text-muted-foreground'>
                        {comment.content}
                      </p>
                      {comment.systemsThinkingInsight && (
                        <div className='mb-3 rounded-r-lg border-l-4 border-primary bg-primary/10 p-3'>
                          <p className='text-xs text-muted-foreground'>
                            <strong>🧠 Systems Thinking Insight:</strong>{' '}
                            {comment.systemsThinkingInsight}
                          </p>
                        </div>
                      )}
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <button className='hover:text-foreground'>
                          Like ({comment.likes || 0})
                        </button>
                        <button className='hover:text-foreground'>Reply</button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>

          {/* AI Moderation Notice */}
          <div className='mt-6 rounded-lg bg-muted/50 p-4'>
            <p className='text-sm text-muted-foreground'>
              <strong>AI Moderation:</strong> Comments are automatically
              moderated using AI systems thinking analysis. Comments that
              demonstrate systems thinking, multiple perspectives, or
              constructive dialogue are prioritized. Spam, toxic content, and
              off-topic comments are automatically filtered.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
