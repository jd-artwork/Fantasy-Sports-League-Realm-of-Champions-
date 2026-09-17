import React, { useState } from 'react';
import { 
  FantasyCampaign, SportsPlayer, GuildMember, LiveGame, AchievementBadge, 
  FriendlyWager, NaggingMessage 
} from '../types';
import { TournamentBracketVisualizer } from './TournamentBracketVisualizer';
import { DualBattleArenaMaster } from './DualBattleArenaMaster';
import { INITIAL_PLAYERS } from '../data/sportsDatabase';
import { 
  Swords, Shield, Dices, Users, Trophy, Sparkles, Flame, 
  ChevronRight, ArrowRight, UserPlus, CheckCircle2, AlertCircle,
  Sun, Snowflake, MapPin, Thermometer, Award, ExternalLink,
  Coins, MessageSquare, Crown, HeartHandshake, Smile, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  campaign: FantasyCampaign;
  liveGames: LiveGame[];
  badges: AchievementBadge[];
  wagers?: FriendlyWager[];
  naggingMessages?: NaggingMessage[];
  onOpenInviteModal: () => void;
  onOpenBadgesModal: () => void;
  onOpenVenueModal: () => void;
  onOpenWagers: () => void;
  onOpenNagging: () => void;
  onOpenWomensPerks: () => void;
  northernSweepActive: boolean;
  onToggleNorthernSweep: () => void;
  onAssignPlayer: (guildId: string, memberId: string, playerId: string) => Promise<void>;
  onRollDice: (matchupId: string, modifierId: string) => Promise<{ d20: number; success: boolean; narrative: string }>;
  onSelectPlayer: (player: SportsPlayer) => void;
  players?: SportsPlayer[];
  onRecordMatch?: (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => void;
}

export const CampaignDashboard: React.FC<Props> = ({
  campaign,
  liveGames,
  badges,
  players = INITIAL_PLAYERS,
  wagers = [],
  naggingMessages = [],
  onOpenInviteModal,
  onOpenBadgesModal,
  onOpenVenueModal,
  onOpenWagers,
  onOpenNagging,
  onOpenWomensPerks,
  northernSweepActive,
  onToggleNorthernSweep,
  onAssignPlayer,
  onRollDice,
  onSelectPlayer,
  onRecordMatch
}) => {
  const userGuild = campaign?.guilds?.[0] || {
    id: 'guild-1',
    name: 'Vanguard of Thunder',
    bannerColor: '#3B82F6',
    crestIcon: 'ShieldAlert',
    budget: 185,
    gutterStatus: 'NORMAL',
    campaignStats: { wins: 3, losses: 0, ties: 0, totalPoints: 532.4, guildXP: 2450, level: 3 },
    members: [],
    roster: []
  } as any;
  const activeMatchup = campaign?.matchups?.find(m => m.status === 'IN_PROGRESS') || campaign?.matchups?.[0];
  const opponentGuild = campaign?.guilds?.find(g => g.id === (activeMatchup?.awayGuildId === userGuild.id ? activeMatchup?.homeGuildId : activeMatchup?.awayGuildId)) || campaign?.guilds?.[1] || userGuild;

  const [rollingDice, setRollingDice] = useState(false);
  const [lastDiceResult, setLastDiceResult] = useState<{ d20: number; success: boolean; narrative: string } | null>(null);
  const [selectedMemberForReassign, setSelectedMemberForReassign] = useState<string>('');
  const [assignSuccessMessage, setAssignSuccessMessage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'bracket' | 'arena'>('bracket');

  const unlockedBadges = badges.filter(b => b.unlocked);
  const totalXP = unlockedBadges.reduce((sum, b) => sum + b.xpReward, 0);

  const handleRollD20 = async () => {
    if (!activeMatchup || !activeMatchup.activeModifier) return;
    setRollingDice(true);
    try {
      const res = await onRollDice(activeMatchup.id, activeMatchup.activeModifier.id);
      setLastDiceResult(res);
      if (res.success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setTimeout(() => setRollingDice(false), 500);
    }
  };

  const handleReassign = async (playerId: string, memberId: string) => {
    await onAssignPlayer(userGuild.id, memberId, playerId);
    const memberName = userGuild.members.find(m => m.id === memberId)?.name || 'Manager';
    setAssignSuccessMessage(`Player re-assigned to ${memberName}'s tactical management!`);
    setTimeout(() => setAssignSuccessMessage(null), 3000);
  };

  // Win probability calculation
  const totalScore = (activeMatchup?.homeScore || 0) + (activeMatchup?.awayScore || 0);
  const userScore = activeMatchup?.homeGuildId === userGuild.id ? activeMatchup?.homeScore : activeMatchup?.awayScore;
  const oppScore = activeMatchup?.homeGuildId === userGuild.id ? activeMatchup?.awayScore : activeMatchup?.homeScore;
  const userWinChance = totalScore > 0 ? Math.round(((userScore || 50) / totalScore) * 100) : 52;

  const isStreetRat = userGuild.gutterStatus === 'STREET_RAT';
  const isHighRoller = userGuild.gutterStatus === 'HIGH_ROLLER';
  const isPerkActive = Boolean(userGuild.womensSportsPerks?.active);

  return (
    <div className="space-y-6">
      {/* 1. Epic Campaign Lore & Weather Modifier Banner */}
      <div id="campaign-banner" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Campaign Week {campaign.currentWeek} of {campaign.totalWeeks}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Guild Level {userGuild.campaignStats.level} ({userGuild.campaignStats.guildXP} XP)
              </span>
              <button
                onClick={onOpenVenueModal}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 transition"
              >
                {northernSweepActive ? <Snowflake className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>September Climate: {northernSweepActive ? 'Northern Frost Anomaly' : '88°F Sunbaked Heartland'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] uppercase tracking-tight text-white flex items-center gap-3">
              <span>{campaign.name}</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {campaign.campaignLore}
            </p>
          </div>

          {/* D20 Campaign Weather Modifier Interactive Card */}
          {activeMatchup?.activeModifier && (
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 sm:w-80 shrink-0 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Dices className="w-4 h-4 text-amber-400" />
                  <span>Realm Modifier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    {northernSweepActive ? '26°F' : `${activeMatchup.activeModifier.temperatureF || 88}°F`}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    DC {activeMatchup.activeModifier.diceRollRequired || 12}
                  </span>
                </div>
              </div>

              <div className="font-semibold text-white text-sm mb-0.5 flex items-center gap-1.5">
                {northernSweepActive ? (
                  <Snowflake className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate">
                  {northernSweepActive
                    ? 'Winter Lizard Frost Surge (Northern Sweep)'
                    : activeMatchup.activeModifier.name}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1.5">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">
                  {northernSweepActive
                    ? 'Rogers Place, Edmonton, AB (Northern Realm)'
                    : (activeMatchup.activeModifier.venueLocation || 'Arrowhead Stadium, Kansas City, MO')}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-2 italic line-clamp-2">
                "{northernSweepActive
                  ? 'The Northern Warriors of Edmonton dominate and sweep the field, shattering September heat with a mythical polar cold front!'
                  : activeMatchup.activeModifier.flavorText}"
              </p>

              <div className="space-y-1 text-xs mb-3">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {northernSweepActive
                      ? '+25% Adamantine Armor & Goalie Saves'
                      : activeMatchup.activeModifier.buffDescription}
                  </span>
                </div>
                <div className="text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {northernSweepActive
                      ? '-15% Deep passing precision in freezing gale'
                      : activeMatchup.activeModifier.debuffDescription}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-roll-d20"
                  onClick={handleRollD20}
                  disabled={rollingDice}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Dices className={`w-3.5 h-3.5 ${rollingDice ? 'animate-spin' : ''}`} />
                  <span>{rollingDice ? 'Rolling...' : 'Roll D20'}</span>
                </button>

                <button
                  id="btn-open-venue-env"
                  onClick={onOpenVenueModal}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] uppercase tracking-wider transition border border-slate-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Venues ({northernSweepActive ? 'Frost' : 'Heat'})</span>
                </button>
              </div>

              {lastDiceResult && (
                <div className={`mt-2.5 p-2 rounded-lg text-xs border ${
                  lastDiceResult.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>Rolled: D20 = {lastDiceResult.d20}</span>
                    <span>{lastDiceResult.success ? 'SUCCESS!' : 'SAVING THROW FAILED'}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-tight text-slate-300">{lastDiceResult.narrative}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Sub-View Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-bracket-visualizer"
            onClick={() => setActiveSubTab('bracket')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              activeSubTab === 'bracket'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 Tournament Bracket (D3 Playoff Gauntlet)</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
              activeSubTab === 'bracket' ? 'bg-slate-950/40 text-slate-950' : 'bg-amber-500/20 text-amber-400'
            }`}>
              D3
            </span>
          </button>

          <button
            id="tab-campaign-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Weekly Arena & Hub</span>
          </button>

          <button
            id="tab-campaign-battle-arena"
            onClick={() => setActiveSubTab('arena')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              activeSubTab === 'arena'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>⚔️ Dual Arena & Deathball</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
              activeSubTab === 'arena' ? 'bg-slate-950/40 text-amber-200' : 'bg-red-500/20 text-red-300'
            }`}>
              Battle
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Playoff Progression Live</span>
        </div>
      </div>

      {/* If Battle Arena Tab is selected, render the Dual Battle Arena Master */}
      {activeSubTab === 'arena' && (
        <div className="space-y-6 animate-fadeIn">
          <DualBattleArenaMaster
            campaign={campaign}
            players={players}
            onRecordMatch={onRecordMatch}
          />
        </div>
      )}

      {/* If Bracket Tab is selected, render the D3 Tournament Bracket prominently */}
      {activeSubTab === 'bracket' && (
        <div className="space-y-6 animate-fadeIn">
          <TournamentBracketVisualizer 
            campaign={campaign}
            onOpenWagers={onOpenWagers}
            onOpenNagging={onOpenNagging}
          />
        </div>
      )}

      {assignSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{assignSuccessMessage}</span>
        </div>
      )}

      {/* Gutter Status & Street Rat Alert Banner */}
      {isStreetRat && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-red-800/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-900/40 border border-red-500/40 flex items-center justify-center text-2xl shrink-0">
              🐀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow">
                  SEWER GUTTER STATUS
                </span>
                <span className="text-xs text-red-300 font-bold">Mercy Beggar</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Plummeted to the Gutter like a Street Rat!
              </h3>
              <p className="text-xs text-slate-300">
                You lost your friendly wager! Beg rival high rollers for cheese crumbs (+10 PTS) or win your next wager to climb out.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNagging}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 flex items-center gap-1.5 transition"
            >
              <span>🐭 Squeak for Mercy</span>
            </button>
            <button
              onClick={onOpenWagers}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <span>🎲 Double or Nothing</span>
            </button>
          </div>
        </div>
      )}

      {isHighRoller && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow">
                  HIGH ROLLER STATUS
                </span>
                <span className="text-xs text-amber-300 font-bold">Soaring at the Top!</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                High Roller Dominance (+15% XP Boost Active)
              </h3>
              <p className="text-xs text-slate-300">
                Your friendly wagers have elevated your syndicate to the royal echelon. Toss cheese crumbs to street rats in nagging chat!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenWagers}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition"
            >
              <span>🎲 Manage Wagers</span>
            </button>
            <button
              onClick={onOpenNagging}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <span>🧀 Toss Mercy Crumbs</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Tri-Hub: Friendly Wagers, Friendly Nagging Smack Talk & Women's Sports Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hub Card 1: Friendly Wagers */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isStreetRat 
                  ? 'bg-red-950/60 text-red-400 border-red-800/40' 
                  : isHighRoller 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {isStreetRat ? '🐀 Street Rat' : isHighRoller ? '👑 High Roller' : '🎲 Contender'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide group-hover:text-amber-400 transition">
              Friendly Wagers
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Wager fantasy points head-to-head. Soar to the top as a High Roller or plummet to the gutter like a street rat!
            </p>

            <div className="mt-3 py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Wagers:</span>
              <span className="font-mono font-bold text-amber-400">
                {wagers.filter(w => w.status === 'ACTIVE').length} Active
              </span>
            </div>
          </div>

          <button
            onClick={onOpenWagers}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Open Wager Board</span>
          </button>
        </div>

        {/* Hub Card 2: Friendly Nagging Smack Talk */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {naggingMessages.length} Messages
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide group-hover:text-indigo-400 transition">
              Friendly Smack Talk
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Drop banter, GIFs, and emojis on rivals. If trapped in the gutter, squeak your mercy pleas for extra cheese crumbs!
            </p>

            <div className="mt-3 py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs truncate text-slate-300 italic">
              "{naggingMessages[naggingMessages.length - 1]?.text || "Let's roll the dice on the 4th quarter!"}"
            </div>
          </div>

          <button
            onClick={onOpenNagging}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Open Banter & GIFs</span>
          </button>
        </div>

        {/* Hub Card 3: Women's Sports Secret Perks */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isPerkActive 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isPerkActive ? '👑 +20% BOOST ACTIVE' : 'Perks Available'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide group-hover:text-purple-400 transition">
              Women's Sports Perks
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Foster any WNBA or NWSL superstar. Earn secret bonus points, a +20% score multiplier, and the Matriarch Shield against wager ruin!
            </p>

            <div className="mt-3 py-2 px-3 rounded-xl bg-slate-950/70 border border-purple-900/40 flex items-center justify-between text-xs">
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Valkyrie Sovereign:
              </span>
              <span className="text-slate-300 font-mono text-[11px]">
                {isPerkActive ? 'Matriarch Shield Active' : 'Foster Clark/Wilson'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenWomensPerks}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Foster Stars & Perks</span>
          </button>
        </div>
      </div>

      {/* 3. Achievement Badges Showcase Section */}
      <div id="achievement-badges-showcase" className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white font-['Rajdhani'] text-lg tracking-wide uppercase">
                  Guild Achievement Badges & Feats
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                  {unlockedBadges.length} / {badges.length} EARNED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Earn badges via points thresholds, multi-sport dominance, and location environmental trials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-amber-400 font-bold px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              +{totalXP} Tactical XP
            </span>
            <button
              id="btn-view-all-badges"
              onClick={onOpenBadgesModal}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold uppercase tracking-wider transition border border-slate-700 flex items-center gap-1.5"
            >
              <span>View All Badges</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Badges preview row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {badges.slice(0, 6).map(badge => (
            <div
              key={badge.id}
              onClick={onOpenBadgesModal}
              className={`p-3 rounded-xl border cursor-pointer transition hover:scale-[1.02] flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                  badge.unlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {badge.tier}
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  +{badge.xpReward}
                </span>
              </div>

              <div className="my-1">
                <div className="font-bold text-xs text-white truncate">{badge.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{badge.subtitle}</div>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className={badge.unlocked ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {badge.unlocked ? '✓ Unlocked' : `${badge.progress}/${badge.maxProgress}`}
                </span>
                {badge.id === 'badge-winter-lizard' && northernSweepActive && (
                  <Snowflake className="w-3 h-3 text-sky-400 animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {assignSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{assignSuccessMessage}</span>
        </div>
      )}

      {/* 2. Weekly Head-to-Head Arena & Live Score Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matchup Arena Box */}
        <div id="matchup-arena" className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white tracking-wide uppercase font-['Rajdhani']">
                Week {campaign.currentWeek} Campaign Matchup
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live Arena Scoring
              </span>
            </div>
          </div>

          {/* Scores Clash Card */}
          <div className="grid grid-cols-5 items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            {/* User Guild */}
            <div className="col-span-2 text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: userGuild.bannerColor }} />
                <span className="font-bold text-white text-base truncate">{userGuild.name}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">YOU</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {userScore?.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Record: {userGuild.campaignStats.wins}-{userGuild.campaignStats.losses} • Level {userGuild.campaignStats.level}
              </div>
            </div>

            {/* VS & Probability */}
            <div className="col-span-1 text-center flex flex-col items-center">
              <span className="font-extrabold font-['Rajdhani'] text-xl text-slate-600">VS</span>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">
                {userWinChance}% Win Prob
              </div>
            </div>

            {/* Opponent Guild */}
            <div className="col-span-2 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="font-bold text-white text-base truncate">{opponentGuild.name}</span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: opponentGuild.bannerColor }} />
              </div>
              <div className="text-3xl font-extrabold text-slate-200 font-mono">
                {oppScore?.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Record: {opponentGuild.campaignStats.wins}-{opponentGuild.campaignStats.losses} • Level {opponentGuild.campaignStats.level}
              </div>
            </div>
          </div>

          {/* Win Probability Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span className="text-amber-400">{userGuild.name} ({userWinChance}%)</span>
              <span className="text-slate-400">{opponentGuild.name} ({100 - userWinChance}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500" style={{ width: `${userWinChance}%` }} />
              <div className="bg-slate-700 transition-all duration-500" style={{ width: `${100 - userWinChance}%` }} />
            </div>
          </div>

          {/* Key Matchup Duels (Star Players on Both Sides) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Matchup Player Battles (Real-Time Points)
            </div>

            <div className="space-y-2">
              {userGuild.roster.slice(0, 4).map((player, idx) => {
                const oppPlayer = opponentGuild.roster[idx];
                const playerPts = player.liveGameStats?.currentPoints || (player.stats.fantasyPointsPerGame * 0.85);
                const oppPts = oppPlayer ? (oppPlayer.liveGameStats?.currentPoints || oppPlayer.stats.fantasyPointsPerGame * 0.8) : 0;

                // Find managing manager for this player
                const manager = userGuild.members.find(m => m.assignedPlayerIds.includes(player.id));

                return (
                  <div key={player.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-4">
                    {/* Your Player */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
                        {player.position}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => onSelectPlayer(player)}
                          className="font-bold text-sm text-white hover:text-amber-400 transition text-left truncate block"
                        >
                          {player.name}
                        </button>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <span className="text-slate-300 font-mono">{player.teamShort} ({player.league})</span>
                          <span>•</span>
                          <span className="text-indigo-400 font-medium">{player.rpgClass}</span>
                          {manager && (
                            <>
                              <span>•</span>
                              <span className="text-amber-300/90 font-medium">Mgr: {manager.name?.split(' ')?.[0] || 'Manager'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scores Comparison */}
                    <div className="flex items-center gap-3 font-mono font-bold text-sm shrink-0">
                      <span className="text-amber-400">{playerPts.toFixed(1)}</span>
                      <span className="text-slate-600 text-xs font-normal">vs</span>
                      <span className="text-slate-300">{oppPts.toFixed(1)}</span>
                    </div>

                    {/* Opponent Player */}
                    {oppPlayer ? (
                      <div className="text-right min-w-0 hidden sm:block">
                        <div className="font-bold text-sm text-slate-300 truncate">{oppPlayer.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{oppPlayer.teamShort} ({oppPlayer.position})</div>
                      </div>
                    ) : (
                      <div className="text-right text-xs text-slate-600 italic">Empty Slot</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Co-Op Team Syndicate Management Box */}
        <div id="syndicate-roster" className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wide font-['Rajdhani']">
                  Syndicate Co-Managers
                </h3>
              </div>
              <button
                id="btn-add-comanager"
                onClick={onOpenInviteModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Multiple people manage designated players on this guild team. Assign player management to distribute tactical responsibilities!
            </p>

            {/* List of Human Co-Managers */}
            <div className="space-y-2.5">
              {userGuild.members.map(member => (
                <div key={member.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${member.avatarColor} text-slate-950 font-bold flex items-center justify-center text-xs`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {member.role === 'GUILD_MASTER' && (
                            <span className="text-[10px] font-bold px-1 rounded bg-amber-500/20 text-amber-400">Leader</span>
                          )}
                        </div>
                        <div className="text-xs text-indigo-400 font-medium">
                          {member.roleTitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400 font-mono">{member.tacticalXP} XP</div>
                      <div className="text-[10px] text-slate-400">{member.prestigeRank}</div>
                    </div>
                  </div>

                  {/* Players under this member's management */}
                  <div className="pt-1.5 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Assigned Players ({member.assignedPlayerIds.length}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.assignedPlayerIds.map(pid => {
                        const player = userGuild.roster.find(p => p.id === pid);
                        if (!player) return null;
                        return (
                          <span
                            key={pid}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            <span className="text-amber-400 font-mono">{player.position}</span>
                            <span>{player.name}</span>
                          </span>
                        );
                      })}
                      {member.assignedPlayerIds.length === 0 && (
                        <span className="text-[11px] text-slate-600 italic">No players assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Player Delegation Control */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wide flex items-center justify-between">
              <span>Delegate Player Command</span>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Transfer in-game player management to another human teammate in your syndicate:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {userGuild.roster.slice(0, 4).map(player => {
                const currentOwner = userGuild.members.find(m => m.assignedPlayerIds.includes(player.id));
                return (
                  <div key={player.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div className="font-bold text-slate-200 truncate">{player.name}</div>
                    <div className="text-[10px] text-slate-400 mb-1.5">Cur: {currentOwner?.name ? currentOwner.name.split(' ')[0] : 'Unassigned'}</div>
                    <select
                      id={`select-manager-${player.id}`}
                      className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                      value={currentOwner?.id || ''}
                      onChange={(e) => handleReassign(player.id, e.target.value)}
                    >
                      {userGuild.members.map(m => (
                        <option key={m.id} value={m.id}>Assign: {m.name}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Playoff Tournament Bracket Section in Overview Flow */}
      {activeSubTab === 'overview' && (
        <TournamentBracketVisualizer 
          campaign={campaign}
          onOpenWagers={onOpenWagers}
          onOpenNagging={onOpenNagging}
        />
      )}

      {/* 3. Season Campaign Standings & Full Roster Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
              {userGuild.name} — Full Multi-Sport Roster
            </h3>
            <p className="text-xs text-slate-400">
              Cross-league superstars powering your campaign across NFL, NBA, EPL, and MLB.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300">
              Cap Space: <span className="text-emerald-400 font-bold">${userGuild.budget}M</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Player</th>
                <th className="pb-3">League</th>
                <th className="pb-3">Position</th>
                <th className="pb-3">Managing Co-Manager</th>
                <th className="pb-3">D&D Class & Synergy</th>
                <th className="pb-3 text-right">Avg Fpts</th>
                <th className="pb-3 text-right pr-2">Live Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {userGuild.roster.map(player => {
                const manager = userGuild.members.find(m => m.assignedPlayerIds.includes(player.id));
                return (
                  <tr key={player.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 pl-2">
                      <button
                        onClick={() => onSelectPlayer(player)}
                        className="font-bold text-slate-100 hover:text-amber-400 transition text-left"
                      >
                        {player.name}
                      </button>
                      <div className="text-[10px] text-slate-400">{player.teamShort} • #{player.jerseyNumber}</div>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-300">{player.league}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-3">
                      {manager ? (
                        <span className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold">
                          <span className={`w-2 h-2 rounded-full ${manager.avatarColor}`} />
                          {manager.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="text-slate-200 font-semibold">{player.rpgClass}</div>
                      <div className="text-[10px] text-slate-400 italic">{player.synergyTrait}</div>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-300">
                      {player.stats.fantasyPointsPerGame.toFixed(1)}
                    </td>
                    <td className="py-3 text-right pr-2 font-mono font-bold text-amber-400 text-sm">
                      {player.liveGameStats?.currentPoints.toFixed(1) || '—'}
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
