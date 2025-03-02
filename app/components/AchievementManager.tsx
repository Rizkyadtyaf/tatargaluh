import { useState, useEffect } from 'react';
import { Achievement, CreateAchievementDTO } from '../types/achievement';

export default function AchievementManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<CreateAchievementDTO>({
    name: '',
    description: '',
    points: 0,
    image_url: '',
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create achievement');
      }

      const newAchievement = await response.json();
      setAchievements([newAchievement, ...achievements]);
      setFormData({
        name: '',
        description: '',
        points: 0,
        image_url: '',
      });
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value,
    }));
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6 bg-surface rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary">Achievement Manager</h2>
      
      {/* Create Achievement Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface-dark border border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface-dark border border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Points</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface-dark border border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface-dark border border-gray-600 text-white"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/80 transition"
        >
          Create Achievement
        </button>
      </form>

      {/* Achievement List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Existing Achievements</h3>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-4 bg-surface-dark rounded-lg border border-gray-600"
          >
            <div className="flex items-center gap-4">
              {achievement.image_url && (
                <img
                  src={achievement.image_url}
                  alt={achievement.name}
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <div>
                <h4 className="text-lg font-semibold text-primary">{achievement.name}</h4>
                <p className="text-sm text-gray-300">{achievement.description}</p>
                <p className="text-sm text-primary mt-1">{achievement.points} points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
