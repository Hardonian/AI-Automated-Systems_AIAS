'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-8 text-center'>
      <h2 className='text-3xl font-bold'>Something went wrong!</h2>
      <p className='mt-4 text-muted-foreground'>
        {isDev
          ? error.message || 'An unexpected error occurred.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      {isDev && error.digest ? (
        <p className='mt-2 text-xs text-muted-foreground'>Error digest: {error.digest}</p>
      ) : null}
      <button
        onClick={() => reset()}
        className='mt-8 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90'
      >
        Try again
      </button>
    </div>
  );
}
