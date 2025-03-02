'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminSidebar from '../../components/AdminSidebar';

interface Tournament {
  id: string;
  name: string;
  matches: Match[];
}

interface Match {
  id: string;
  round: string;
  placement: string;
  kills: number;
  date: string;
  prize: string;
}

export default function AdminDashboardPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth and fetch data
  useEffect(() => {
    const auth = Cookies.get('auth');
    if (!auth) {
      router.replace('/admin/login');
      return;
    }
    fetchTournaments();
  }, [router]);

  // Helper function to handle API responses
  async function handleApiResponse(response: Response) {
    if (response.status === 401) {
      Cookies.remove('auth');
      router.replace('/admin/login');
      return null;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }

    return data;
  }

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await fetch('/api/tournaments', {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await handleApiResponse(response);
      if (data) {
        setTournaments(data.tournaments);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  // Add new tournament
  const handleAddTournament = async (name: string) => {
    try {
      setError('');

      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await handleApiResponse(response);
      if (data) {
        await fetchTournaments();
      }
    } catch (err) {
      console.error('Add tournament error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add tournament');
    }
  };

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('auth');
    router.replace('/admin/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="text-center">Loading tournaments...</div>
        </main>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="bg-surface p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Add Tournament</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                if (name && typeof name === 'string') {
                  handleAddTournament(name);
                  (e.target as HTMLFormElement).reset();
                }
              }}
              className="flex gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Tournament Name"
                className="flex-1 p-3 rounded-lg bg-surface-dark border border-gray-700 focus:border-primary focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Tournament
              </button>
            </form>
          </div>

          <div className="bg-surface p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
            <div className="space-y-4">
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="p-4 bg-surface-dark rounded-lg"
                  >
                    <h3 className="font-medium">{tournament.name}</h3>
                    <div className="mt-2 text-sm text-gray-400">
                      {tournament.matches?.length || 0} matches
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No tournaments found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
