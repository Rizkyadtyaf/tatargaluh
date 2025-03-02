'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

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

export default function DashboardPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Fetch tournaments
    fetchTournaments();
  }, [router]);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleAddTournament = async (name: string) => {
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to add tournament');
      }

      fetchTournaments();
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
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

        <div className="grid gap-6">
          <div className="bg-surface p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Add Tournament</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddTournament(formData.get('name') as string);
                (e.target as HTMLFormElement).reset();
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
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="p-4 bg-surface-dark rounded-lg"
                >
                  <h3 className="font-medium">{tournament.name}</h3>
                  <div className="mt-2 text-sm text-gray-400">
                    {tournament.matches.length} matches
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
