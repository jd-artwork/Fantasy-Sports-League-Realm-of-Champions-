export type SportLeague = 'NFL' | 'NBA' | 'EPL' | 'MLB' | 'NHL' | 'WNBA' | 'NWSL';

export interface SportsTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  league: SportLeague;
  conferenceOrDivision: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  record: {
    wins: number;
    losses: number;
    tiesOrDraws?: number;
    streak: string;
    rank: number;
  };
  stats: {
    pointsPerGame: number;
    pointsAllowedPerGame: number;
    form: string[]; // e.g. ['W', 'W', 'L', 'W', 'D']
    homeRecord: string;
    awayRecord: string;
  };
  keyPlayers: string[]; // player IDs
  isWomensSports?: boolean;
  secretPerkDescription?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  fantasyPointsPerGame: number;
  totalFantasyPoints: number;
  // Specific stats by sport
  goals?: number;
  assists?: number;
  passingYards?: number;
  passingTouchdowns?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receptions?: number;
  points?: number;
  rebounds?: number;
  steals?: number;
  blocks?: number;
  homeRuns?: number;
  battingAverage?: number;
  strikeouts?: number;
  saves?: number;
}

export interface SportsPlayer {
  id: string;
  name: string;
  teamId: string;
  teamShort: string;
  league: SportLeague;
  position: string;
  secondaryPosition?: string;
  jerseyNumber: number;
  avatarUrl?: string;
  fantasyTier: 1 | 2 | 3 | 4 | 5;
  adp: number; // Average Draft Position
  injuryStatus: 'HEALTHY' | 'QUESTIONABLE' | 'OUT' | 'DAY_TO_DAY';
  stats: PlayerStats;
  liveGameStats?: {
    currentPoints: number;
    summary: string;
    onField: boolean;
  };
  // D&D Campaign Attributes
  rpgClass: 'Warlock Striker' | 'Paladin Defender' | 'Bard Playmaker' | 'Ranger Sniper' | 'Barbarian Enforcer';
  synergyTrait: string;
  isWomensSports?: boolean;
  secretPerkActive?: boolean;
  secretPerkDescription?: string;
  secretBonusPoints?: number;
}

export interface LiveGamePlay {
  id: string;
  time: string;
  quarterOrPeriod: string;
  description: string;
  teamId: string;
  scoringPlay: boolean;
  fantasyPointsImpact?: {
    playerId: string;
    playerName: string;
    points: number;
  };
}

export interface VenueEnvironment {
  stadium: string;
  city: string;
  stateOrCountry: string;
  isIndoors: boolean;
  isNorthernRealm: boolean;
  temperatureF: number;
  weatherCondition: string;
  seasonContext: string;
  environmentalBuff: string;
  environmentalDebuff: string;
  dcSavingThrow: number;
  dndLoreFlavor: string;
  northernSweepActive?: boolean;
}

export interface LiveGame {
  id: string;
  league: SportLeague;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'UPCOMING' | 'LIVE' | 'FINAL';
  clock: string; // e.g., "4th 02:45", "82'", "Top 7th"
  period: string; // "Q4", "2nd Half", "3rd Period"
  venue: string;
  venueEnvironment?: VenueEnvironment;
  startTime: string;
  plays: LiveGamePlay[];
  boxScore: {
    homeTeamStats: Record<string, string | number>;
    awayTeamStats: Record<string, string | number>;
    topPerformers: {
      playerId: string;
      name: string;
      team: string;
      statLine: string;
      fantasyPoints: number;
    }[];
  };
}

// Fantasy Campaign & Syndicate Roster Types
export type ManagerRole = 'GUILD_MASTER' | 'OFFENSE_COORDINATOR' | 'DEFENSE_TACTICIAN' | 'SCOUT_SPECIALIST';

export interface GuildMember {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  role: ManagerRole;
  roleTitle: string;
  assignedPlayerIds: string[]; // Players this human manager actively commands
  tacticalXP: number;
  prestigeRank: string;
}

export interface FantasyGuildTeam {
  id: string;
  name: string;
  bannerColor: string;
  crestIcon: string;
  members: GuildMember[]; // Multiple people on a team
  roster: SportsPlayer[];
  budget: number;
  gutterStatus?: 'HIGH_ROLLER' | 'STREET_RAT' | 'NORMAL';
  streetRatReason?: string;
  beggingPleaCount?: number;
  wagerWinStreak?: number;
  womensSportsPerks?: {
    active: boolean;
    secretMultiplier: number;
    secretBonusPoints: number;
    matriarchShieldAvailable: boolean;
  };
  campaignStats: {
    wins: number;
    losses: number;
    ties: number;
    totalPoints: number;
    guildXP: number;
    level: number;
  };
}

export interface CampaignModifier {
  id: string;
  name: string;
  flavorText: string;
  sportAffected: SportLeague | 'ALL';
  buffDescription: string;
  debuffDescription: string;
  diceRollRequired?: number;
  venueLocation?: string;
  temperatureF?: number;
  isSeptemberHeat?: boolean;
  isNorthernSweep?: boolean;
}

export interface CampaignWeekMatchup {
  id: string;
  weekNumber: number;
  weekTitle: string;
  homeGuildId: string;
  awayGuildId: string;
  homeScore: number;
  awayScore: number;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  activeModifier?: CampaignModifier;
  weatherOrRealmCondition: string;
  venueEnvironment?: VenueEnvironment;
  storyNarrative?: string;
}

// Achievement Badges System
export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'LEGENDARY';
export type BadgeCategory = 'SCORING' | 'STREAK' | 'TACTICAL' | 'ENVIRONMENT' | 'SYNDICATE' | 'REAL_WORLD' | 'WAGERS' | 'WOMENS_SPORTS';

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier: BadgeTier;
  category: BadgeCategory;
  iconName: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  dndLore: string;
}

export interface FantasyCampaign {
  id: string;
  name: string;
  commissionerName: string;
  inviteCode: string;
  seasonYear: string;
  leaguesIncluded: SportLeague[];
  status: 'DRAFTING' | 'ACTIVE_CAMPAIGN' | 'PLAYOFFS' | 'COMPLETED';
  currentWeek: number;
  totalWeeks: number;
  guilds: FantasyGuildTeam[];
  matchups: CampaignWeekMatchup[];
  campaignLore: string;
}

export interface DraftPick {
  round: number;
  pickNumber: number;
  overallPick: number;
  guildId: string;
  guildName: string;
  managerId?: string;
  managerName?: string;
  player: SportsPlayer;
  timestamp: string;
  commissionerGrade?: string;
}

export interface DraftSession {
  campaignId: string;
  totalRounds: number;
  timePerPickSeconds: number;
  currentRound: number;
  currentPickIndex: number;
  isPaused: boolean;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  draftOrder: { guildId: string; guildName: string }[];
  picks: DraftPick[];
}

// Friendly Wagers & Street Rat vs High Roller System
export type WagerType = 
  | 'MATCHUP_DUEL' 
  | 'POINT_THRESHOLD' 
  | 'D20_FEAT' 
  | 'WOMENS_SPORTS_TAKEOVER' 
  | 'OVERLAPPING_SWEEP';

export type WagerStatus = 'ACTIVE' | 'WON' | 'LOST';

export interface FriendlyWager {
  id: string;
  proposingGuildId: string;
  proposingGuildName: string;
  proposingManagerName: string;
  targetGuildId: string;
  targetGuildName: string;
  wagerType: WagerType;
  title: string;
  description: string;
  wagerPoints: number; // Staked points (e.g. 25, 50, 100, 200)
  potentialRewardPoints: number; // Reward points upon victory (soaring to the top!)
  gutterPenaltyDescription: string; // What happens if you plummet to the gutter
  status: WagerStatus;
  createdAt: string;
  resolvedAt?: string;
  outcomeNarrative?: string;
  secretValkyrieShieldApplied?: boolean;
  streetRatTriggered?: boolean;
}

// Friendly Nagging with Emojis & GIFs
export interface NaggingMessage {
  id: string;
  senderGuildId: string;
  senderGuildName: string;
  senderManagerName: string;
  targetGuildId?: string;
  targetGuildName?: string;
  text: string;
  emoji: string;
  gifUrl?: string;
  gifTitle?: string;
  timestamp: string;
  isBeggingForMercy?: boolean;
  mercyGranted?: boolean;
  reactions: { emoji: string; count: number }[];
}

// Tournament Bracket & Playoff Progression Visualizer Types
export interface PlayoffGuildSeed {
  seed: number;
  guildId: string;
  guildName: string;
  bannerColor: string;
  crestIcon: string;
  regularSeasonRecord: string;
  totalPoints: number;
  gutterStatus?: 'HIGH_ROLLER' | 'STREET_RAT' | 'NORMAL';
  starPlayerName?: string;
  synergyBuff?: string;
}

export interface PlayoffMatchupNode {
  id: string;
  round: 1 | 2; // 1 = Semifinals, 2 = Realm Championship Final
  roundTitle: string;
  matchIndex: number;
  homeSeed: PlayoffGuildSeed;
  awaySeed: PlayoffGuildSeed;
  homeScore?: number;
  awayScore?: number;
  winnerGuildId?: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  activeModifierName?: string;
  realmLocation?: string;
  mvpPlayerName?: string;
  mvpPlayerStat?: string;
  narrative?: string;
}

export interface TournamentBracketState {
  currentStage: 'SEMIFINALS' | 'FINALS' | 'CHAMPION_CROWNED';
  semifinals: [PlayoffMatchupNode, PlayoffMatchupNode];
  finals: PlayoffMatchupNode;
  consolation?: PlayoffMatchupNode;
  championGuildId?: string;
  championGuild?: PlayoffGuildSeed;
}

// Year-long Competitive Campaign Tournament Seasons
export type TournamentSeasonId = 'autumn_crucible' | 'winter_siege' | 'spring_awakening' | 'summer_olympiad';

export interface TournamentSeasonBuff {
  sport: SportLeague;
  buffName: string;
  description: string;
  bonusMultiplier: number;
}

export interface TournamentSeason {
  id: TournamentSeasonId;
  name: string;
  codename: string;
  seasonPeriod: string;
  activeSports: SportLeague[];
  themeDescription: string;
  arenaHazard: string;
  sportBuffs: TournamentSeasonBuff[];
  seasonProgressWeeks: number;
  currentWeek: number;
}

// Fighter Abilities for Multi-Sport Combat
export interface FighterAbility {
  id: string;
  name: string;
  sportSource: SportLeague;
  category: 'STRIKE' | 'TACTICAL' | 'DEFENSIVE' | 'ULTIMATE';
  description: string;
  apCost: number;
  cooldownTurns: number;
  currentCooldown: number;
  d20Bonus: number;
  damageRange: [number, number];
  effectSummary: string;
}

// Combat Status Effect
export interface CombatStatusEffect {
  type: 'ON_FIRE' | 'DEFENDING' | 'STUNNED' | 'FAST_BREAK' | 'LOCKED_DOWN' | 'BERSERK' | 'MATRIARCH_SHIELD';
  turnsRemaining: number;
  description: string;
}

// Multi-Sport Club Fighter
export interface ClubFighter {
  id: string;
  playerId: string;
  name: string;
  guildId: string;
  guildName: string;
  league: SportLeague;
  position: string;
  jerseyNumber: number;
  avatarUrl?: string;
  rpgClass: string;
  isWomensSports?: boolean;
  // Combat stats derived from sports stats
  maxHp: number;
  currentHp: number;
  ap: number;
  maxAp: number;
  str: number; // Strength (tackles, home runs, slashes, body checks)
  dex: number; // Agility (dribbles, 3-pointers, steals, fast-breaks)
  con: number; // Constitution (stamina, minutes played, durability)
  iq: number;  // Tactical Vision (assists, field generalship, pitch reads)
  abilities: FighterAbility[];
  statusEffects: CombatStatusEffect[];
  statSummary: string;
}

// Turn-based Combat Log Entry
export interface BattleCombatLogEntry {
  id: string;
  turn: number;
  timestamp: string;
  actorName: string;
  actorGuildName: string;
  targetName?: string;
  actionType: 'ATTACK' | 'DEFEND' | 'ABILITY' | 'DICE_ROLL' | 'KNOCKOUT' | 'SPECIAL';
  d20Roll?: number;
  rollSuccess?: boolean;
  damage?: number;
  narrative: string;
  sportContext: string;
}

// Deathball Battle Royale State
export interface DeathballScore {
  guildId: string;
  guildName: string;
  color: string;
  goals: number; // Soccer
  touchdowns: number; // Football
  homeruns: number; // Baseball
  threePointers: number; // Basketball
  tacklesOrSacks: number; // Defense
  totalPoints: number;
  eliminated: boolean;
  mvpPlay: string;
}

export interface DeathballPlayLog {
  id: string;
  round: number;
  text: string;
  sportType: 'FOOTBALL' | 'BASKETBALL' | 'BASEBALL' | 'SOCCER' | 'HAZARD';
  points: number;
  actorGuildId: string;
  actorGuildName: string;
  actorPlayerName: string;
}

export interface DeathballState {
  round: number;
  maxRounds: number;
  ballCarrierFighterId: string | null;
  ballCarrierGuildId: string | null;
  activeHazard: string;
  scores: Record<string, DeathballScore>;
  playLog: DeathballPlayLog[];
  isGameOver: boolean;
  winningGuildId?: string;
}

// Fields of Torture (Triathlon) State
export interface TriathlonRacerProgress {
  guildId: string;
  guildName: string;
  color: string;
  crest: string;
  racerPlayerName: string;
  sportLeague: SportLeague;
  currentStage: 1 | 2 | 3; // 1 = Swim, 2 = Cycle, 3 = Run
  stageProgressPercent: number; // 0 to 100
  stamina: number; // 0 to 100
  paceMode: 'CONSERVATIVE' | 'STEADY' | 'BREAKAWAY' | 'ALL_OUT';
  hazardsEncountered: string[];
  splitTimeSeconds: number;
  rank: number;
  finished: boolean;
  specialPerkUsed: boolean;
}

export interface TriathlonState {
  currentStage: 1 | 2 | 3;
  stageName: string;
  stageSportFocus: string;
  stageTerrainHazard: string;
  elapsedSeconds: number;
  racers: TriathlonRacerProgress[];
  eventLogs: string[];
  isFinished: boolean;
  podium: Array<{ guildId: string; guildName: string; rank: number; medal: 'GOLD' | 'SILVER' | 'BRONZE'; racerName: string }>;
}

