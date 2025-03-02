'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  id?: string;
  name: string;
  role: string;
  win_rate: number;
  matches: number;
  kills: number;
}

interface Team {
  id?: string;
  name: string;
  total_matches: number;
  win_rate: number;
  total_kills: number;
  avg_survival: number;
  players: Player[];
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team>({
    name: '',
    total_matches: 0,
    win_rate: 0,
    total_kills: 0,
    avg_survival: 0,
    players: [],
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch('/api/teams', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentTeam),
    });

    if (res.ok) {
      setIsEditing(false);
      setCurrentTeam({
        name: '',
        total_matches: 0,
        win_rate: 0,
        total_kills: 0,
        avg_survival: 0,
        players: [],
      });
      fetchTeams();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/teams?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchTeams();
    }
  };

  const addPlayer = () => {
    setCurrentTeam({
      ...currentTeam,
      players: [
        ...currentTeam.players,
        {
          name: '',
          role: '',
          win_rate: 0,
          matches: 0,
          kills: 0,
        },
      ],
    });
  };

  const updatePlayer = (index: number, field: keyof Player, value: string | number) => {
    const newPlayers = [...currentTeam.players];
    newPlayers[index] = {
      ...newPlayers[index],
      [field]: value,
    };
    setCurrentTeam({
      ...currentTeam,
      players: newPlayers,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Teams</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Team Name</label>
          <input
            type="text"
            value={currentTeam.name}
            onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block mb-2">Total Matches</label>
            <input
              type="number"
              value={currentTeam.total_matches}
              onChange={(e) => setCurrentTeam({ ...currentTeam, total_matches: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Win Rate (%)</label>
            <input
              type="number"
              value={currentTeam.win_rate}
              onChange={(e) => setCurrentTeam({ ...currentTeam, win_rate: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Total Kills</label>
            <input
              type="number"
              value={currentTeam.total_kills}
              onChange={(e) => setCurrentTeam({ ...currentTeam, total_kills: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Avg Survival (min)</label>
            <input
              type="number"
              value={currentTeam.avg_survival}
              onChange={(e) => setCurrentTeam({ ...currentTeam, avg_survival: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Players</h3>
          <button
            type="button"
            onClick={addPlayer}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Player
          </button>

          {currentTeam.players.map((player, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                placeholder="Name"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={player.role}
                onChange={(e) => updatePlayer(index, 'role', e.target.value)}
                placeholder="Role"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                value={player.win_rate}
                onChange={(e) => updatePlayer(index, 'win_rate', Number(e.target.value))}
                placeholder="Win Rate"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                value={player.matches}
                onChange={(e) => updatePlayer(index, 'matches', Number(e.target.value))}
                placeholder="Matches"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                value={player.kills}
                onChange={(e) => updatePlayer(index, 'kills', Number(e.target.value))}
                placeholder="Kills"
                className="border p-2 rounded"
                required
              />
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
          {isEditing ? 'Update' : 'Create'} Team
        </button>
      </form>

      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{team.name}</h3>
              <div>
                <button
                  onClick={() => {
                    setCurrentTeam(team);
                    setIsEditing(true);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => team.id && handleDelete(team.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="font-semibold">Total Matches</p>
                <p>{team.total_matches}</p>
              </div>
              <div>
                <p className="font-semibold">Win Rate</p>
                <p>{team.win_rate}%</p>
              </div>
              <div>
                <p className="font-semibold">Total Kills</p>
                <p>{team.total_kills}</p>
              </div>
              <div>
                <p className="font-semibold">Avg Survival</p>
                <p>{team.avg_survival} min</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Players</h4>
              <div className="grid grid-cols-5 gap-4 font-semibold mb-2">
                <p>Name</p>
                <p>Role</p>
                <p>Win Rate</p>
                <p>Matches</p>
                <p>Kills</p>
              </div>
              {team.players.map((player) => (
                <div key={player.id} className="grid grid-cols-5 gap-4">
                  <p>{player.name}</p>
                  <p>{player.role}</p>
                  <p>{player.win_rate}%</p>
                  <p>{player.matches}</p>
                  <p>{player.kills}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
