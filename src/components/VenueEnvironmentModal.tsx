import React, { useState } from 'react';
import { LiveGame } from '../types';
import { 
  X, MapPin, Sun, Snowflake, CloudRain, Shield, 
  Flame, CheckCircle2, AlertCircle, Sparkles, Wind, Thermometer, Play 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  games?: LiveGame[];
  liveGames?: LiveGame[];
  isOpen: boolean;
  onClose: () => void;
  northernSweepActive: boolean;
  onToggleNorthernSweep: () => void;
}

export const VenueEnvironmentModal: React.FC<Props> = ({
  games,
  liveGames,
  isOpen,
  onClose,
  northernSweepActive,
  onToggleNorthernSweep
}) => {
  const gamesList = games || liveGames || [];
  const [selectedGameId, setSelectedGameId] = useState<string>(gamesList[0]?.id || '');

  if (!isOpen) return null;

  const activeGame = gamesList.find(g => g.id === selectedGameId) || gamesList[0];
  const env = activeGame?.venueEnvironment;

  const handleSweepClick = () => {
    onToggleNorthernSweep();
    if (!northernSweepActive) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#e0f2fe', '#93c5fd', '#ffffff']
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                September Season Climate Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Location-Aware D&D Modifiers
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
              Atmospheric Venues & Environmental Trials
            </h2>
            <p className="text-xs text-slate-400">
              Stadium weather directly dictates player stamina, deep pass trajectories, and campaign saving throw DCs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Special Northern Realm Sweep Banner (The Winter Lizard Mechanic!) */}
        <div className={`p-4 mx-6 mt-4 rounded-xl border transition-all ${
          northernSweepActive
            ? 'bg-sky-950/60 border-sky-400/50 text-sky-200 shadow-lg shadow-sky-500/10'
            : 'bg-slate-950/60 border-slate-800 text-slate-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                northernSweepActive
                  ? 'bg-sky-500/20 text-sky-300 ring-2 ring-sky-400/50 animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>The Northern Sweep Rule (Winter Lizard Surge)</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    northernSweepActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {northernSweepActive ? 'ACTIVE ANOMALY' : 'DORMANT (HOT SEPTEMBER)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {northernSweepActive
                    ? '❄️ THE NORTHERN REALM HAS SWEPT THE FIELD! A sub-zero blizzard anomaly shatters the hot September heat! +25% Adamantine Defense active across all matches!'
                    : '☀️ It is warm September, so no winter lizards walk the realm unless a Northern team (Edmonton Oilers) dominates and sweeps the field!'}
                </p>
              </div>
            </div>

            <button
              id="btn-toggle-northern-sweep"
              onClick={handleSweepClick}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-md ${
                northernSweepActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 shadow-sky-500/20'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              <span>{northernSweepActive ? 'Reset to September Heat' : 'Trigger Northern Sweep (Unleash Winter Lizard)'}</span>
            </button>
          </div>
        </div>

        {/* Venue Selector Tabs */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2 overflow-x-auto">
          {games.map(g => {
            const isSelected = g.id === activeGame.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGameId(g.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{g.venueEnvironment?.city || g.league}: {g.venueEnvironment?.stadium || g.venue}</span>
                <span className="font-mono text-amber-300 font-bold">
                  {northernSweepActive && g.venueEnvironment?.isNorthernRealm
                    ? '26°F'
                    : `${g.venueEnvironment?.temperatureF || 75}°F`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Venue Details */}
        {env && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left col: Atmosphere card */}
              <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                    {activeGame.league} Arena
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    <span>{northernSweepActive && env.isNorthernRealm ? '26°F (Polar Blast)' : `${env.temperatureF}°F`}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Rajdhani']">
                    {env.stadium}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{env.city}, {env.stateOrCountry}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-amber-400">Weather Condition:</div>
                  <div className="text-slate-200 font-medium">
                    {northernSweepActive && env.isNorthernRealm
                      ? 'Winter Lizard Blizzard Surge (Sub-Zero Cold Front)'
                      : env.weatherCondition}
                  </div>
                  <div className="text-[11px] text-slate-400 italic mt-1">
                    "{env.seasonContext}"
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Saving Throw DC Target:</span>
                  <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    DC {env.dcSavingThrow}
                  </span>
                </div>
              </div>

              {/* Right col: Environmental Buffs & D&D Tabletop Lore */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>D&D Tactical Atmospheric Modifiers</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Environmental Buff</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {env.environmentalBuff}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                      <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Environmental Hazard / Debuff</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {env.environmentalDebuff}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Dungeon Master Venue Chronicle</span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{env.dndLoreFlavor}"
                    </p>
                  </div>
                </div>

                {/* Teams Playing in this venue */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Venue Host Matchup: </span>
                    <span className="font-bold text-white">{activeGame.homeTeamId.toUpperCase()} vs {activeGame.awayTeamId.toUpperCase()}</span>
                    <span className="text-slate-500 ml-2">({activeGame.status} • {activeGame.homeScore}-{activeGame.awayScore})</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    Real-Time Environment Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
