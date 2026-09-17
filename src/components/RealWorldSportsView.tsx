import React, { useState } from 'react';
import { SportsTeam, SportsPlayer, LiveGame, SportLeague } from '../types';
import { 
  Trophy, Star, Search, Flame, Radio, Clock, 
  ChevronRight, ArrowUpRight, ShieldCheck, Activity 
} from 'lucide-react';

interface Props {
  teams: SportsTeam[];
  players: SportsPlayer[];
  games: LiveGame[];
  favoriteTeamIds: string[];
  onToggleFavoriteTeam: (teamId: string) => void;
  onSelectGame: (game: LiveGame) => void;
  onSelectPlayer: (player: SportsPlayer) => void;
}

export const RealWorldSportsView: React.FC<Props> = ({
  teams,
  players,
  games,
  favoriteTeamIds,
  onToggleFavoriteTeam,
  onSelectGame,
  onSelectPlayer
}) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const leagues: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Leagues' },
    { id: 'NFL', label: 'NFL Football' },
    { id: 'NBA', label: 'NBA Basketball' },
    { id: 'WNBA', label: 'WNBA 👑 Perks' },
    { id: 'NWSL', label: 'NWSL 👑 Perks' },
    { id: 'EPL', label: 'EPL Soccer' },
    { id: 'MLB', label: 'MLB Baseball' },
    { id: 'NHL', label: 'NHL Hockey' }
  ];

  // Filtered teams
  const filteredTeams = teams.filter(team => {
    const matchesLeague = selectedLeague === 'ALL' || team.league === selectedLeague;
    const matchesSearch = !searchQuery || 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLeague && matchesSearch;
  });

  // Favorite teams
  const favoriteTeams = teams.filter(t => favoriteTeamIds.includes(t.id));

  // Filtered games
  const filteredGames = games.filter(g => selectedLeague === 'ALL' || g.league === selectedLeague);

  // Top players
  const filteredPlayers = players.filter(p => selectedLeague === 'ALL' || p.league === selectedLeague);
  const topPlayers = [...filteredPlayers].sort((a, b) => b.stats.fantasyPointsPerGame - a.stats.fantasyPointsPerGame).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Real-World Sports & Team Command Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pull information from sports teams, track live scores, player stats, and maintain your favorite teams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-sports-search"
            type="text"
            placeholder="Search teams or players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* League Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {leagues.map(l => (
          <button
            key={l.id}
            id={`league-pill-${l.id}`}
            onClick={() => setSelectedLeague(l.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedLeague === l.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* 1. My Favorite Teams Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
              My Favorite Teams ({favoriteTeams.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click the star on any team card to pin it here
          </span>
        </div>

        {favoriteTeams.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-xs text-slate-400">
            No favorite teams pinned yet. Star your favorite teams below to monitor their game day schedule and stats!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTeams.map(team => {
              const liveGame = games.find(g => g.homeTeamId === team.id || g.awayTeamId === team.id);
              return (
                <div
                  key={team.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {team.league} • {team.conferenceOrDivision}
                      </span>
                      <h4 className="font-bold text-base text-white mt-1.5">{team.name}</h4>
                      <p className="text-xs text-slate-400">{team.city}</p>
                    </div>
                    <button
                      onClick={() => onToggleFavoriteTeam(team.id)}
                      className="text-amber-400 p-1 hover:bg-slate-800 rounded-lg transition"
                      title="Unpin favorite team"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  {/* Record & Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Record</div>
                      <div className="font-bold text-white font-mono">{team.record.wins}-{team.record.losses}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Streak</div>
                      <div className="font-bold text-emerald-400 font-mono">{team.record.streak}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">PPG</div>
                      <div className="font-bold text-amber-400 font-mono">{team.stats.pointsPerGame}</div>
                    </div>
                  </div>

                  {/* Live Game Status if active */}
                  {liveGame && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>{liveGame.status === 'LIVE' ? `LIVE (${liveGame.clock})` : liveGame.status}</span>
                      </div>
                      <button
                        onClick={() => onSelectGame(liveGame)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <span>Box Score</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Live & Scheduled Game Day Matchups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
              Game Day Schedule & Live Scores
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredGames.length} Matchups Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGames.map(game => {
            const homeTeam = teams.find(t => t.id === game.homeTeamId);
            const awayTeam = teams.find(t => t.id === game.awayTeamId);
            const isLive = game.status === 'LIVE';

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                      {game.league}
                    </span>
                    <span className="text-xs text-slate-400">{game.venue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {game.venueEnvironment && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-amber-300">
                        <span>{game.venueEnvironment.temperatureF}°F</span>
                        <span className="text-slate-400">({game.venueEnvironment.city})</span>
                      </span>
                    )}

                    {isLive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        {game.clock}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        {game.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Teams & Scores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{homeTeam?.name || game.homeTeamId}</span>
                      <span className="text-xs text-slate-500 font-mono">({homeTeam?.record.wins}-{homeTeam?.record.losses})</span>
                    </div>
                    <span className="text-xl font-mono text-amber-400">{game.homeScore}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{awayTeam?.name || game.awayTeamId}</span>
                      <span className="text-xs text-slate-500 font-mono">({awayTeam?.record.wins}-{awayTeam?.record.losses})</span>
                    </div>
                    <span className="text-xl font-mono text-slate-200">{game.awayScore}</span>
                  </div>
                </div>

                {/* Top Performers Preview */}
                {game.boxScore.topPerformers.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Top Performers:</div>
                    <div className="space-y-1">
                      {game.boxScore.topPerformers.slice(0, 2).map((perf, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-300">
                          <span>{perf.name} ({perf.team}): <span className="text-slate-400">{perf.statLine}</span></span>
                          <span className="font-mono font-bold text-amber-400">{perf.fantasyPoints} fpts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onSelectGame(game)}
                  className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Live Box Score & Play-by-Play</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. League Teams & Standings Directory */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
              League Standings & Team Directory
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {filteredTeams.length} Teams Loaded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Fav</th>
                <th className="pb-3">Team</th>
                <th className="pb-3">Division</th>
                <th className="pb-3 text-center">W-L</th>
                <th className="pb-3 text-center">Streak</th>
                <th className="pb-3 text-center">PPG</th>
                <th className="pb-3 text-center">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTeams.map(team => {
                const isFav = favoriteTeamIds.includes(team.id);
                return (
                  <tr key={team.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 pl-2">
                      <button
                        onClick={() => onToggleFavoriteTeam(team.id)}
                        className="text-slate-500 hover:text-amber-400 transition"
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 font-bold text-slate-100">
                      <span>{team.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-1.5">({team.shortName})</span>
                      {team.isWomensSports && (
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-flex items-center gap-1">
                          👑 Valkyrie Perk
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400">{team.conferenceOrDivision}</td>
                    <td className="py-3 text-center font-mono font-bold text-white">
                      {team.record.wins}-{team.record.losses}
                    </td>
                    <td className="py-3 text-center font-mono font-semibold text-emerald-400">
                      {team.record.streak}
                    </td>
                    <td className="py-3 text-center font-mono text-amber-400">
                      {team.stats.pointsPerGame}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-1">
                        {team.stats.form.map((f, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                              f === 'W' ? 'bg-emerald-500 text-slate-950' : (f === 'D' ? 'bg-slate-600 text-white' : 'bg-rose-500 text-white')
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
