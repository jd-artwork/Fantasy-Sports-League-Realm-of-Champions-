import { AchievementBadge, FantasyCampaign, LiveGame, SportsPlayer } from '../types';

export const INITIAL_ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-century',
    title: 'Century Colossus',
    subtitle: 'Triple-Digit Domination',
    description: 'Surpass 100+ total fantasy points in an active campaign week matchup.',
    tier: 'GOLD',
    category: 'SCORING',
    iconName: 'Trophy',
    xpReward: 500,
    progress: 114.7,
    maxProgress: 100,
    unlocked: true,
    unlockedAt: 'Week 4 - Siege of Thunder',
    dndLore: 'When the party rolls triple-digit damage upon the colosseum wards, the celestial gates swing open to crown the conquerors.'
  },
  {
    id: 'badge-solar-heat',
    title: 'Solar Scorch Survivor',
    subtitle: 'September Heatwave Endurance',
    description: 'Score 40+ fantasy points in a sweltering 85°F+ late-September venue condition.',
    tier: 'SILVER',
    category: 'ENVIRONMENT',
    iconName: 'Sun',
    xpReward: 350,
    progress: 46.2,
    maxProgress: 40,
    unlocked: true,
    unlockedAt: 'Arrowhead Caldera (88°F)',
    dndLore: 'The blazing September sun tests mortal constitution; only elite tacticians maintain clarity in the scorching furnace.'
  },
  {
    id: 'badge-winter-lizard',
    title: 'Winter Lizard Unleashed',
    subtitle: 'Northern Sweep Frost Anomaly',
    description: 'Trigger a freak sub-zero frost event during hot September when a Northern Realm team (Edmonton) sweeps the field!',
    tier: 'LEGENDARY',
    category: 'ENVIRONMENT',
    iconName: 'Snowflake',
    xpReward: 1000,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'Ancient parchment decrees: No winter lizards walk the hot September sands—unless the Northern Ice Clan dominates and sweeps the field!'
  },
  {
    id: 'badge-natural-20',
    title: 'Natural 20 Tactician',
    subtitle: 'Critical Campaign Boon',
    description: 'Roll a critical Natural 20 on a campaign D20 venue environmental check.',
    tier: 'LEGENDARY',
    category: 'TACTICAL',
    iconName: 'Dices',
    xpReward: 750,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'The 20-sided celestial orb lands squarely on twenty with roaring thunder. All arena wards erupt in radiant golden light.'
  },
  {
    id: 'badge-multi-sport',
    title: 'Multi-Sport Warlord',
    subtitle: 'Cross-League Dominion',
    description: 'Feature active scoring contributors across 3 or more real-world sports leagues in the same week.',
    tier: 'GOLD',
    category: 'SCORING',
    iconName: 'Crown',
    xpReward: 500,
    progress: 4,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: 'NFL • NBA • EPL • MLB',
    dndLore: 'Mastery over the gridiron, the hardwood, the pitch, and the diamond unites the four elemental sporting realms under one standard.'
  },
  {
    id: 'badge-syndicate-harmony',
    title: 'Syndicate Triumvirate',
    subtitle: 'Co-Op Tactical Synergy',
    description: 'Have 3 or more human co-managers actively commanding designated players on your guild roster.',
    tier: 'SILVER',
    category: 'SYNDICATE',
    iconName: 'Users',
    xpReward: 400,
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: '3 Co-Managers Active',
    dndLore: 'No solitary warlord can vanquish the campaign. Divided command and shared trust forge an impenetrable co-op guild.'
  },
  {
    id: 'badge-apex-score',
    title: 'Grandmaster 500 Club',
    subtitle: 'Cumulative Season Prestige',
    description: 'Amass 500+ cumulative campaign fantasy points across the season.',
    tier: 'GOLD',
    category: 'SCORING',
    iconName: 'Award',
    xpReward: 600,
    progress: 532.4,
    maxProgress: 500,
    unlocked: true,
    unlockedAt: 'Season Total: 532.4 pts',
    dndLore: 'A vault overflowing with 500 trophies marks the guild in Arch-Commissioner Vorath’s Grand Ledger of Champions.'
  },
  {
    id: 'badge-clutch-strike',
    title: 'Clutch Hour Hex',
    subtitle: 'Crunch-Time Execution',
    description: 'A roster player scores 15+ fantasy points during 4th quarter or 80th-minute stoppage time.',
    tier: 'BRONZE',
    category: 'SCORING',
    iconName: 'Zap',
    xpReward: 250,
    progress: 14.6,
    maxProgress: 15,
    unlocked: false,
    dndLore: 'When the sands in the hourglass dwindle to minutes, the player’s arcane clutch aura bursts with crackling blue energy.'
  },
  {
    id: 'badge-grand-slam',
    title: 'Celestial Moonshot',
    subtitle: 'Diamond Cataclysm',
    description: 'Shohei Ohtani or Aaron Judge crushes a home run exceeding 440+ feet in a real-world game.',
    tier: 'SILVER',
    category: 'REAL_WORLD',
    iconName: 'Target',
    xpReward: 350,
    progress: 450,
    maxProgress: 440,
    unlocked: true,
    unlockedAt: 'Ohtani 450ft HR',
    dndLore: 'The enchanted orb leaves the diamond with cosmic velocity, shattering through the stratosphere into the pavilion.'
  },
  {
    id: 'badge-clean-sheet',
    title: 'Aegis of the Iron Bulwark',
    subtitle: 'Defensive Fortification',
    description: 'Saliba or Nick Bosa anchors a defensive unit that holds an opponent under 15 NFL pts or to a clean sheet.',
    tier: 'BRONZE',
    category: 'TACTICAL',
    iconName: 'Shield',
    xpReward: 300,
    progress: 8.0,
    maxProgress: 10,
    unlocked: false,
    dndLore: 'Stalwart wardens raise indestructible adamantine shields, repelling every offensive barrage launched by rival invaders.'
  },
  {
    id: 'badge-snipers-nest',
    title: 'Downtown Trebuchet',
    subtitle: 'Perimeter Arcane Sniping',
    description: 'Jayson Tatum or Stephen Curry drains 5+ three-pointers or logs 30+ points in a live matchup.',
    tier: 'BRONZE',
    category: 'REAL_WORLD',
    iconName: 'Flame',
    xpReward: 300,
    progress: 34,
    maxProgress: 30,
    unlocked: true,
    unlockedAt: 'Tatum 34 PTS, 5 3PM',
    dndLore: 'Arrows loosed from beyond the perimeter arc ignite the net, confounding defenders locked in mortal panic.'
  },
  {
    id: 'badge-saving-throw',
    title: 'DC Venue Resilience',
    subtitle: 'Environmental Adaptation',
    description: 'Successfully pass a D20 saving throw against an active stadium environmental modifier.',
    tier: 'BRONZE',
    category: 'TACTICAL',
    iconName: 'Dices',
    xpReward: 250,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'Braving sweltering turf and atmospheric humidity, the squad withstands nature’s trial through iron willpower.'
  },
  {
    id: 'badge-high-roller',
    title: 'High Roller Archmage',
    subtitle: 'Soaring to the Stratosphere',
    description: 'Win a high-stakes point wager of 50+ fantasy points and soar to the celestial pinnacle of the standings!',
    tier: 'LEGENDARY',
    category: 'WAGERS',
    iconName: 'Sparkles',
    xpReward: 1200,
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    dndLore: 'Fortune smiles upon the audacious archmage who lays their kingdom’s treasure on the line and ascends beyond the clouds in radiant glory.'
  },
  {
    id: 'badge-street-rat',
    title: 'Street Rat Begging for Mercy',
    subtitle: 'Plummeted to the Gutter',
    description: 'Lose an audacious point wager and plummet to the sewer gutter, subsisting on stale cheese and begging rivals for mercy!',
    tier: 'BRONZE',
    category: 'WAGERS',
    iconName: 'AlertCircle',
    xpReward: 200,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'Cast out from the gilded citadel into the sodden gutters of the realm, the fallen warlord now squeaks for stale crumbs of rat cheese.'
  },
  {
    id: 'badge-valkyrie-sovereign',
    title: 'Valkyrie Sovereign Ward',
    subtitle: 'Secret Women\'s Sports Boon',
    description: 'Foster a Women\'s Sports superstar (WNBA/NWSL) on your syndicate roster to unlock +20% secret multiplier and +25 bonus secret points!',
    tier: 'LEGENDARY',
    category: 'WOMENS_SPORTS',
    iconName: 'Crown',
    xpReward: 1000,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'Ancient matriarchal spirits crown the guild that champions the fierce warriors of the WNBA and NWSL, shielding them from ruin with the sacred Valkyrie Aegis.'
  },
  {
    id: 'badge-gutter-jester',
    title: 'Gutter Jester Taunter',
    subtitle: 'Friendly Smack Talk Feat',
    description: 'Send friendly nagging taunts, emojis, or reaction GIFs to rival guilds to test their psychological resolve.',
    tier: 'SILVER',
    category: 'SYNDICATE',
    iconName: 'MessageSquare',
    xpReward: 350,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    dndLore: 'A well-timed cheese wheel and sharp-tongued barb cuts deeper than any iron broadsword in the arena of psychological warfare.'
  }
];

export interface BadgeEvaluationContext {
  lastDiceRoll?: number;
  diceSuccess?: boolean;
  northernSweepActive?: boolean;
  lastWagerWon?: boolean;
  lastWagerLost?: boolean;
  lastWagerPoints?: number;
  sentNagMessage?: boolean;
  hasFosteredWomensPlayer?: boolean;
}

export function evaluateBadges(
  badges: AchievementBadge[],
  campaign: FantasyCampaign,
  liveGames: LiveGame[],
  players: SportsPlayer[],
  context?: BadgeEvaluationContext
): { updatedBadges: AchievementBadge[]; newlyUnlocked: AchievementBadge[] } {
  const newlyUnlocked: AchievementBadge[] = [];
  const userGuild = campaign?.guilds?.[0];
  const activeMatchup = campaign?.matchups?.find(m => m.status === 'IN_PROGRESS') || campaign?.matchups?.[0];
  const userScore = activeMatchup ? (activeMatchup.homeGuildId === userGuild?.id ? activeMatchup.homeScore : activeMatchup.awayScore) : 0;
  const totalCumulativePoints = userGuild?.campaignStats?.totalPoints || 0;

  const updatedBadges = badges.map(badge => {
    let currentProgress = badge.progress;
    let shouldUnlock = badge.unlocked;
    let unlockedAtText = badge.unlockedAt;

    switch (badge.id) {
      case 'badge-century':
        currentProgress = userScore;
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = `Scored ${userScore.toFixed(1)} pts in Week ${campaign.currentWeek}`;
        }
        break;

      case 'badge-solar-heat':
        // Check if any game in hot September conditions contributed
        const hotSeptemberPoints = userGuild?.roster
          .filter(p => p.league === 'NFL' || p.league === 'MLB')
          .reduce((acc, p) => acc + (p.liveGameStats?.currentPoints || 0), 0) || 0;
        currentProgress = Math.max(badge.progress, parseFloat(hotSeptemberPoints.toFixed(1)));
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = 'Arrowhead & Chavez Ravine September Sun';
        }
        break;

      case 'badge-winter-lizard':
        if (context?.northernSweepActive) {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Northern Sweep Frost Event (September)';
          }
        }
        break;

      case 'badge-natural-20':
        if (context?.lastDiceRoll === 20) {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Rolled Natural 20 in Week ' + campaign.currentWeek;
          }
        }
        break;

      case 'badge-multi-sport':
        const activeLeagues = new Set(
          (userGuild?.roster || [])
            .filter(p => (p.liveGameStats?.currentPoints || 0) > 0 || p.stats.gamesPlayed > 0)
            .map(p => p.league)
        );
        currentProgress = activeLeagues.size;
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = Array.from(activeLeagues).join(' • ');
        }
        break;

      case 'badge-syndicate-harmony':
        const managerCount = userGuild?.members.filter(m => m.assignedPlayerIds.length > 0).length || 0;
        currentProgress = managerCount;
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = `${managerCount} Co-Managers Delegated`;
        }
        break;

      case 'badge-apex-score':
        currentProgress = totalCumulativePoints;
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = `${totalCumulativePoints.toFixed(1)} Season Points`;
        }
        break;

      case 'badge-clutch-strike':
        // Check highest 4th quarter scorer
        const topLive = userGuild?.roster.reduce((max, p) => Math.max(max, p.liveGameStats?.currentPoints || 0), 0) || 0;
        currentProgress = Math.max(badge.progress, topLive);
        if (!shouldUnlock && currentProgress >= badge.maxProgress) {
          shouldUnlock = true;
          unlockedAtText = `Clutch Live Surge (${topLive.toFixed(1)} pts)`;
        }
        break;

      case 'badge-saving-throw':
        if (context?.lastDiceRoll && context.lastDiceRoll >= 12) {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = `Passed DC Check (Rolled ${context.lastDiceRoll})`;
          }
        }
        break;

      case 'badge-high-roller':
        if (context?.lastWagerWon && (context?.lastWagerPoints || 0) >= 50) {
          currentProgress = Math.max(badge.progress, context.lastWagerPoints || 50);
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = `Won ${context.lastWagerPoints} pt High Roller Wager`;
          }
        } else if (userGuild?.wagerWinStreak && userGuild.wagerWinStreak >= 1) {
          currentProgress = Math.max(badge.progress, 50);
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Won Audacious High-Stakes Wager';
          }
        }
        break;

      case 'badge-street-rat':
        if (context?.lastWagerLost || userGuild?.gutterStatus === 'STREET_RAT') {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Plummeted to the Gutter (Begging for Mercy!)';
          }
        }
        break;

      case 'badge-valkyrie-sovereign':
        const fostersWomen = context?.hasFosteredWomensPlayer || 
          userGuild?.roster.some(p => p.isWomensSports || p.league === 'WNBA' || p.league === 'NWSL') ||
          false;
        if (fostersWomen) {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Fostered Women\'s Sports Phenom (Perks Active!)';
          }
        }
        break;

      case 'badge-gutter-jester':
        if (context?.sentNagMessage) {
          currentProgress = 1;
          if (!shouldUnlock) {
            shouldUnlock = true;
            unlockedAtText = 'Sent Friendly Nagging Banter to Rival Guild';
          }
        }
        break;

      default:
        break;
    }

    if (!badge.unlocked && shouldUnlock) {
      const updatedBadge: AchievementBadge = {
        ...badge,
        progress: currentProgress,
        unlocked: true,
        unlockedAt: unlockedAtText || 'Unlocked in Campaign'
      };
      newlyUnlocked.push(updatedBadge);
      return updatedBadge;
    }

    return {
      ...badge,
      progress: currentProgress,
      unlocked: shouldUnlock,
      unlockedAt: unlockedAtText
    };
  });

  return { updatedBadges, newlyUnlocked };
}
