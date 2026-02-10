'use client';
import { useState, useEffect } from 'react';

import ActivityFeed from '@/components/community/ActivityFeed';
import CommentSection from '@/components/community/CommentSection';
import ReportButton from '@/components/community/ReportButton';
import FollowButton from '@/components/social/FollowButton';
import ReactionBar from '@/components/social/ReactionBar';
import ShareButton from '@/components/social/ShareButton';
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

interface Post {
  id: number;
  body: string;
  title?: string;
  user_id: string;
  created_at: string;
  profiles?: { display_name: string; avatar_url?: string; id: string };
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  useEffect(() => {
    loadPosts().catch(error => {
      logger.error(
        'Failed to load posts',
        error instanceof Error ? error : new Error(String(error))
      );
    });
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          loadPosts().catch(error => {
            logger.error(
              'Failed to load posts',
              error instanceof Error ? error : new Error(String(error))
            );
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(display_name, avatar_url, id)')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      setPosts(data);
    }
  }

  async function createPost() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !newPost.trim()) {
      return;
    }

    await supabase.from('posts').insert({
      user_id: user.id,
      body: newPost,
      title: newPostTitle || undefined,
    } as any);

    // Create activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      activity_type: 'post_created',
      metadata: { title: newPostTitle || 'Untitled' },
    } as any);

    setNewPost('');
    setNewPostTitle('');
    loadPosts().catch(error => {
      logger.error(
        'Failed to load posts',
        error instanceof Error ? error : new Error(String(error))
      );
    });
  }

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='space-y-4 lg:col-span-2'>
        <h1 className='text-2xl font-bold'>Community</h1>

        <div className='space-y-3 rounded-2xl border bg-card p-4'>
          <input
            className='w-full rounded-xl border border-border p-2 text-sm'
            placeholder='Post title (optional)'
            value={newPostTitle}
            onChange={e => setNewPostTitle(e.target.value)}
          />
          <textarea
            className='w-full rounded-xl border border-border p-3 text-sm'
            placeholder='Share your progress, ask questions, give kudos...'
            rows={4}
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
          />
          <div className='flex justify-end'>
            <button
              className='text-primary-fg h-10 rounded-xl bg-primary px-4 text-sm font-medium'
              onClick={createPost}
            >
              Post
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          {posts.map(post => (
            <article key={post.id} className='rounded-2xl border bg-card p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex flex-1 items-start gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm'>
                    {post.profiles?.display_name?.[0] || 'U'}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm font-semibold'>
                        {post.profiles?.display_name || 'Anonymous'}
                      </div>
                      {post.profiles?.id && (
                        <FollowButton userId={post.profiles.id} />
                      )}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <ReportButton postId={post.id} />
              </div>

              {post.title && (
                <div className='mb-2 text-sm font-semibold'>{post.title}</div>
              )}
              <div className='mb-3 text-sm'>{post.body}</div>

              <div className='flex items-center justify-between'>
                <ReactionBar />
                <ShareButton
                  text={post.body}
                  title={post.title || 'Community Post'}
                  url={`/community#post-${post.id}`}
                />
              </div>

              <div className='mt-4 border-t pt-4'>
                <CommentSection postId={post.id} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <ActivityFeed limit={10} />
      </div>
    </div>
  );
}
