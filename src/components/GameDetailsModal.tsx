import React from 'react';
import { LiveGame, SportsTeam } from '../types';
import { X, Radio, Trophy, Activity, Flame, Clock, Shield, Sun, Snowflake, MapPin, Thermometer, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  game: LiveGame | null;
  teams: SportsTeam[];
  isOpen: boolean;
  onClose: () => void;
  onSimulateTick: (gameId: string) => void;
}

export const GameDetailsModal: React.FC<Props> = ({
  game,
  teams,
  isOpen,
  onClose,
  onSimulateTick
}) => {
  if (!isOpen || !game) return null;

  const homeTeam = teams.find(t => t.id === game.homeTeamId);
  const awayTeam = teams.find(t => t.id === game.awayTeamId);
  const isLive = game.status === 'LIVE';
  const env = game.venueEnvironment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs font-bold">
              {game.league}
            </span>
            <span className="text-xs text-slate-400">{game.venue}</span>
          </div>

          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                LIVE {game.clock}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 font-mono">{game.status}</span>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Score Clash Display */}
        <div className="grid grid-cols-5 items-center gap-4 p-5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="col-span-2 text-left">
            <div className="text-lg font-bold text-white truncate">{homeTeam?.name || game.homeTeamId}</div>
            <div className="text-xs text-slate-400 font-mono">Record: {homeTeam?.record.wins}-{homeTeam?.record.losses}</div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{game.homeScore}</div>
          </div>

          <div className="col-span-1 text-center font-bold text-slate-600 font-['Rajdhani'] text-2xl">
            VS
          </div>

          <div className="col-span-2 text-right">
            <div className="text-lg font-bold text-white truncate">{awayTeam?.name || game.awayTeamId}</div>
            <div className="text-xs text-slate-400 font-mono">Record: {awayTeam?.record.wins}-{awayTeam?.record.losses}</div>
            <div className="text-3xl font-extrabold text-slate-200 font-mono mt-1">{game.awayScore}</div>
          </div>
        </div>

        {/* Venue Climate & Environmental D&D Modifiers Section */}
        {env && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {env.isNorthernRealm && env.northernSweepActive ? (
                  <Snowflake className="w-4 h-4 text-sky-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Venue Atmosphere & September Weather
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  {env.temperatureF}°F
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  DC {env.dcSavingThrow}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">{env.stadium} ({env.city}, {env.stateOrCountry})</span>
              <span className="text-slate-400 ml-1.5">• {env.weatherCondition}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-0.5">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Atmospheric Boon</span>
                </div>
                <p className="text-[11px] text-slate-300">{env.environmentalBuff}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 space-y-0.5">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span>Atmospheric Debuff</span>
                </div>
                <p className="text-[11px] text-slate-300">{env.environmentalDebuff}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              "{env.dndLoreFlavor}"
            </p>
          </div>
        )}

        {/* Live Simulation Action */}
        {isLive && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Real-time scoring updates active. Simulate next play tick to test:</span>
            </div>
            <button
              onClick={() => onSimulateTick(game.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1 shadow-sm"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Advance Play</span>
            </button>
          </div>
        )}

        {/* Team Stats Box Score Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Team Comparison Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-amber-400 text-sm">{homeTeam?.shortName} Stats</div>
              {Object.entries(game.boxScore.homeTeamStats).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-mono font-bold text-white">{val}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-300 text-sm">{awayTeam?.shortName} Stats</div>
              {Object.entries(game.boxScore.awayTeamStats).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-mono font-bold text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Performers & Fantasy Production</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {game.boxScore.topPerformers.map((perf, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{perf.name} ({perf.team})</div>
                  <div className="text-slate-400">{perf.statLine}</div>
                </div>
                <div className="text-right font-mono font-bold text-amber-400 text-sm">
                  {perf.fantasyPoints} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Play-by-Play Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Play-by-Play Logs ({game.plays.length})</span>
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {game.plays.map((play) => (
              <div
                key={play.id}
                className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                  play.scoringPlay
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-amber-400">
                    {play.quarterOrPeriod} • {play.time}
                  </span>
                  {play.scoringPlay && (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase text-[9px]">
                      Scoring Play
                    </span>
                  )}
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">{play.description}</p>
                {play.fantasyPointsImpact && (
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold pt-0.5">
                    ⚡ Fantasy Impact: +{play.fantasyPointsImpact.points.toFixed(1)} pts to {play.fantasyPointsImpact.playerName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
