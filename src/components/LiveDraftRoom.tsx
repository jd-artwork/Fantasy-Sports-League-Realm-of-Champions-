import React, { useState, useEffect } from 'react';
import { DraftSession, SportsPlayer, FantasyGuildTeam, DraftPick } from '../types';
import { 
  Dices, Clock, Sparkles, Search, Check, AlertCircle, 
  Trophy, Shield, Flame, Users, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  draftSession: DraftSession;
  availablePlayers: SportsPlayer[];
  guilds: FantasyGuildTeam[];
  onDraftPick: (playerId: string, guildId: string, managerId?: string) => Promise<void>;
  onConsultScout: (currentRoster: SportsPlayer[], availablePlayers: SportsPlayer[], guildName: string) => Promise<{
    targetPlayer: string;
    analysis: string;
    tacticalRecommendation: string;
  }>;
  onSelectPlayer: (player: SportsPlayer) => void;
}

export const LiveDraftRoom: React.FC<Props> = ({
  draftSession,
  availablePlayers,
  guilds,
  onDraftPick,
  onConsultScout,
  onSelectPlayer
}) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<SportsPlayer | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [scoutAdvice, setScoutAdvice] = useState<{ targetPlayer: string; analysis: string; tacticalRecommendation: string } | null>(null);
  const [loadingScout, setLoadingScout] = useState<boolean>(false);

  // Active guild on clock
  const currentGuildOnClock = draftSession?.draftOrder?.[draftSession?.currentPickIndex] || draftSession?.draftOrder?.[0] || { guildId: 'guild-1', guildName: 'Vanguard of Thunder' };
  const activeGuildData = (guilds || []).find(g => g.id === currentGuildOnClock.guildId) || guilds?.[0] || { id: 'guild-1', name: 'Vanguard of Thunder' } as any;
  const isUserGuildTurn = activeGuildData?.id === 'guild-1';

  // Timer countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter available players
  const filteredPlayers = availablePlayers.filter(p => {
    const matchLeague = selectedLeague === 'ALL' || p.league === selectedLeague;
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.teamShort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLeague && matchSearch;
  });

  const handleConsultScout = async () => {
    setLoadingScout(true);
    try {
      const res = await onConsultScout(activeGuildData.roster, availablePlayers, activeGuildData.name);
      setScoutAdvice(res);
    } finally {
      setLoadingScout(false);
    }
  };

  const handleExecutePick = async () => {
    if (!selectedPlayer) return;
    setIsDrafting(true);
    try {
      await onDraftPick(selectedPlayer.id, activeGuildData.id, selectedManagerId || undefined);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSelectedPlayer(null);
      setTimerSeconds(30);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Draft Command Header */}
      <div id="draft-header" className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5" />
                Live Snake Draft Arena
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Round {draftSession.currentRound} of {draftSession.totalRounds} • Pick #{draftSession.picks.length + 1}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] uppercase tracking-tight text-white">
              Multi-Sport Competitive Drafting Room
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Draft top talent across NFL, NBA, EPL, and MLB. Assign each drafted player under the active command of a specific human syndicate manager.
            </p>
          </div>

          {/* On Clock Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 sm:w-80 shrink-0 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400">ON THE CLOCK</span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</span>
              </div>
            </div>

            <div className="font-bold text-lg text-white truncate">
              {activeGuildData.name}
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-1000"
                style={{ width: `${(timerSeconds / 30) * 100}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{isUserGuildTurn ? '⭐ YOUR GUILD IS DRAFTING' : 'Opponent Drafting...'}</span>
              <span className="font-mono text-emerald-400 font-bold">${activeGuildData.budget}M Cap</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Scout Briefing Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span>Commissioner AI Scout Advice</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {scoutAdvice ? (
                <span>
                  <strong className="text-white">{scoutAdvice.targetPlayer}:</strong> {scoutAdvice.analysis}
                </span>
              ) : (
                'Request real-time tactical draft analysis from Arch-Commissioner Vorath.'
              )}
            </p>
          </div>
        </div>

        <button
          id="btn-consult-scout"
          onClick={handleConsultScout}
          disabled={loadingScout}
          className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          {loadingScout ? 'Analyzing Draft...' : 'Consult AI Scout'}
        </button>
      </div>

      {/* Main Draft Area: Player Pool & Selection Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Player Pool */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Available Players Pool ({filteredPlayers.length})
              </h3>
              <p className="text-xs text-slate-400">Select any player to inspect stats and draft for your syndicate.</p>
            </div>

            {/* League Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['ALL', 'NFL', 'NBA', 'WNBA', 'NWSL', 'EPL', 'MLB', 'NHL'].map(league => (
                <button
                  key={league}
                  onClick={() => setSelectedLeague(league)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedLeague === league
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {league === 'WNBA' ? 'WNBA 👑' : league === 'NWSL' ? 'NWSL 👑' : league}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-draft-player-search"
              type="text"
              placeholder="Search available draft prospects by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs border border-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Player Cards List */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredPlayers.map(player => {
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-amber-400 shrink-0">
                      {player.position}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                        <span>{player.name}</span>
                        <span className="text-[10px] font-mono px-1.5 rounded bg-slate-800 text-slate-400">
                          {player.teamShort} ({player.league})
                        </span>
                        {player.isWomensSports && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            👑 Secret Perk
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-indigo-400 mt-0.5">
                        {player.rpgClass} • <span className="text-slate-400 italic text-[11px]">{player.synergyTrait}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats & ADP */}
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-bold text-amber-400 font-mono">{player.stats.fantasyPointsPerGame} fpts</div>
                      <div className="text-[10px] text-slate-500">ADP #{player.adp}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlayer(player);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Draft Confirmation & Co-Manager Assignment */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Draft Selection Deck</span>
            </h3>

            {selectedPlayer ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                    Tier {selectedPlayer.fantasyTier} Prospect
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">{selectedPlayer.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedPlayer.teamShort} • {selectedPlayer.position} • {selectedPlayer.league}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="text-indigo-400 font-bold">{selectedPlayer.rpgClass}</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">{selectedPlayer.synergyTrait}</div>
                </div>

                {/* Multi-Person Management Assignment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Assign Managing Co-Manager:
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Designate which person in your syndicate will actively command this player:
                  </p>
                  <select
                    id="select-draft-manager"
                    value={selectedManagerId}
                    onChange={(e) => setSelectedManagerId(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Default (Guildmaster)</option>
                    {activeGuildData.members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  id="btn-confirm-draft-pick"
                  onClick={handleExecutePick}
                  disabled={isDrafting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/25 disabled:opacity-50"
                >
                  {isDrafting ? 'Locking in Pick...' : `Draft ${selectedPlayer.name} for ${activeGuildData.name}`}
                </button>
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
                <Dices className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Select a player from the pool on the left to review and draft into your syndicate.</p>
              </div>
            )}
          </div>

          {/* Syndicate Roster Preview */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeGuildData.name} Roster ({activeGuildData.roster.length} Picks)
            </div>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {activeGuildData.roster.map(p => (
                <span
                  key={p.id}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1"
                >
                  <span className="text-amber-400 font-mono">{p.position}</span>
                  <span>{p.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Draft Board Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Draft Board History</span>
        </h3>

        {draftSession.picks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            No draft picks made yet. Make the first selection above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Pick</th>
                  <th className="pb-3">Guild</th>
                  <th className="pb-3">Player</th>
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Managing Co-Manager</th>
                  <th className="pb-3 text-right pr-2">Comm. Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {draftSession.picks.map((pick, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 pl-2 font-mono font-bold text-amber-400">
                      R{pick.round}.P{pick.pickNumber} (#{pick.overallPick})
                    </td>
                    <td className="py-2.5 text-white font-semibold">{pick.guildName}</td>
                    <td className="py-2.5 font-bold text-slate-200">
                      {pick.player.name}
                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({pick.player.teamShort})</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                        {pick.player.position}
                      </span>
                    </td>
                    <td className="py-2.5 text-indigo-300 font-medium">
                      {pick.managerName || 'Guildmaster'}
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono font-bold text-emerald-400">
                      {pick.commissionerGrade || 'A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
