import PlayerCard from "./components/PlayerCard";

const players = [
  {
    name: "URMaxxioTG",
    role: "SQUAD LEADER",
    imageUrl: "",
    stats: { matches: 1250, kills: 3420, winRate: 68 }
  },
  {
    name: "URDrizzleyTG",
    role: "IGL/RUSHER",
    imageUrl: "",
    stats: { matches: 980, kills: 2890, winRate: 65 }
  },
  {
    name: "URPutrav1TG",
    role: "RUSHER",
    imageUrl: "",
    stats: { matches: 1100, kills: 3100, winRate: 62 }
  },
  {
    name: "URKazuTG",
    role: "SUPPORT",
    imageUrl: "",
    stats: { matches: 890, kills: 2100, winRate: 59 }
  },
  {
    name: "URPluupYTG",
    role: "SUPPORT",
    imageUrl: "",
    stats: { matches: 950, kills: 2500, winRate: 61 }
  }
];

const teamStats = [
  { label: "Total Matches", value: "823" },
  { label: "Win Rate", value: "69.45%" },
  { label: "Total Kills", value: "15,234" },
  { label: "Avg Survival Time", value: "22m" }
];

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Team Dashboard</h1>
        <p className="text-gray-400">Track team performance and statistics</p>
      </header>

      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-6">Top Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {players.map((player) => (
              <PlayerCard
                key={player.name}
                name={player.name}
                role={player.role}
                imageUrl={player.imageUrl}
                stats={player.stats}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6">Team Stats</h2>
          <div className="bg-surface p-6 rounded-xl">
            <div className="space-y-4">
              {teamStats.map((stat, index) => (
                <div key={index} className="stat-row">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
