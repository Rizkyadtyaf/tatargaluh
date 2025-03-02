'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[LoginPage] Login attempt for user:', name);
      setIsLoading(true);
      setError('');

      console.log('[LoginPage] Calling NextAuth signIn...');
      const result = await signIn('credentials', {
        name,
        password,
        redirect: false,
      });

      console.log('[LoginPage] SignIn result:', {
        ok: result?.ok,
        error: result?.error,
        url: result?.url,
        status: result?.status
      });

      if (!result?.error) {
        console.log('[LoginPage] Login successful, redirecting to dashboard');
        // Kalau berhasil login, redirect ke dashboard admin
        router.replace('/admin/dashboard');
      } else {
        console.error('[LoginPage] Login failed:', result.error);
        setError('Username atau password salah');
      }
    } catch (error) {
      console.error('[LoginPage] Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
      console.log('[LoginPage] Login process completed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-surface-dark border border-gray-700 focus:border-primary focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-surface-dark border border-gray-700 focus:border-primary focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black font-medium p-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
