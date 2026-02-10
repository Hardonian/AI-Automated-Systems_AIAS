'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-8 text-center'>
      <h2 className='text-3xl font-bold'>Something went wrong!</h2>
      <p className='mt-4 text-muted-foreground'>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className='mt-8 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90'
      >
        Try again
      </button>
    </div>
  );
}
