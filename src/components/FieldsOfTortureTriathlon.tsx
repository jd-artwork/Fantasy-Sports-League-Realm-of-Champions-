import React, { useState, useEffect } from 'react';
import { 
  Flame, Trophy, Zap, Play, Pause, RotateCcw, Waves, Bike, 
  Footprints, AlertTriangle, Crown, Sparkles, Heart, Activity
} from 'lucide-react';
import { TriathlonState, TriathlonRacerProgress, SportsPlayer } from '../types';
import { createInitialTriathlonState } from '../data/battleArenaDatabase';
import { playCriticalFanfare, playDiceRollSound, playUiClick } from '../utils/audioSynth';

interface Props {
  guilds: Array<{ id: string; name: string; bannerColor?: string; crestIcon?: string }>;
  players: SportsPlayer[];
  onRecordMatch?: (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => void;
}

export const FieldsOfTortureTriathlon: React.FC<Props> = ({ guilds, players, onRecordMatch }) => {
  const [triState, setTriState] = useState<TriathlonState>(() => createInitialTriathlonState(guilds, players));
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);

  // Stage descriptions & names
  const STAGE_CONFIGS = {
    1: {
      name: 'Stage 1: The Abyssal Rapids (Swim - 1.5km)',
      sportFocus: 'CON & Swimming Stroke / Fluidity (EPL & WNBA Endurance)',
      hazard: 'Whirlpool Churn: Water turbulence demands CON checks or 15% stamina drain',
      icon: Waves
    },
    2: {
      name: 'Stage 2: Hellfire Velodrome (Cycling - 40km)',
      sportFocus: 'DEX & Aerodynamic Wattage (NFL Sprint & NHL Glide)',
      hazard: 'Volcanic Cinder Headwinds: 30mph gusts penalize solo racers without a drafting partner',
      icon: Bike
    },
    3: {
      name: 'Stage 3: The Magma Marathon (Run - 10km)',
      sportFocus: 'STR/CON Lactic Acid Threshold & Finishing Kick',
      hazard: 'Magma Fissure Obstacles: Requires agile hurdle leaps across burning crevices',
      icon: Footprints
    }
  };

  // Pace strategy change for user's club (guild 0)
  const handleChangePace = (guildId: string, newPace: 'CONSERVATIVE' | 'STEADY' | 'BREAKAWAY' | 'ALL_OUT') => {
    setTriState(prev => ({
      ...prev,
      racers: prev.racers.map(r => r.guildId === guildId ? { ...r, paceMode: newPace } : r)
    }));
  };

  // Stamina Potion boost
  const handleStaminaBoost = (guildId: string) => {
    setTriState(prev => ({
      ...prev,
      racers: prev.racers.map(r => r.guildId === guildId ? {
        ...r,
        stamina: Math.min(100, r.stamina + 35),
        specialPerkUsed: true
      } : r),
      eventLogs: [
        `⚡ STAMINA SURGE! ${prev.racers.find(r => r.guildId === guildId)?.racerPlayerName} downs an Arcane Hydration Sponge, restoring +35% Stamina!`,
        ...prev.eventLogs
      ]
    }));
  };

  // Simulate Step / Split
  const handleSimulateSplit = () => {
    if (triState.isFinished) return;

    setTriState(prev => {
      let stageTransition = false;
      const logs: string[] = [];

      const updatedRacers: TriathlonRacerProgress[] = prev.racers.map(r => {
        if (r.finished) return r;

        // Progress based on pace & stamina
        let progressIncrement = 0;
        let staminaBurn = 0;

        switch (r.paceMode) {
          case 'CONSERVATIVE':
            progressIncrement = Math.floor(Math.random() * 10) + 12;
            staminaBurn = 4;
            break;
          case 'STEADY':
            progressIncrement = Math.floor(Math.random() * 12) + 18;
            staminaBurn = 8;
            break;
          case 'BREAKAWAY':
            progressIncrement = Math.floor(Math.random() * 15) + 26;
            staminaBurn = 18;
            break;
          case 'ALL_OUT':
            progressIncrement = Math.floor(Math.random() * 18) + 32;
            staminaBurn = 26;
            break;
        }

        // Fatigue penalty if stamina is empty
        const newStamina = Math.max(0, r.stamina - staminaBurn);
        if (newStamina === 0) {
          progressIncrement = Math.floor(progressIncrement * 0.45);
          logs.push(`⚠️ FATIGUE WARNING: ${r.racerPlayerName} (${r.guildName}) is running on empty! Speed reduced.`);
        }

        let newProgress = r.stageProgressPercent + progressIncrement;
        let currentStage = r.currentStage;
        let finished = false;

        // Stage advances
        if (newProgress >= 100) {
          if (currentStage < 3) {
            currentStage = (currentStage + 1) as 1 | 2 | 3;
            newProgress = 0;
            stageTransition = true;
            logs.push(`🏁 TRANSITION ZONE! ${r.racerPlayerName} completes Stage ${r.currentStage} and enters ${STAGE_CONFIGS[currentStage].name}!`);
          } else {
            newProgress = 100;
            finished = true;
            logs.push(`🏆 FINISH LINE CROSSED! ${r.racerPlayerName} (${r.guildName}) finishes the Fields of Torture Triathlon!`);
          }
        }

        return {
          ...r,
          currentStage,
          stageProgressPercent: Math.min(100, newProgress),
          stamina: newStamina,
          finished
        };
      });

      // Sort ranks
      const sorted = [...updatedRacers].sort((a, b) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        if (a.currentStage !== b.currentStage) return b.currentStage - a.currentStage;
        return b.stageProgressPercent - a.stageProgressPercent;
      });

      const rankedRacers = updatedRacers.map(r => {
        const rankIdx = sorted.findIndex(s => s.guildId === r.guildId);
        return { ...r, rank: rankIdx + 1 };
      });

      const allFinished = rankedRacers.every(r => r.finished);
      const podium = allFinished ? sorted.slice(0, 3).map((r, i) => ({
        guildId: r.guildId,
        guildName: r.guildName,
        rank: i + 1,
        medal: (i === 0 ? 'GOLD' : i === 1 ? 'SILVER' : 'BRONZE') as 'GOLD' | 'SILVER' | 'BRONZE',
        racerName: r.racerPlayerName
      })) : prev.podium;

      // Determine highest active stage
      const maxStage = Math.max(...rankedRacers.map(r => r.currentStage)) as 1 | 2 | 3;
      const config = STAGE_CONFIGS[maxStage];

      if (allFinished && !prev.isFinished) {
        playCriticalFanfare();
        if (onRecordMatch && sorted[0]) {
          onRecordMatch({
            mode: 'TRIATHLON',
            winnerGuildId: sorted[0].guildId,
            summary: `${sorted[0].racerPlayerName} won the Fields of Torture Triathlon Gold Laurel!`,
            pointsAwarded: 20
          });
        }
      }

      return {
        ...prev,
        currentStage: maxStage,
        stageName: config.name,
        stageSportFocus: config.sportFocus,
        stageTerrainHazard: config.hazard,
        elapsedSeconds: prev.elapsedSeconds + 15,
        racers: rankedRacers,
        eventLogs: [...logs, ...prev.eventLogs],
        isFinished: allFinished,
        podium
      };
    });
  };

  // Reset Triathlon
  const handleReset = () => {
    playUiClick();
    setAutoSimulate(false);
    setTriState(createInitialTriathlonState(guilds, players));
  };

  // Auto-simulate ticker
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (autoSimulate && !triState.isFinished) {
      timer = setInterval(() => {
        handleSimulateSplit();
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoSimulate, triState.isFinished]);

  const StageIcon = STAGE_CONFIGS[triState.currentStage].icon;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 border border-red-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5" />
              Endurance Gauntlet: Fields of Torture
            </span>
            <span className="text-xs text-red-300 font-mono">
              Stage {triState.currentStage} of 3
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-['Rajdhani'] mt-1">
            Multi-Club Iron Triathlon: Swim • Cycle • Run
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Test stamina, power wattage, and tactical pacing across freezing rapids, volcanic velodromes, and magma marathons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-triathlon-auto"
            onClick={() => setAutoSimulate(!autoSimulate)}
            disabled={triState.isFinished}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
              autoSimulate
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {autoSimulate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoSimulate ? 'Pause Race' : 'Auto-Race'}</span>
          </button>

          <button
            id="btn-triathlon-next-split"
            onClick={handleSimulateSplit}
            disabled={triState.isFinished || autoSimulate}
            className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-500/25 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Next KM Split</span>
          </button>

          <button
            id="btn-triathlon-reset"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset Race"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Podium Card if Finished */}
      {triState.isFinished && triState.podium.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-500/60 shadow-2xl">
          <div className="text-center mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500 text-slate-950 inline-block shadow-md">
              👑 Triathlon Laurels Awarded
            </span>
            <h3 className="text-2xl font-black text-white font-['Rajdhani'] uppercase mt-2">
              Fields of Torture Victory Podium
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
            {/* 2nd Place Silver */}
            {triState.podium[1] && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 mt-4">
                <span className="text-2xl block">🥈</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Silver</span>
                <h4 className="text-sm font-black text-white mt-1">{triState.podium[1].guildName}</h4>
                <p className="text-xs text-slate-400">{triState.podium[1].racerName}</p>
              </div>
            )}

            {/* 1st Place Gold */}
            {triState.podium[0] && (
              <div className="p-5 rounded-2xl bg-amber-950/80 border-2 border-amber-400 shadow-xl shadow-amber-500/20 -translate-y-2">
                <span className="text-4xl block">🥇</span>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Gold Champion</span>
                <h4 className="text-base font-black text-white mt-1">{triState.podium[0].guildName}</h4>
                <p className="text-xs text-amber-400 font-medium">{triState.podium[0].racerName}</p>
              </div>
            )}

            {/* 3rd Place Bronze */}
            {triState.podium[2] && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/60 mt-6">
                <span className="text-2xl block">🥉</span>
                <span className="text-xs font-bold text-amber-700 uppercase">Bronze</span>
                <h4 className="text-sm font-black text-white mt-1">{triState.podium[2].guildName}</h4>
                <p className="text-xs text-slate-400">{triState.podium[2].racerName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Stage Hazard Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <StageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {STAGE_CONFIGS[triState.currentStage].name}
            </span>
            <p className="text-xs text-slate-300">{STAGE_CONFIGS[triState.currentStage].sportFocus}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{STAGE_CONFIGS[triState.currentStage].hazard}</span>
        </div>
      </div>

      {/* 3-Stage Course Progression Bars */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Live Triathlon Course Tracker
          </h3>
          <span className="text-xs text-slate-400 font-mono">Course Distance: 51.5 KM Total</span>
        </div>

        {/* 3 Stage Waypoint Labels */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold uppercase tracking-wider">
          <div className={`p-2 rounded-xl border transition ${
            triState.currentStage === 1 ? 'bg-blue-950/60 border-blue-500/50 text-blue-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span>🌊 1. Abyssal Swim (1.5km)</span>
          </div>
          <div className={`p-2 rounded-xl border transition ${
            triState.currentStage === 2 ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span>🚴 2. Hellfire Cycling (40km)</span>
          </div>
          <div className={`p-2 rounded-xl border transition ${
            triState.currentStage === 3 ? 'bg-red-950/60 border-red-500/50 text-red-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span>🏃 3. Magma Marathon (10km)</span>
          </div>
        </div>

        {/* Racers Progression Lanes */}
        <div className="space-y-4">
          {triState.racers.map((racer) => (
            <div
              key={racer.guildId}
              className={`p-4 rounded-xl border bg-slate-950/70 transition-all ${
                racer.rank === 1 ? 'border-amber-500/50 shadow-md shadow-amber-500/5' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    racer.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{racer.rank}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase">{racer.guildName}</span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{racer.racerPlayerName}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-300">{racer.sportLeague}</span>
                    </div>
                  </div>
                </div>

                {/* Stamina Meter & Pace Controls */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
                      <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                      <span>{racer.stamina}% Stamina</span>
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          racer.stamina > 50 ? 'bg-emerald-400' : racer.stamina > 20 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
                        }`}
                        style={{ width: `${racer.stamina}%` }}
                      />
                    </div>
                  </div>

                  {/* Pace Mode Selector for Club */}
                  <div className="flex items-center gap-1">
                    {(['CONSERVATIVE', 'STEADY', 'BREAKAWAY', 'ALL_OUT'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => handleChangePace(racer.guildId, p)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition ${
                          racer.paceMode === p
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                        title={`Set Pace to ${p}`}
                      >
                        {p.slice(0, 4)}
                      </button>
                    ))}
                  </div>

                  {/* Stamina Sponge Boost */}
                  {!racer.specialPerkUsed && (
                    <button
                      onClick={() => handleStaminaBoost(racer.guildId)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition"
                      title="Drink Arcane Hydration Sponge (+35% Stamina)"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sponge</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar with Moving Athlete Pin */}
              <div className="relative w-full h-4 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${((racer.currentStage - 1) * 33.33) + (racer.stageProgressPercent * 0.3333)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Stage {racer.currentStage} Progress: {racer.stageProgressPercent}%</span>
                <span>{racer.finished ? '🏁 FINISHED' : `Pace: ${racer.paceMode}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Event Commentary Log */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Fields of Torture Race Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{triState.eventLogs.length} updates</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {triState.eventLogs.map((log, i) => (
            <div
              key={`tri-log-${i}`}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-medium"
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
