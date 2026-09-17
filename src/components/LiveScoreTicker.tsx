import React, { useState } from 'react';
import { LiveGame } from '../types';
import { Radio, Flame, Trophy, RefreshCw, Zap } from 'lucide-react';
import { playUiClick, playDiceRollSound } from '../utils/audioSynth';

interface Props {
  games: LiveGame[];
  onSelectGame: (game: LiveGame) => void;
  onSimulateTick: () => void;
  onSyncESPN?: () => Promise<void>;
  isSyncingESPN?: boolean;
}

export const LiveScoreTicker: React.FC<Props> = ({ 
  games, 
  onSelectGame, 
  onSimulateTick,
  onSyncESPN,
  isSyncingESPN = false
}) => {
  const [justSynced, setJustSynced] = useState(false);

  const handleManualSync = async () => {
    playUiClick();
    if (onSyncESPN) {
      await onSyncESPN();
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 2000);
    }
  };

  const handleSimulate = () => {
    playDiceRollSound();
    onSimulateTick();
  };

  return (
    <div id="live-score-ticker" className="bg-slate-900 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 overflow-hidden">
        {/* Left Badges & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span className="tracking-wide uppercase font-bold text-[10px]">Real-Time Ticker</span>
          </div>

          {/* Real ESPN Live Sync Button */}
          {onSyncESPN && (
            <button
              id="btn-sync-espn"
              type="button"
              onClick={handleManualSync}
              disabled={isSyncingESPN}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] border transition ${
                isSyncingESPN || justSynced
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Sync live scores, standings, and game clocks directly from real ESPN scoreboards"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingESPN ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isSyncingESPN ? 'Syncing ESPN...' : justSynced ? 'Synced!' : 'Sync ESPN Live'}
              </span>
            </button>
          )}

          <button
            id="simulate-play-btn"
            onClick={handleSimulate}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition font-medium"
            title="Simulate the next real-world sports play and fantasy score update"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Simulate Live Play</span>
          </button>
        </div>

        {/* Scrolling Ticker Cards */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          {games.map(game => {
            const isLive = game.status === 'LIVE';
            return (
              <button
                key={game.id}
                id={`ticker-game-${game.id}`}
                onClick={() => { playUiClick(); onSelectGame(game); }}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition shrink-0 text-left group"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px] text-slate-400">{game.league}</span>
                    {isLive ? (
                      <span className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        {game.clock}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">{game.period}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 font-medium">
                    <span className="text-slate-200 group-hover:text-amber-400 transition">{game.homeTeamId.split('-')[1]?.toUpperCase() || 'HOME'}</span>
                    <span className="font-bold text-white">{game.homeScore}</span>
                    <span className="text-slate-600">-</span>
                    <span className="font-bold text-white">{game.awayScore}</span>
                    <span className="text-slate-200 group-hover:text-amber-400 transition">{game.awayTeamId.split('-')[1]?.toUpperCase() || 'AWAY'}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fantasy Sync Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 shrink-0 font-mono text-[11px]">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Fantasy Sync: <span className="text-emerald-400 font-semibold">Active</span></span>
        </div>
      </div>
    </div>
  );
};
