import React, { useState } from 'react';
import { 
  Swords, Flame, Trophy, Calendar, Sparkles, Footprints, 
  Crown, Shield, Zap, ChevronRight, Activity, Dices
} from 'lucide-react';
import { FantasyCampaign, SportsPlayer, TournamentSeason } from '../types';
import { TOURNAMENT_SEASONS } from '../data/battleArenaDatabase';
import { ClubDuelArena } from './ClubDuelArena';
import { DeathballBattleRoyale } from './DeathballBattleRoyale';
import { FieldsOfTortureTriathlon } from './FieldsOfTortureTriathlon';
import { YearLongTournamentSeasons } from './YearLongTournamentSeasons';
import { playUiClick } from '../utils/audioSynth';

interface Props {
  campaign: FantasyCampaign;
  players: SportsPlayer[];
  initialMode?: 'DUEL' | 'DEATHBALL' | 'TRIATHLON' | 'SEASONS';
  onRecordMatch?: (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => void;
}

export const DualBattleArenaMaster: React.FC<Props> = ({ 
  campaign, 
  players, 
  initialMode = 'DUEL',
  onRecordMatch
}) => {
  const [activeMode, setActiveMode] = useState<'DUEL' | 'DEATHBALL' | 'TRIATHLON' | 'SEASONS'>(initialMode);
  const [activeSeason, setActiveSeason] = useState<TournamentSeason>(TOURNAMENT_SEASONS[0]);

  const guilds = campaign.guilds && campaign.guilds.length > 0 ? campaign.guilds : [
    { id: 'guild-1', name: 'Vanguard of Thunder', bannerColor: '#f59e0b', crestIcon: '⚡' },
    { id: 'guild-2', name: 'Shadow Syndicate FC', bannerColor: '#3b82f6', crestIcon: '🗡️' },
    { id: 'guild-3', name: 'Titanium Kraken', bannerColor: '#10b981', crestIcon: '🦑' },
    { id: 'guild-4', name: 'Frostpeak Valkyries', bannerColor: '#ec4899', crestIcon: '❄️' }
  ];

  const handleSelectMode = (mode: 'DUEL' | 'DEATHBALL' | 'TRIATHLON' | 'SEASONS') => {
    playUiClick();
    setActiveMode(mode);
  };

  return (
    <div className="space-y-6">
      {/* Master Mode Navigation Bar */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            id="tab-mode-duel"
            onClick={() => handleSelectMode('DUEL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition flex-shrink-0 ${
              activeMode === 'DUEL'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>1v1 Club Duel</span>
          </button>

          <button
            id="tab-mode-deathball"
            onClick={() => handleSelectMode('DEATHBALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition flex-shrink-0 ${
              activeMode === 'DEATHBALL'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/25'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Deathball Battle Royale</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-bold">4-TEAM</span>
          </button>

          <button
            id="tab-mode-triathlon"
            onClick={() => handleSelectMode('TRIATHLON')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition flex-shrink-0 ${
              activeMode === 'TRIATHLON'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-purple-300" />
            <span>Fields of Torture</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-400/20 text-purple-300 font-bold">TRIATHLON</span>
          </button>

          <button
            id="tab-mode-seasons"
            onClick={() => handleSelectMode('SEASONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition flex-shrink-0 ${
              activeMode === 'SEASONS'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Year-Long Seasons</span>
          </button>
        </div>

        {/* Active Season Pill Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden lg:inline">Active Sports Season:</span>
          <button
            onClick={() => handleSelectMode('SEASONS')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 hover:bg-amber-500/25 transition text-[11px]"
          >
            <span>🏆 {activeSeason.name}</span>
            <ChevronRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Render Active Battle Component */}
      {activeMode === 'DUEL' && (
        <ClubDuelArena 
          guilds={guilds}
          players={players}
          activeSeason={activeSeason}
          onRecordMatch={onRecordMatch}
        />
      )}

      {activeMode === 'DEATHBALL' && (
        <DeathballBattleRoyale 
          guilds={guilds}
          players={players}
          onRecordMatch={onRecordMatch}
        />
      )}

      {activeMode === 'TRIATHLON' && (
        <FieldsOfTortureTriathlon 
          guilds={guilds}
          players={players}
          onRecordMatch={onRecordMatch}
        />
      )}

      {activeMode === 'SEASONS' && (
        <YearLongTournamentSeasons 
          activeSeason={activeSeason}
          onSelectSeason={(season) => setActiveSeason(season)}
        />
      )}
    </div>
  );
};
