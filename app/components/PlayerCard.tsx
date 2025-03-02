import Image from 'next/image';
import ImageFallback from './ImageFallback';

interface PlayerCardProps {
  name: string;
  role: string;
  imageUrl: string;
  stats: {
    matches: number;
    kills: number;
    winRate: number;
  };
}

export default function PlayerCard({ name, role, imageUrl, stats }: PlayerCardProps) {
  return (
    <div className="player-card">
      <div className="mb-4">
        <div className="player-avatar mb-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-dark flex items-center justify-center text-primary font-bold text-xl">
              {name.substring(0, 2)}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-primary/80 text-sm">{role}</p>
      </div>
      
      <div className="space-y-2">
        <div className="stat-row">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{stats.winRate}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Matches</span>
          <span className="stat-value">{stats.matches}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Kills</span>
          <span className="stat-value">{stats.kills}</span>
        </div>
      </div>
    </div>
  );
}
