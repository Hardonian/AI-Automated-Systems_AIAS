'use client';

export function CommentsSection({ articleSlug }: { articleSlug: string }) {
    return (
        <div className='mt-16 border-t pt-10'>
            <h2 className='mb-6 text-2xl font-bold'>Discussion</h2>
            <div className='rounded-lg border bg-muted/30 p-8 text-center'>
                <p className='text-muted-foreground'>
                    Comments are currently in read-only mode for this static version.
                </p>
            </div>
        </div>
    );
}
