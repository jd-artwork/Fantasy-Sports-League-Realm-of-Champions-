import React, { useState } from 'react';
import { AchievementBadge, BadgeCategory, BadgeTier } from '../types';
import { 
  X, Trophy, Sun, Snowflake, Dices, Crown, Users, 
  Award, Zap, Target, Shield, Flame, CheckCircle2, Lock, Sparkles, Filter,
  Coins, MessageSquare, HeartHandshake, Smile
} from 'lucide-react';

interface Props {
  badges: AchievementBadge[];
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementBadgesModal: React.FC<Props> = ({ badges, isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalXP = badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.xpReward, 0);

  const filteredBadges = activeCategory === 'ALL'
    ? badges
    : badges.filter(b => b.category === activeCategory);

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'Snowflake': return <Snowflake className={className} />;
      case 'Dices': return <Dices className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Coins': return <Coins className={className} />;
      case 'Rat': return <span className="text-xl">🐀</span>;
      case 'Smile': return <Smile className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getTierColor = (tier: BadgeTier) => {
    switch (tier) {
      case 'LEGENDARY':
        return {
          border: 'border-amber-400/50',
          bg: 'from-amber-950/40 via-purple-950/30 to-slate-900',
          badge: 'bg-gradient-to-r from-amber-500 to-purple-500 text-slate-950',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/20'
        };
      case 'GOLD':
        return {
          border: 'border-amber-500/40',
          bg: 'from-amber-950/30 to-slate-900',
          badge: 'bg-amber-500 text-slate-950',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/15'
        };
      case 'SILVER':
        return {
          border: 'border-slate-400/40',
          bg: 'from-slate-800/40 to-slate-900',
          badge: 'bg-slate-300 text-slate-950',
          text: 'text-slate-200',
          glow: 'shadow-slate-400/10'
        };
      case 'BRONZE':
      default:
        return {
          border: 'border-amber-700/40',
          bg: 'from-amber-950/20 to-slate-900',
          badge: 'bg-amber-700 text-amber-100',
          text: 'text-amber-600',
          glow: 'shadow-amber-700/10'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Score & Points Achievements
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                +{totalXP} Total Tactical XP
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
              <span>Hall of Champion Feats & Badges</span>
            </h2>
            <p className="text-xs text-slate-400">
              Badges earned through fantasy points, real-world sports milestones, syndicate co-op, and location environmental resilience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right sm:border-r sm:border-slate-800 sm:pr-4">
              <div className="text-2xl font-extrabold font-mono text-amber-400 leading-tight">
                {unlockedCount} / {badges.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Badges Unlocked
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {[
            { id: 'ALL', label: 'All Feats' },
            { id: 'WAGERS', label: 'Wagers & Gutters 🎲' },
            { id: 'WOMENS_SPORTS', label: "Women's Sports Perks 👑" },
            { id: 'SCORING', label: 'Points & Scores' },
            { id: 'ENVIRONMENT', label: 'September Weather' },
            { id: 'TACTICAL', label: 'D&D Tactical Checks' },
            { id: 'SYNDICATE', label: 'Syndicate Co-Op' },
            { id: 'REAL_WORLD', label: 'Real-World Feats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Badges Grid Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredBadges.map(badge => {
              const colors = getTierColor(badge.tier);
              const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-xl border bg-gradient-to-br ${colors.bg} ${colors.border} relative cursor-pointer transition hover:scale-[1.02] shadow-md ${colors.glow} flex flex-col justify-between`}
                >
                  {/* Top row: Tier pill & status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${colors.badge}`}>
                      {badge.tier}
                    </span>
                    <div className="flex items-center gap-1">
                      {badge.unlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Earned</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <Lock className="w-3 h-3" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 my-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-400/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {renderIcon(badge.iconName, 'w-5 h-5')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate leading-tight">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-amber-400/90 font-medium truncate">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 my-2 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Progress Bar & XP */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 mt-auto">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        {badge.unlocked ? 'Complete' : `${badge.progress} / ${badge.maxProgress}`}
                      </span>
                      <span className="text-amber-400 font-bold">+{badge.xpReward} XP</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          badge.unlocked ? 'bg-amber-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {badge.unlockedAt && (
                      <div className="text-[10px] text-emerald-400/90 font-medium truncate pt-0.5">
                        ✓ {badge.unlockedAt}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Badge Detailed Lore Drawer */}
        {selectedBadge && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                {renderIcon(selectedBadge.iconName, 'w-4 h-4')}
              </div>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{selectedBadge.title}</span>
                  <span className="text-[10px] text-amber-400 font-mono">({selectedBadge.tier} • +{selectedBadge.xpReward} XP)</span>
                </div>
                <p className="text-slate-400 italic">
                  "{selectedBadge.dndLore}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
