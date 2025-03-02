'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface rounded-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="w-full py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
