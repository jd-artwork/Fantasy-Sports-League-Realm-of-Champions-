import React from 'react';
import { 
  Calendar, Flame, Trophy, Sparkles, Shield, ArrowRight, 
  CheckCircle2, Sun, Snowflake, CloudRain, Zap
} from 'lucide-react';
import { TournamentSeason } from '../types';
import { TOURNAMENT_SEASONS } from '../data/battleArenaDatabase';

interface Props {
  activeSeason: TournamentSeason;
  onSelectSeason: (season: TournamentSeason) => void;
}

export const YearLongTournamentSeasons: React.FC<Props> = ({ activeSeason, onSelectSeason }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Year-Long Competitive Campaign
            </span>
            <span className="text-xs text-slate-400 font-mono">4 Championship Eras</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-['Rajdhani'] mt-1">
            Tournament Seasons & Active Sport Rotations
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            The tournament league operates year-round, dynamically activating combat buffs and arena hazards based on real-world active sports leagues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Era:</span>
          <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
            {activeSeason.name}
          </span>
        </div>
      </div>

      {/* 4 Tournament Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TOURNAMENT_SEASONS.map((season) => {
          const isSelected = season.id === activeSeason.id;
          return (
            <div
              key={season.id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-900/95 border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {season.id === 'autumn_crucible' ? <CloudRain className="w-4 h-4 text-amber-400" /> :
                     season.id === 'winter_siege' ? <Snowflake className="w-4 h-4 text-blue-400" /> :
                     season.id === 'spring_awakening' ? <Sparkles className="w-4 h-4 text-emerald-400" /> :
                     <Sun className="w-4 h-4 text-yellow-400" />}
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">{season.seasonPeriod}</span>
                  </div>

                  {isSelected ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Season
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectSeason(season)}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-bold text-indigo-400 hover:text-white bg-indigo-950/40 hover:bg-indigo-900 border border-indigo-800/60 transition"
                    >
                      Activate Era
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-black text-white font-['Rajdhani'] uppercase tracking-tight mt-2">
                  {season.name}
                </h3>
                <span className="text-xs font-semibold text-amber-400/90 block -mt-0.5">
                  {season.codename}
                </span>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {season.themeDescription}
                </p>

                {/* Active Sports Tags */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Active Sports Roster:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {season.activeSports.map(s => (
                      <span
                        key={`${season.id}-${s}`}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Sport Buffs */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Seasonal Sport Buffs:
                  </span>
                  {season.sportBuffs.map(buff => (
                    <div
                      key={`${season.id}-${buff.sport}`}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-amber-300 mr-1.5">[{buff.sport}] {buff.buffName}:</span>
                        <span className="text-slate-400 text-[11px]">{buff.description}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 flex-shrink-0">
                        +{Math.round((buff.bonusMultiplier - 1) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arena Hazard */}
              <div className="pt-3 border-t border-slate-800 text-xs flex items-center gap-2 text-slate-400">
                <Flame className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-300">Hazard:</strong> {season.arenaHazard}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
