import React, { useState } from 'react';
import { SportsPlayer, FantasyGuildTeam, AchievementBadge } from '../types';
import { 
  X, Crown, Sparkles, ShieldCheck, Zap, HeartHandshake,
  CheckCircle2, Plus, ArrowUpRight, Flame, Trophy 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userGuild: FantasyGuildTeam;
  players: SportsPlayer[];
  badges: AchievementBadge[];
  onFosterPlayer: (playerId: string) => Promise<void>;
  onOpenWagers: () => void;
}

export const WomensSportsPerksModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userGuild,
  players,
  badges,
  onFosterPlayer,
  onOpenWagers
}) => {
  const [fosteringId, setFosteringId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const womensPlayers = players.filter(p => p.isWomensSports);
  const valkyrieBadge = badges.find(b => b.id === 'badge-valkyrie-sovereign');
  const perks = userGuild.womensSportsPerks;
  const isPerkActive = perks?.active;

  const handleFoster = async (player: SportsPlayer) => {
    setFosteringId(player.id);
    try {
      await onFosterPlayer(player.id);
      setSuccessMessage(`👑 Secret Valkyrie Sovereign Perk Activated! ${player.name} added to your guild roster. +25 secret points awarded!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } finally {
      setFosteringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Secret Sports Pantheon Perks
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                WNBA & NWSL Sovereign Ward
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
              <span>Fostering Women's Sports Stars</span>
            </h2>
            <p className="text-xs text-slate-300">
              Fostering any women's sports player or team activates hidden secret perks, massive point multipliers, and protective shields for friendly wagers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Secret Perks Overview Cards */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs font-bold text-purple-200 uppercase">
              +20% Secret Multiplier
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Every point scored by fostered WNBA/NWSL players receives an automatic +20% secret fantasy boost.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300 mb-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xs font-bold text-rose-200 uppercase">
              Matriarch Aegis Shield
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Protects against total gutter collapse during risky friendly wagers, absorbing 50% of point loss!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs font-bold text-amber-200 uppercase">
              +25 Bonus Points & Badge
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Instantly grants +25 points to your guild and permanently unlocks the Legendary <strong>Valkyrie Sovereign</strong> badge.
            </p>
          </div>
        </div>

        {/* Guild Perks Status Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Guild Secret Perk Status:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
              isPerkActive
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isPerkActive ? '👑 Sovereign Ward ACTIVE (+20% Multiplier)' : 'Inactive - Foster a player below'}
            </span>
          </div>

          {valkyrieBadge && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <span>{valkyrieBadge.unlocked ? '✨ Badge Unlocked' : '🔒 Badge Locked'}</span>
            </div>
          )}
        </div>

        {/* Player Roster to Foster */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Available Elite Women's Sports Superstars
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {womensPlayers.map(player => {
              const isAlreadyInRoster = userGuild.roster.some(p => p.id === player.id);

              return (
                <div 
                  key={player.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {player.league}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{player.position}</span>
                        <span className="text-xs font-bold text-amber-400">Tier {player.fantasyTier}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-300 transition">
                        {player.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {player.teamShort} • {player.rpgClass}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">FP/G</span>
                      <span className="text-base font-extrabold font-mono text-purple-300">
                        {player.stats.fantasyPointsPerGame}
                      </span>
                    </div>
                  </div>

                  {/* Secret Perk Description */}
                  {player.secretPerkDescription && (
                    <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-900/40 text-[11px] text-purple-200/90 mb-3 flex items-start gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{player.secretPerkDescription}</span>
                    </div>
                  )}

                  {/* Foster Action Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500">
                      {isAlreadyInRoster ? 'Currently in your Guild Roster' : 'Fosters into active campaign roster'}
                    </span>

                    <button
                      disabled={fosteringId === player.id || isAlreadyInRoster}
                      onClick={() => handleFoster(player)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        isAlreadyInRoster
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40'
                      }`}
                    >
                      {isAlreadyInRoster ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fostered</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Foster Superstar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Continuous multi-sport overlap: WNBA & NWSL scores count toward cross-league campaign dominance.
          </span>
          <button
            onClick={onOpenWagers}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Stake Perks in Friendly Wagers
          </button>
        </div>

      </div>
    </div>
  );
};
