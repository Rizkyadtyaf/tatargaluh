interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="stats-value">{value}</span>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
  }>;
}

export default function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <StatItem key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
