import React from 'react';
import { 
  Shield, Swords, Dices, Radio, Users, Sparkles, Trophy, Play, Pause, Sun, Snowflake,
  Coins, MessageSquare, Crown, Flame, Volume2, VolumeX, Settings
} from 'lucide-react';

export type ActiveTab = 'campaign' | 'arena' | 'sports' | 'draft' | 'commissioner';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenInviteModal: () => void;
  onOpenBadgesModal: () => void;
  onOpenVenueModal: () => void;
  onOpenWagers: () => void;
  onOpenNagging: () => void;
  onOpenWomensPerks: () => void;
  onOpenClubManager?: () => void;
  isSoundOn?: boolean;
  onToggleSound?: () => void;
  badgesUnlockedCount: number;
  totalBadgesCount: number;
  northernSweepActive: boolean;
  autoTick: boolean;
  setAutoTick: (val: boolean) => void;
  campaignWeek: number;
  gutterStatus?: 'NORMAL' | 'STREET_RAT' | 'HIGH_ROLLER';
  naggingCount?: number;
  womensPerkActive?: boolean;
  userGuildName?: string;
  userGuildCrest?: string;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenInviteModal,
  onOpenBadgesModal,
  onOpenVenueModal,
  onOpenWagers,
  onOpenNagging,
  onOpenWomensPerks,
  onOpenClubManager,
  isSoundOn = true,
  onToggleSound,
  badgesUnlockedCount,
  totalBadgesCount,
  northernSweepActive,
  autoTick,
  setAutoTick,
  campaignWeek,
  gutterStatus = 'NORMAL',
  naggingCount = 0,
  womensPerkActive = false,
  userGuildName = 'Vanguard of Thunder',
  userGuildCrest = '⚡'
}) => {
  return (
    <header className="bg-slate-950/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
              <Shield className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Rajdhani'] uppercase">
                  Realm of Champions
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  WK {campaignWeek}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multi-Sport Fantasy D&D Campaign & Live Stats Tracker
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-campaign"
              onClick={() => setActiveTab('campaign')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'campaign'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span className="hidden md:inline">Campaign & Bracket</span>
              <span className="md:hidden">Campaign</span>
            </button>

            <button
              id="tab-arena"
              onClick={() => setActiveTab('arena')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'arena'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Battle Arena & Deathball</span>
              <span className="md:hidden">Arena</span>
              <span className="hidden lg:inline px-1 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 font-mono">
                PVP
              </span>
            </button>

            <button
              id="tab-sports"
              onClick={() => setActiveTab('sports')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'sports'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Real-World Sports</span>
              <span className="md:hidden">Sports</span>
            </button>

            <button
              id="tab-draft"
              onClick={() => setActiveTab('draft')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'draft'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span className="hidden md:inline">Live Draft</span>
              <span className="md:hidden">Draft</span>
            </button>

            <button
              id="tab-commissioner"
              onClick={() => setActiveTab('commissioner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'commissioner'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Commissioner AI</span>
              <span className="md:hidden">AI DM</span>
            </button>
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Friendly Wagers Trigger */}
            <button
              id="btn-nav-wagers"
              onClick={onOpenWagers}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition shadow-sm ${
                gutterStatus === 'STREET_RAT'
                  ? 'bg-red-950/70 border-red-500/60 text-red-300 animate-pulse'
                  : gutterStatus === 'HIGH_ROLLER'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-1 ring-amber-400/30'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
              title="Stake fantasy points in friendly wagers: soar as a High Roller or plummet like a street rat!"
            >
              {gutterStatus === 'STREET_RAT' ? <span>🐀</span> : gutterStatus === 'HIGH_ROLLER' ? <span>👑</span> : <Coins className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {gutterStatus === 'STREET_RAT' ? 'Street Rat' : gutterStatus === 'HIGH_ROLLER' ? 'High Roller' : 'Wagers'}
              </span>
            </button>

            {/* Friendly Nagging & Smack Talk Trigger */}
            <button
              id="btn-nav-nagging"
              onClick={onOpenNagging}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition shadow-sm relative"
              title="Friendly smack talk with emojis, GIFs & mercy pleas"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Smack Talk</span>
              {naggingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {naggingCount}
                </span>
              )}
            </button>

            {/* Women's Sports Perks Trigger */}
            <button
              id="btn-nav-womens"
              onClick={onOpenWomensPerks}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition shadow-sm ${
                womensPerkActive
                  ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-purple-300'
              }`}
              title="Fostering Women's Sports stars grants secret multipliers and wager protection shields"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Perks</span>
            </button>

            {/* Achievement Badges Trigger */}
            <button
              id="btn-nav-badges"
              onClick={onOpenBadgesModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition shadow-sm"
              title="View your earned achievement badges and tactical feats"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{badgesUnlockedCount}/{totalBadgesCount}</span>
              <span className="hidden lg:inline">Badges</span>
            </button>

            {/* Venue Climate Trigger */}
            <button
              id="btn-nav-venues"
              onClick={onOpenVenueModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                northernSweepActive
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="View venue atmospheric conditions and environmental saving throw DCs"
            >
              {northernSweepActive ? <Snowflake className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden md:inline">
                {northernSweepActive ? 'Frost Anomaly' : 'Venues (88°F)'}
              </span>
            </button>

            {/* Auto Live Game Simulation Toggle */}
            <button
              id="toggle-auto-sim"
              onClick={() => setAutoTick(!autoTick)}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                autoTick
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Automatically simulate live sports events and fantasy scoring ticks"
            >
              {autoTick ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Live Tick {autoTick ? 'Active' : 'Paused'}</span>
            </button>

            {/* Sound FX Toggle */}
            {onToggleSound && (
              <button
                id="btn-nav-sound"
                type="button"
                onClick={onToggleSound}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                  isSoundOn
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={isSoundOn ? 'Audio FX Enabled (Click to Mute)' : 'Audio FX Muted (Click to Unmute)'}
              >
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {/* Invite Co-Managers Button */}
            <button
              id="btn-open-invite"
              onClick={onOpenInviteModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/20"
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Invite Teammates</span>
              <span className="md:hidden">Invite</span>
            </button>

            {/* My Club Manager Button */}
            {onOpenClubManager && (
              <button
                id="btn-nav-my-club"
                type="button"
                onClick={onOpenClubManager}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition group shadow-sm"
                title="Manage your custom club identity, crest, and league backup"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs ring-1 ring-amber-400/40">
                  {userGuildCrest}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-bold text-slate-200 group-hover:text-amber-400 leading-tight transition truncate max-w-[110px]">
                    {userGuildName}
                  </div>
                  <div className="text-[10px] text-amber-400/80 font-mono">My Syndicate</div>
                </div>
                <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
