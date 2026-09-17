import React from 'react';
import { SportsPlayer } from '../types';
import { X, Sparkles, Activity, Trophy, Shield, Flame } from 'lucide-react';

interface Props {
  player: SportsPlayer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<Props> = ({ player, isOpen, onClose }) => {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-lg flex items-center justify-center font-mono">
              #{player.jerseyNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {player.league} • {player.position}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Tier {player.fantasyTier}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{player.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{player.teamShort} (Team ID: {player.teamId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* D&D Class & Synergy Attribute */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Tabletop RPG Archetype & Trait</span>
          </div>
          <div className="text-base font-bold text-white">{player.rpgClass}</div>
          <p className="text-xs text-slate-300 italic">
            "{player.synergyTrait}"
          </p>
        </div>

        {/* Live Game Status */}
        {player.liveGameStats && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Live In-Game Production
              </span>
              <span className="font-mono font-bold text-base text-amber-400">
                {player.liveGameStats.currentPoints.toFixed(1)} fpts
              </span>
            </div>
            <p className="text-slate-200 font-mono">{player.liveGameStats.summary}</p>
          </div>
        )}

        {/* Real-World Statistics */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Season Statistics & Fantasy Metrics
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Avg Fpts/G</div>
              <div className="text-lg font-bold text-amber-400 font-mono">{player.stats.fantasyPointsPerGame}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Games Played</div>
              <div className="text-lg font-bold text-white font-mono">{player.stats.gamesPlayed}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Average Draft Pos</div>
              <div className="text-lg font-bold text-slate-300 font-mono">#{player.adp}</div>
            </div>

            {player.stats.passingYards !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Pass Yds</div>
                <div className="text-base font-bold text-white font-mono">{player.stats.passingYards}</div>
              </div>
            )}

            {player.stats.passingTouchdowns !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Pass TDs</div>
                <div className="text-base font-bold text-emerald-400 font-mono">{player.stats.passingTouchdowns}</div>
              </div>
            )}

            {player.stats.rushingYards !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Rush Yds</div>
                <div className="text-base font-bold text-white font-mono">{player.stats.rushingYards}</div>
              </div>
            )}

            {player.stats.points !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Points PPG</div>
                <div className="text-base font-bold text-amber-400 font-mono">{player.stats.points}</div>
              </div>
            )}

            {player.stats.rebounds !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Rebounds RPG</div>
                <div className="text-base font-bold text-white font-mono">{player.stats.rebounds}</div>
              </div>
            )}

            {player.stats.goals !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Goals</div>
                <div className="text-base font-bold text-emerald-400 font-mono">{player.stats.goals}</div>
              </div>
            )}

            {player.stats.homeRuns !== undefined && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Home Runs</div>
                <div className="text-base font-bold text-amber-400 font-mono">{player.stats.homeRuns}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
