import Image from 'next/image';

interface MatchCardProps {
  map: string;
  mode: string;
  imageUrl: string;
  placement: number;
  kills: number;
  date: string;
}

export default function MatchCard({ map, mode, imageUrl, placement, kills, date }: MatchCardProps) {
  return (
    <div className="flex items-center justify-between bg-surface-dark p-4 rounded-lg hover:bg-opacity-90 transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={imageUrl}
            alt={`${map} match`}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{map}</h3>
          <p className="text-sm text-gray-400">{mode}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-primary font-medium">#{placement}</p>
        <p className="text-sm text-gray-400">{kills} Kills</p>
      </div>
    </div>
  );
}
