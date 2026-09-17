import React, { useState } from 'react';
import { FriendlyWager, WagerType, FantasyGuildTeam, AchievementBadge } from '../types';
import { 
  X, Coins, Trophy, Flame, Shield, ArrowUpRight, TrendingDown,
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Dice5,
  Crown, RefreshCw, Send, Users
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wagers?: FriendlyWager[];
  userGuild?: FantasyGuildTeam;
  guilds?: FantasyGuildTeam[];
  rivalGuilds?: FantasyGuildTeam[];
  badges?: AchievementBadge[];
  onProposeWager?: (wagerData: {
    targetGuildId: string;
    wagerType: WagerType;
    title: string;
    description: string;
    wagerPoints: number;
    potentialRewardPoints: number;
    gutterPenaltyDescription: string;
  }) => Promise<void>;
  onCreateWager?: (wagerData: any) => Promise<void>;
  onResolveWager?: (wagerId: string, outcome: 'WON' | 'LOST') => Promise<void>;
  onOpenNagging?: () => void;
  onOpenWomensPerks?: () => void;
}

export const FriendlyWagersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  wagers = [],
  userGuild,
  guilds = [],
  rivalGuilds = [],
  badges = [],
  onProposeWager,
  onCreateWager,
  onResolveWager,
  onOpenNagging,
  onOpenWomensPerks
}) => {
  const allGuilds = guilds.length > 0 ? guilds : rivalGuilds;
  const activeUserGuild = userGuild || allGuilds[0] || {
    id: 'guild-1',
    name: 'Vanguard of Thunder',
    bannerColor: '#3B82F6',
    crestIcon: 'ShieldAlert',
    budget: 185,
    gutterStatus: 'NORMAL',
    campaignStats: { wins: 3, losses: 0, ties: 0, totalPoints: 532.4, guildXP: 2450, level: 3 },
    members: [],
    roster: []
  };

  const [selectedTab, setSelectedTab] = useState<'ACTIVE' | 'PROPOSE' | 'HISTORY'>('ACTIVE');
  const [targetGuildId, setTargetGuildId] = useState<string>(
    allGuilds.find(g => g.id !== activeUserGuild.id)?.id || allGuilds[0]?.id || 'guild-2'
  );
  const [wagerType, setWagerType] = useState<WagerType>('MATCHUP_DUEL');
  const [wagerPoints, setWagerPoints] = useState<number>(50);
  const [title, setTitle] = useState<string>('Clash for Gridiron & Court Supremacy');
  const [customPenalty, setCustomPenalty] = useState<string>('Plummet into the sewer gutter as a Street Rat begging for cheese crumbs!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeWagers = (wagers || []).filter(w => w.status === 'ACTIVE');
  const historyWagers = (wagers || []).filter(w => w.status === 'WON' || w.status === 'LOST');

  const potentialReward = wagerPoints * 2;
  const isStreetRat = activeUserGuild.gutterStatus === 'STREET_RAT';
  const isHighRoller = activeUserGuild.gutterStatus === 'HIGH_ROLLER';
  const hasValkyrieShield = !!activeUserGuild.womensSportsPerks?.matriarchShieldAvailable;

  const wagerBadges = (badges || []).filter(b => b.category === 'WAGERS');

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wagerPoints <= 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        targetGuildId,
        wagerType,
        title,
        description: `${activeUserGuild.name} wagers ${wagerPoints} points on ${wagerType.replace('_', ' ')}!`,
        wagerPoints,
        potentialRewardPoints: potentialReward,
        gutterPenaltyDescription: customPenalty
      };
      if (onProposeWager) {
        await onProposeWager(payload);
      } else if (onCreateWager) {
        await onCreateWager(payload);
      }
      setSelectedTab('ACTIVE');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (wagerId: string, outcome: 'WON' | 'LOST') => {
    setResolvingId(wagerId);
    try {
      if (onResolveWager) {
        await onResolveWager(wagerId, outcome);
      }
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                Audacious Guild Wagers
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Soar or Gutter Rat
              </span>
              {hasValkyrieShield && (
                <span 
                  onClick={onOpenWomensPerks}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 flex items-center gap-1 cursor-pointer hover:bg-rose-500/25 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  Valkyrie Aegis Armed (50% Cushion)
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
              <span>Friendly Wagers & Gutter Stakes</span>
            </h2>
            <p className="text-xs text-slate-400">
              Wager guild fantasy points to soar to the stratosphere or plummet into the sewer gutter like a street rat begging for mercy!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNagging}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>💬 Friendly Banter & GIFs</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guild Gutter vs High-Roller Status Banner */}
        <div className={`px-6 py-3.5 border-b ${
          isStreetRat
            ? 'bg-gradient-to-r from-amber-950/40 via-red-950/30 to-slate-900 border-red-800/40'
            : isHighRoller
            ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-indigo-950/40 border-amber-500/40'
            : 'bg-slate-950/50 border-slate-800'
        } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              isStreetRat
                ? 'bg-red-500/20 border border-red-500/40 shadow-inner'
                : isHighRoller
                ? 'bg-amber-500/20 border border-amber-400/50 shadow-lg shadow-amber-500/20'
                : 'bg-blue-500/20 border border-blue-500/30'
            }`}>
              {isStreetRat ? '🐀' : isHighRoller ? '👑' : '🛡️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Guild Standing:</span>
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                  isStreetRat
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : isHighRoller
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {isStreetRat ? 'Sewer Street Rat (Begging for Mercy)' : isHighRoller ? 'Skyborne High Roller' : 'Respected Contender'}
                </span>
                {userGuild.wagerWinStreak && userGuild.wagerWinStreak > 0 ? (
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Flame className="w-3 h-3" /> {userGuild.wagerWinStreak} Streak
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isStreetRat 
                  ? `${userGuild.streetRatReason || 'Plummeted to the gutter after a catastrophic wager collapse!'} Open smack talk to beg the high rollers for cheese crumbs!`
                  : isHighRoller
                  ? 'Soaring in the celestial stratosphere with boosted morale and high-roller prestige!'
                  : 'Ready to throw down high-stakes wagers against rival syndicates.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {isStreetRat && (
              <button
                onClick={onOpenNagging}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-900/30 transition animate-pulse"
              >
                <span>🐭 Beg for Mercy & Cheese</span>
              </button>
            )}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Guild Points</span>
              <span className="text-lg font-black font-mono text-amber-400">{userGuild.campaignStats.totalPoints.toFixed(1)} PTS</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTab('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedTab === 'ACTIVE'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Active Wagers ({activeWagers.length})
            </button>

            <button
              onClick={() => setSelectedTab('PROPOSE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedTab === 'PROPOSE'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dice5 className="w-3.5 h-3.5" />
              Propose New Wager
            </button>

            <button
              onClick={() => setSelectedTab('HISTORY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedTab === 'HISTORY'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Wager History ({historyWagers.length})
            </button>
          </div>

          {/* Badges Preview */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">Wager Badges:</span>
            {wagerBadges.map(b => (
              <span
                key={b.id}
                title={`${b.name}: ${b.description}`}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                  b.unlocked 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/40 text-slate-500 border-slate-700/40'
                }`}
              >
                {b.id === 'badge-high-roller' ? '👑' : b.id === 'badge-street-rat' ? '🐀' : '🃏'}
                {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: ACTIVE WAGERS */}
          {selectedTab === 'ACTIVE' && (
            <div className="space-y-4">
              {activeWagers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
                  <Coins className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-300">No Active Wagers Right Now</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Stake your fantasy points against rival guilds to soar to the high-roller stratosphere or risk gutter ruin!
                  </p>
                  <button
                    onClick={() => setSelectedTab('PROPOSE')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    Propose First Wager
                  </button>
                </div>
              ) : (
                activeWagers.map(wager => {
                  const isProposer = wager.proposingGuildId === userGuild.id;
                  const isTarget = wager.targetGuildId === userGuild.id;

                  return (
                    <div 
                      key={wager.id} 
                      className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden"
                    >
                      {/* Top ribbon */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {wager.wagerType.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">
                            Proposed by <strong className="text-slate-200">{wager.proposingGuildName}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                            Staked: {wager.wagerPoints} PTS → Win: +{wager.potentialRewardPoints} PTS
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white font-['Rajdhani'] tracking-wide">
                        {wager.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {wager.description}
                      </p>

                      {/* Gutter penalty warning */}
                      <div className="mt-3 p-3 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start gap-2.5">
                        <span className="text-lg shrink-0">🐀</span>
                        <div>
                          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide block">
                            Gutter Street Rat Penalty:
                          </span>
                          <p className="text-xs text-slate-400">
                            {wager.gutterPenaltyDescription}
                          </p>
                        </div>
                      </div>

                      {/* Simulation / Resolution Controls */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>Target: <strong className="text-slate-300">{wager.targetGuildName}</strong></span>
                          <span>•</span>
                          <span>Created {new Date(wager.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Simulate Resolution:</span>
                          <button
                            disabled={resolvingId === wager.id}
                            onClick={() => handleResolve(wager.id, 'WON')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow transition disabled:opacity-50"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>Soar to Victory (+{wager.potentialRewardPoints} PTS)</span>
                          </button>

                          <button
                            disabled={resolvingId === wager.id}
                            onClick={() => handleResolve(wager.id, 'LOST')}
                            className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow transition disabled:opacity-50"
                          >
                            <span>🐀 Plummet to Gutter (-{wager.wagerPoints} PTS)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PROPOSE NEW WAGER */}
          {selectedTab === 'PROPOSE' && (
            <form onSubmit={handlePropose} className="space-y-5 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>High-Stakes Guild Rules:</strong> Winning wagers awards 2x the staked fantasy points and elevates the winning guild to <strong>High Roller</strong> status with special badges. The loser plummets directly to the <strong>Sewer Gutter as a Street Rat</strong>, losing staked points and begging for mercy in the guild square!
                </div>
              </div>

              {/* Target Guild */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Target Rival Guild to Challenge
                </label>
                <select
                  value={targetGuildId}
                  onChange={e => setTargetGuildId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  {guilds.filter(g => g.id !== userGuild.id).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Current: {g.campaignStats.totalPoints.toFixed(1)} PTS - {g.gutterStatus})
                    </option>
                  ))}
                </select>
              </div>

              {/* Wager Type */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Wager Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'MATCHUP_DUEL', label: 'Matchup Duel', desc: 'Direct head-to-head point victory' },
                    { id: 'POINT_THRESHOLD', label: 'Point Threshold', desc: 'Combined player score targets across sports' },
                    { id: 'D20_FEAT', label: 'D20 Feat Challenge', desc: 'Roll DC15+ saving throw during game events' },
                    { id: 'WOMENS_SPORTS_TAKEOVER', label: 'Valkyrie Takeover 👑', desc: 'WNBA/NWSL star outscores opponent' }
                  ].map(type => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setWagerType(type.id as WagerType)}
                      className={`p-3 rounded-xl border text-left transition ${
                        wagerType === type.id
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">{type.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Staked Points */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-300">
                    Staked Fantasy Points
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Potential Reward: +{potentialReward} PTS
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[25, 50, 75, 100].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setWagerPoints(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        wagerPoints === amt
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {amt} PTS
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={5}
                  value={wagerPoints}
                  onChange={e => setWagerPoints(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Wager Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Wager Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. The Overlapping Cross-Sport Century Clash"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Gutter Penalty Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-red-300 mb-1.5 flex items-center gap-1.5">
                  <span>🐀 Custom Gutter Penalty Description</span>
                </label>
                <textarea
                  rows={2}
                  value={customPenalty}
                  onChange={e => setCustomPenalty(e.target.value)}
                  placeholder="e.g. Loser must beg for mercy in the guild chat wearing a rat emoji for 48 hours!"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase text-sm tracking-wider shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Wager...' : `Stake ${wagerPoints} PTS & Throw Down Wager`}
              </button>
            </form>
          )}

          {/* TAB 3: WAGER HISTORY */}
          {selectedTab === 'HISTORY' && (
            <div className="space-y-4">
              {historyWagers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
                  <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-300">No Completed Wagers Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Resolve an active wager to see its glory or gutter outcome recorded in the campaign chronicles.
                  </p>
                </div>
              ) : (
                historyWagers.map(wager => {
                  const isWon = wager.status === 'WON';
                  return (
                    <div 
                      key={wager.id}
                      className={`p-5 rounded-2xl border ${
                        isWon
                          ? 'bg-emerald-950/15 border-emerald-800/40'
                          : 'bg-red-950/15 border-red-800/40'
                      } relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isWon 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                          {isWon ? '👑 HIGH ROLLER VICTORY' : '🐀 GUTTER STREET RAT DEFEAT'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {isWon ? `+${wager.potentialRewardPoints} PTS Won` : `-${wager.wagerPoints} PTS Lost`}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white font-['Rajdhani']">
                        {wager.title}
                      </h4>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {wager.outcomeNarrative || wager.description}
                      </p>

                      {wager.secretValkyrieShieldApplied && (
                        <div className="mt-2 text-[11px] font-bold text-rose-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Valkyrie Aegis softened point loss by 50%!</span>
                        </div>
                      )}

                      <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>{wager.proposingGuildName} vs {wager.targetGuildName}</span>
                        <span>Resolved {wager.resolvedAt ? new Date(wager.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
