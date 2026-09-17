import { SportsTeam, SportsPlayer, LiveGame, FantasyCampaign, CampaignModifier, FriendlyWager, NaggingMessage } from '../types';

export const INITIAL_TEAMS: SportsTeam[] = [
  // NFL
  {
    id: 'nfl-kc',
    name: 'Kansas City Chiefs',
    shortName: 'KC',
    city: 'Kansas City',
    league: 'NFL',
    conferenceOrDivision: 'AFC West',
    colors: { primary: '#E31837', secondary: '#FFB81C' },
    record: { wins: 14, losses: 3, streak: 'W5', rank: 1 },
    stats: { pointsPerGame: 26.8, pointsAllowedPerGame: 18.2, form: ['W', 'W', 'W', 'W', 'W'], homeRecord: '8-1', awayRecord: '6-2' },
    keyPlayers: ['nfl-p-1', 'nfl-p-2']
  },
  {
    id: 'nfl-sf',
    name: 'San Francisco 49ers',
    shortName: 'SF',
    city: 'San Francisco',
    league: 'NFL',
    conferenceOrDivision: 'NFC West',
    colors: { primary: '#AA0000', secondary: '#B3995D' },
    record: { wins: 13, losses: 4, streak: 'W3', rank: 2 },
    stats: { pointsPerGame: 28.1, pointsAllowedPerGame: 19.4, form: ['W', 'W', 'L', 'W', 'W'], homeRecord: '7-2', awayRecord: '6-2' },
    keyPlayers: ['nfl-p-3', 'nfl-p-4']
  },
  {
    id: 'nfl-bal',
    name: 'Baltimore Ravens',
    shortName: 'BAL',
    city: 'Baltimore',
    league: 'NFL',
    conferenceOrDivision: 'AFC North',
    colors: { primary: '#241773', secondary: '#9E7C0C' },
    record: { wins: 12, losses: 5, streak: 'W2', rank: 3 },
    stats: { pointsPerGame: 27.4, pointsAllowedPerGame: 20.1, form: ['L', 'W', 'W', 'L', 'W'], homeRecord: '6-3', awayRecord: '6-2' },
    keyPlayers: ['nfl-p-5']
  },
  {
    id: 'nfl-det',
    name: 'Detroit Lions',
    shortName: 'DET',
    city: 'Detroit',
    league: 'NFL',
    conferenceOrDivision: 'NFC North',
    colors: { primary: '#0076B6', secondary: '#B0B7BC' },
    record: { wins: 13, losses: 4, streak: 'W4', rank: 4 },
    stats: { pointsPerGame: 29.2, pointsAllowedPerGame: 22.0, form: ['W', 'W', 'W', 'W', 'L'], homeRecord: '8-1', awayRecord: '5-3' },
    keyPlayers: ['nfl-p-6']
  },

  // NBA
  {
    id: 'nba-bos',
    name: 'Boston Celtics',
    shortName: 'BOS',
    city: 'Boston',
    league: 'NBA',
    conferenceOrDivision: 'Eastern Conference',
    colors: { primary: '#007A33', secondary: '#BA9653' },
    record: { wins: 48, losses: 14, streak: 'W7', rank: 1 },
    stats: { pointsPerGame: 120.4, pointsAllowedPerGame: 109.1, form: ['W', 'W', 'W', 'W', 'W'], homeRecord: '28-3', awayRecord: '20-11' },
    keyPlayers: ['nba-p-1', 'nba-p-2']
  },
  {
    id: 'nba-gsw',
    name: 'Golden State Warriors',
    shortName: 'GSW',
    city: 'San Francisco',
    league: 'NBA',
    conferenceOrDivision: 'Western Conference',
    colors: { primary: '#1D428A', secondary: '#FFC72C' },
    record: { wins: 40, losses: 23, streak: 'W2', rank: 4 },
    stats: { pointsPerGame: 117.8, pointsAllowedPerGame: 114.5, form: ['W', 'L', 'W', 'W', 'L'], homeRecord: '22-10', awayRecord: '18-13' },
    keyPlayers: ['nba-p-3']
  },
  {
    id: 'nba-den',
    name: 'Denver Nuggets',
    shortName: 'DEN',
    city: 'Denver',
    league: 'NBA',
    conferenceOrDivision: 'Western Conference',
    colors: { primary: '#0E2240', secondary: '#FEC524' },
    record: { wins: 46, losses: 18, streak: 'W4', rank: 2 },
    stats: { pointsPerGame: 118.2, pointsAllowedPerGame: 110.8, form: ['W', 'W', 'W', 'L', 'W'], homeRecord: '26-6', awayRecord: '20-12' },
    keyPlayers: ['nba-p-4']
  },
  {
    id: 'nba-lal',
    name: 'Los Angeles Lakers',
    shortName: 'LAL',
    city: 'Los Angeles',
    league: 'NBA',
    conferenceOrDivision: 'Western Conference',
    colors: { primary: '#552583', secondary: '#FDB927' },
    record: { wins: 41, losses: 22, streak: 'W3', rank: 3 },
    stats: { pointsPerGame: 116.5, pointsAllowedPerGame: 113.2, form: ['W', 'W', 'W', 'L', 'W'], homeRecord: '23-9', awayRecord: '18-13' },
    keyPlayers: ['nba-p-5']
  },

  // EPL / Soccer
  {
    id: 'epl-ars',
    name: 'Arsenal FC',
    shortName: 'ARS',
    city: 'London',
    league: 'EPL',
    conferenceOrDivision: 'Premier League',
    colors: { primary: '#EF0107', secondary: '#FFFFFF' },
    record: { wins: 22, losses: 4, tiesOrDraws: 5, streak: 'W3', rank: 1 },
    stats: { pointsPerGame: 2.3, pointsAllowedPerGame: 0.7, form: ['W', 'W', 'W', 'D', 'W'], homeRecord: '12-2-1', awayRecord: '10-2-4' },
    keyPlayers: ['epl-p-1', 'epl-p-2']
  },
  {
    id: 'epl-mci',
    name: 'Manchester City',
    shortName: 'MCI',
    city: 'Manchester',
    league: 'EPL',
    conferenceOrDivision: 'Premier League',
    colors: { primary: '#6CABDD', secondary: '#1C2C5B' },
    record: { wins: 21, losses: 5, tiesOrDraws: 5, streak: 'W2', rank: 2 },
    stats: { pointsPerGame: 2.2, pointsAllowedPerGame: 0.9, form: ['W', 'W', 'L', 'W', 'D'], homeRecord: '13-1-2', awayRecord: '8-4-3' },
    keyPlayers: ['epl-p-3', 'epl-p-4']
  },
  {
    id: 'epl-liv',
    name: 'Liverpool FC',
    shortName: 'LIV',
    city: 'Liverpool',
    league: 'EPL',
    conferenceOrDivision: 'Premier League',
    colors: { primary: '#C8102E', secondary: '#F6EB61' },
    record: { wins: 20, losses: 6, tiesOrDraws: 5, streak: 'W1', rank: 3 },
    stats: { pointsPerGame: 2.1, pointsAllowedPerGame: 1.0, form: ['W', 'L', 'W', 'D', 'W'], homeRecord: '12-3-1', awayRecord: '8-3-4' },
    keyPlayers: ['epl-p-5']
  },

  // MLB
  {
    id: 'mlb-lad',
    name: 'Los Angeles Dodgers',
    shortName: 'LAD',
    city: 'Los Angeles',
    league: 'MLB',
    conferenceOrDivision: 'NL West',
    colors: { primary: '#005A9C', secondary: '#A5ACAF' },
    record: { wins: 98, losses: 64, streak: 'W5', rank: 1 },
    stats: { pointsPerGame: 5.4, pointsAllowedPerGame: 3.8, form: ['W', 'W', 'W', 'W', 'W'], homeRecord: '52-29', awayRecord: '46-35' },
    keyPlayers: ['mlb-p-1', 'mlb-p-2']
  },
  {
    id: 'mlb-nyy',
    name: 'New York Yankees',
    shortName: 'NYY',
    city: 'New York',
    league: 'MLB',
    conferenceOrDivision: 'AL East',
    colors: { primary: '#0C2340', secondary: '#FFFFFF' },
    record: { wins: 94, losses: 68, streak: 'W2', rank: 2 },
    stats: { pointsPerGame: 5.1, pointsAllowedPerGame: 4.1, form: ['W', 'W', 'L', 'W', 'L'], homeRecord: '48-33', awayRecord: '46-35' },
    keyPlayers: ['mlb-p-3']
  },

  // NHL
  {
    id: 'nhl-edm',
    name: 'Edmonton Oilers',
    shortName: 'EDM',
    city: 'Edmonton',
    league: 'NHL',
    conferenceOrDivision: 'Pacific Division',
    colors: { primary: '#041E42', secondary: '#FF4C00' },
    record: { wins: 45, losses: 23, tiesOrDraws: 5, streak: 'W3', rank: 1 },
    stats: { pointsPerGame: 3.7, pointsAllowedPerGame: 2.8, form: ['W', 'W', 'W', 'L', 'W'], homeRecord: '24-10-3', awayRecord: '21-13-2' },
    keyPlayers: ['nhl-p-1']
  },

  // WNBA
  {
    id: 'wnba-ind',
    name: 'Indiana Fever',
    shortName: 'IND',
    city: 'Indianapolis',
    league: 'WNBA',
    conferenceOrDivision: 'Eastern Conference',
    colors: { primary: '#002D62', secondary: '#FFC72C' },
    record: { wins: 22, losses: 18, streak: 'W4', rank: 3 },
    stats: { pointsPerGame: 85.0, pointsAllowedPerGame: 82.3, form: ['W', 'W', 'W', 'W', 'L'], homeRecord: '13-7', awayRecord: '9-11' },
    keyPlayers: ['wnba-p-1', 'wnba-p-2'],
    isWomensSports: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% fantasy points multiplier & +25 bonus secret points'
  },
  {
    id: 'wnba-lva',
    name: 'Las Vegas Aces',
    shortName: 'LVA',
    city: 'Las Vegas',
    league: 'WNBA',
    conferenceOrDivision: 'Western Conference',
    colors: { primary: '#000000', secondary: '#C4CED4' },
    record: { wins: 27, losses: 13, streak: 'W5', rank: 1 },
    stats: { pointsPerGame: 86.4, pointsAllowedPerGame: 81.5, form: ['W', 'W', 'W', 'W', 'W'], homeRecord: '15-5', awayRecord: '12-8' },
    keyPlayers: ['wnba-p-3'],
    isWomensSports: true,
    secretPerkDescription: '👑 Sovereign Dynasty: +20% fantasy points multiplier & Matriarch Shield'
  },
  {
    id: 'wnba-nyl',
    name: 'New York Liberty',
    shortName: 'NYL',
    city: 'New York',
    league: 'WNBA',
    conferenceOrDivision: 'Eastern Conference',
    colors: { primary: '#86CEBC', secondary: '#000000' },
    record: { wins: 32, losses: 8, streak: 'W3', rank: 1 },
    stats: { pointsPerGame: 85.6, pointsAllowedPerGame: 76.5, form: ['W', 'W', 'W', 'L', 'W'], homeRecord: '16-4', awayRecord: '16-4' },
    keyPlayers: ['wnba-p-4'],
    isWomensSports: true,
    secretPerkDescription: '👑 Seafoam Sanctum: Triple-rain perk & +25 bonus points'
  },

  // NWSL
  {
    id: 'nwsl-por',
    name: 'Portland Thorns FC',
    shortName: 'POR',
    city: 'Portland',
    league: 'NWSL',
    conferenceOrDivision: 'National Women Soccer League',
    colors: { primary: '#93282C', secondary: '#000000' },
    record: { wins: 14, losses: 5, tiesOrDraws: 4, streak: 'W3', rank: 2 },
    stats: { pointsPerGame: 2.1, pointsAllowedPerGame: 1.1, form: ['W', 'W', 'W', 'D', 'W'], homeRecord: '8-2-1', awayRecord: '6-3-3' },
    keyPlayers: ['nwsl-p-1'],
    isWomensSports: true,
    secretPerkDescription: '👑 Rose City Ward: Golden boot breakaways yield 2.5x clutch value'
  },
  {
    id: 'nwsl-was',
    name: 'Washington Spirit',
    shortName: 'WAS',
    city: 'Washington D.C.',
    league: 'NWSL',
    conferenceOrDivision: 'National Women Soccer League',
    colors: { primary: '#0A2240', secondary: '#E31837' },
    record: { wins: 15, losses: 6, tiesOrDraws: 2, streak: 'W4', rank: 1 },
    stats: { pointsPerGame: 2.3, pointsAllowedPerGame: 1.0, form: ['W', 'W', 'W', 'W', 'L'], homeRecord: '9-2-0', awayRecord: '6-4-2' },
    keyPlayers: ['nwsl-p-2'],
    isWomensSports: true,
    secretPerkDescription: '👑 Sonic Spirit Ward: High press assists confer +20% bonus points'
  }
];

export const INITIAL_PLAYERS: SportsPlayer[] = [
  // NFL
  {
    id: 'nfl-p-1',
    name: 'Patrick Mahomes',
    teamId: 'nfl-kc',
    teamShort: 'KC',
    league: 'NFL',
    position: 'QB',
    jerseyNumber: 15,
    fantasyTier: 1,
    adp: 1.2,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Bard Playmaker',
    synergyTrait: 'Arcane Clutch Aura (+20% crunch-time TD bonus)',
    stats: {
      gamesPlayed: 17,
      fantasyPointsPerGame: 23.4,
      totalFantasyPoints: 397.8,
      passingYards: 4620,
      passingTouchdowns: 36,
      rushingYards: 390,
      rushingTouchdowns: 3
    },
    liveGameStats: {
      currentPoints: 21.8,
      summary: '280 Pass Yds, 2 TD, 1 INT, 32 Rush Yds',
      onField: true
    }
  },
  {
    id: 'nfl-p-2',
    name: 'Travis Kelce',
    teamId: 'nfl-kc',
    teamShort: 'KC',
    league: 'NFL',
    position: 'TE',
    jerseyNumber: 87,
    fantasyTier: 1,
    adp: 2.1,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Barbarian Enforcer',
    synergyTrait: 'Red Zone Juggernaut (+15% points inside 20)',
    stats: {
      gamesPlayed: 16,
      fantasyPointsPerGame: 15.8,
      totalFantasyPoints: 252.8,
      receptions: 93,
      rushingYards: 984,
      rushingTouchdowns: 8
    },
    liveGameStats: {
      currentPoints: 14.6,
      summary: '6 rec, 76 yds, 1 TD',
      onField: true
    }
  },
  {
    id: 'nfl-p-3',
    name: 'Christian McCaffrey',
    teamId: 'nfl-sf',
    teamShort: 'SF',
    league: 'NFL',
    position: 'RB',
    jerseyNumber: 23,
    fantasyTier: 1,
    adp: 1.1,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Dual Threat Stealth (Double agility yards)',
    stats: {
      gamesPlayed: 16,
      fantasyPointsPerGame: 25.2,
      totalFantasyPoints: 403.2,
      rushingYards: 1459,
      rushingTouchdowns: 14,
      receptions: 67
    },
    liveGameStats: {
      currentPoints: 19.4,
      summary: '112 rush yds, 4 rec, 34 rec yds, 1 TD',
      onField: true
    }
  },
  {
    id: 'nfl-p-4',
    name: 'Nick Bosa',
    teamId: 'nfl-sf',
    teamShort: 'SF',
    league: 'NFL',
    position: 'DE/DEF',
    jerseyNumber: 97,
    fantasyTier: 2,
    adp: 4.5,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Paladin Defender',
    synergyTrait: 'Fortress Aegis (-3 opp QB rating per sack)',
    stats: {
      gamesPlayed: 17,
      fantasyPointsPerGame: 10.4,
      totalFantasyPoints: 176.8,
      blocks: 15
    },
    liveGameStats: {
      currentPoints: 9.0,
      summary: '1.5 sacks, 4 QB hits, 5 solo tackles',
      onField: true
    }
  },
  {
    id: 'nfl-p-5',
    name: 'Lamar Jackson',
    teamId: 'nfl-bal',
    teamShort: 'BAL',
    league: 'NFL',
    position: 'QB',
    jerseyNumber: 8,
    fantasyTier: 1,
    adp: 1.8,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Warlock Striker',
    synergyTrait: 'Chaos Dash (Unstoppable scramble multiplier)',
    stats: {
      gamesPlayed: 16,
      fantasyPointsPerGame: 24.1,
      totalFantasyPoints: 385.6,
      passingYards: 3678,
      passingTouchdowns: 24,
      rushingYards: 821,
      rushingTouchdowns: 6
    },
    liveGameStats: {
      currentPoints: 26.3,
      summary: '215 Pass Yds, 2 TD, 88 Rush Yds, 1 Rush TD',
      onField: false
    }
  },
  {
    id: 'nfl-p-6',
    name: 'Amon-Ra St. Brown',
    teamId: 'nfl-det',
    teamShort: 'DET',
    league: 'NFL',
    position: 'WR',
    jerseyNumber: 14,
    fantasyTier: 1,
    adp: 2.4,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Sun God Focus (0 dropped targets in 4th)',
    stats: {
      gamesPlayed: 17,
      fantasyPointsPerGame: 19.8,
      totalFantasyPoints: 336.6,
      receptions: 119,
      rushingYards: 1515,
      rushingTouchdowns: 10
    }
  },

  // NBA
  {
    id: 'nba-p-1',
    name: 'Jayson Tatum',
    teamId: 'nba-bos',
    teamShort: 'BOS',
    league: 'NBA',
    position: 'SF/PF',
    jerseyNumber: 0,
    fantasyTier: 1,
    adp: 1.5,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Warlock Striker',
    synergyTrait: 'Step-Back Mystic (+30% clutch triple accuracy)',
    stats: {
      gamesPlayed: 60,
      fantasyPointsPerGame: 47.8,
      totalFantasyPoints: 2868,
      points: 27.1,
      rebounds: 8.6,
      assists: 4.9,
      steals: 1.1
    },
    liveGameStats: {
      currentPoints: 44.2,
      summary: '31 PTS, 9 REB, 6 AST, 2 STL',
      onField: true
    }
  },
  {
    id: 'nba-p-2',
    name: 'Jaylen Brown',
    teamId: 'nba-bos',
    teamShort: 'BOS',
    league: 'NBA',
    position: 'SG/SF',
    jerseyNumber: 7,
    fantasyTier: 2,
    adp: 3.2,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Barbarian Enforcer',
    synergyTrait: 'Rim Cleaver (Guaranteed dunk momentum)',
    stats: {
      gamesPlayed: 58,
      fantasyPointsPerGame: 39.5,
      totalFantasyPoints: 2291,
      points: 23.4,
      rebounds: 5.5,
      assists: 3.6
    }
  },
  {
    id: 'nba-p-3',
    name: 'Stephen Curry',
    teamId: 'nba-gsw',
    teamShort: 'GSW',
    league: 'NBA',
    position: 'PG',
    jerseyNumber: 30,
    fantasyTier: 1,
    adp: 1.9,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Orbital Distance Archmage (+4 pts per 30ft splash)',
    stats: {
      gamesPlayed: 59,
      fantasyPointsPerGame: 44.2,
      totalFantasyPoints: 2607,
      points: 26.8,
      rebounds: 4.5,
      assists: 5.1,
      steals: 0.9
    },
    liveGameStats: {
      currentPoints: 38.5,
      summary: '28 PTS, 7-12 3PT, 6 AST, 4 REB',
      onField: true
    }
  },
  {
    id: 'nba-p-4',
    name: 'Nikola Jokić',
    teamId: 'nba-den',
    teamShort: 'DEN',
    league: 'NBA',
    position: 'C',
    jerseyNumber: 15,
    fantasyTier: 1,
    adp: 1.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Bard Playmaker',
    synergyTrait: 'Sombor Oracle (Passes generate triple XP)',
    stats: {
      gamesPlayed: 62,
      fantasyPointsPerGame: 58.6,
      totalFantasyPoints: 3633,
      points: 26.2,
      rebounds: 12.3,
      assists: 9.2,
      steals: 1.4
    }
  },
  {
    id: 'nba-p-5',
    name: 'LeBron James',
    teamId: 'nba-lal',
    teamShort: 'LAL',
    league: 'NBA',
    position: 'SF/PF',
    jerseyNumber: 23,
    fantasyTier: 1,
    adp: 2.2,
    injuryStatus: 'QUESTIONABLE',
    rpgClass: 'Paladin Defender',
    synergyTrait: 'The King Command (+10% all teammate stats)',
    stats: {
      gamesPlayed: 56,
      fantasyPointsPerGame: 46.1,
      totalFantasyPoints: 2581,
      points: 25.1,
      rebounds: 7.2,
      assists: 8.1
    }
  },

  // EPL
  {
    id: 'epl-p-1',
    name: 'Bukayo Saka',
    teamId: 'epl-ars',
    teamShort: 'ARS',
    league: 'EPL',
    position: 'RW/Winger',
    jerseyNumber: 7,
    fantasyTier: 1,
    adp: 2.3,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Starboy Curved Arrow (+25% assist threat)',
    stats: {
      gamesPlayed: 28,
      fantasyPointsPerGame: 16.4,
      totalFantasyPoints: 459.2,
      goals: 14,
      assists: 11
    },
    liveGameStats: {
      currentPoints: 17.5,
      summary: '1 Goal, 1 Assist, 3 Key Passes',
      onField: true
    }
  },
  {
    id: 'epl-p-2',
    name: 'William Saliba',
    teamId: 'epl-ars',
    teamShort: 'ARS',
    league: 'EPL',
    position: 'CB/Defender',
    jerseyNumber: 2,
    fantasyTier: 2,
    adp: 4.8,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Paladin Defender',
    synergyTrait: 'Rolls-Royce Lockdown (+6 clean sheet guarantee)',
    stats: {
      gamesPlayed: 30,
      fantasyPointsPerGame: 9.8,
      totalFantasyPoints: 294,
      saves: 65,
      goals: 2
    },
    liveGameStats: {
      currentPoints: 8.0,
      summary: 'Clean sheet in progress, 4 tackles, 94% pass acc',
      onField: true
    }
  },
  {
    id: 'epl-p-3',
    name: 'Erling Haaland',
    teamId: 'epl-mci',
    teamShort: 'MCI',
    league: 'EPL',
    position: 'ST/Striker',
    jerseyNumber: 9,
    fantasyTier: 1,
    adp: 1.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Barbarian Enforcer',
    synergyTrait: 'Nordic Berserk (Double goal fantasy pts in box)',
    stats: {
      gamesPlayed: 27,
      fantasyPointsPerGame: 21.3,
      totalFantasyPoints: 575.1,
      goals: 27,
      assists: 5
    },
    liveGameStats: {
      currentPoints: 18.0,
      summary: '2 Goals, 5 Shots on Target',
      onField: true
    }
  },
  {
    id: 'epl-p-4',
    name: 'Kevin De Bruyne',
    teamId: 'epl-mci',
    teamShort: 'MCI',
    league: 'EPL',
    position: 'CAM/Midfielder',
    jerseyNumber: 17,
    fantasyTier: 1,
    adp: 1.7,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Bard Playmaker',
    synergyTrait: 'Telepathic Through-Ball (Assists crit for 9 pts)',
    stats: {
      gamesPlayed: 20,
      fantasyPointsPerGame: 18.2,
      totalFantasyPoints: 364,
      goals: 6,
      assists: 15
    }
  },
  {
    id: 'epl-p-5',
    name: 'Mohamed Salah',
    teamId: 'epl-liv',
    teamShort: 'LIV',
    league: 'EPL',
    position: 'RW/Striker',
    jerseyNumber: 11,
    fantasyTier: 1,
    adp: 1.4,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Warlock Striker',
    synergyTrait: 'Pharaoh Speed Strike (+15% counter attack points)',
    stats: {
      gamesPlayed: 29,
      fantasyPointsPerGame: 19.5,
      totalFantasyPoints: 565.5,
      goals: 21,
      assists: 12
    }
  },

  // MLB
  {
    id: 'mlb-p-1',
    name: 'Shohei Ohtani',
    teamId: 'mlb-lad',
    teamShort: 'LAD',
    league: 'MLB',
    position: 'DH/SP',
    jerseyNumber: 17,
    fantasyTier: 1,
    adp: 1.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Warlock Striker',
    synergyTrait: 'Two-Way Sorcery (Hits HRs & Strikes out batters)',
    stats: {
      gamesPlayed: 159,
      fantasyPointsPerGame: 14.8,
      totalFantasyPoints: 2353,
      homeRuns: 54,
      battingAverage: 0.310,
      steals: 59
    },
    liveGameStats: {
      currentPoints: 16.0,
      summary: '2-4, 1 HR (450 ft), 1 SB, 3 RBI',
      onField: true
    }
  },
  {
    id: 'mlb-p-2',
    name: 'Mookie Betts',
    teamId: 'mlb-lad',
    teamShort: 'LAD',
    league: 'MLB',
    position: 'SS/OF',
    jerseyNumber: 50,
    fantasyTier: 1,
    adp: 2.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Bard Playmaker',
    synergyTrait: 'Catalyst Spark (+10% on-base multiplier)',
    stats: {
      gamesPlayed: 140,
      fantasyPointsPerGame: 11.6,
      totalFantasyPoints: 1624,
      homeRuns: 28,
      battingAverage: 0.301,
      steals: 18
    }
  },
  {
    id: 'mlb-p-3',
    name: 'Aaron Judge',
    teamId: 'mlb-nyy',
    teamShort: 'NYY',
    league: 'MLB',
    position: 'CF/OF',
    jerseyNumber: 99,
    fantasyTier: 1,
    adp: 1.3,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Barbarian Enforcer',
    synergyTrait: 'Titan Blast (Home runs grant 12 fantasy pts)',
    stats: {
      gamesPlayed: 158,
      fantasyPointsPerGame: 15.2,
      totalFantasyPoints: 2401,
      homeRuns: 58,
      battingAverage: 0.322
    }
  },

  // NHL
  {
    id: 'nhl-p-1',
    name: 'Connor McDavid',
    teamId: 'nhl-edm',
    teamShort: 'EDM',
    league: 'NHL',
    position: 'C',
    jerseyNumber: 97,
    fantasyTier: 1,
    adp: 1.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Hypersonic Glide (+20% power play scoring)',
    stats: {
      gamesPlayed: 76,
      fantasyPointsPerGame: 18.9,
      totalFantasyPoints: 1436.4,
      goals: 38,
      assists: 94
    }
  },

  // WNBA Superstars (Secret Perks Active)
  {
    id: 'wnba-p-1',
    name: 'Caitlin Clark',
    teamId: 'wnba-ind',
    teamShort: 'IND',
    league: 'WNBA',
    position: 'PG',
    jerseyNumber: 22,
    fantasyTier: 1,
    adp: 1.1,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Bard Playmaker',
    synergyTrait: 'Logo 3-Point Cataclysm (+25% distance scoring & double assist crit)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% secret multiplier on all fantasy points & +25 bonus secret points to guild!',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 40,
      fantasyPointsPerGame: 24.6,
      totalFantasyPoints: 984.0,
      points: 769,
      assists: 337,
      rebounds: 228,
      steals: 52
    },
    liveGameStats: {
      currentPoints: 27.5,
      summary: '28 PTS, 11 AST, 7 REB, 5 3PM',
      onField: true
    }
  },
  {
    id: 'wnba-p-2',
    name: 'Aliyah Boston',
    teamId: 'wnba-ind',
    teamShort: 'IND',
    league: 'WNBA',
    position: 'C/Forward',
    jerseyNumber: 7,
    fantasyTier: 2,
    adp: 2.8,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Paladin Defender',
    synergyTrait: 'Anchor of the Paint (+18% defensive stop fantasy value)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% secret multiplier & paint protection',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 40,
      fantasyPointsPerGame: 16.8,
      totalFantasyPoints: 672.0,
      points: 560,
      rebounds: 356,
      blocks: 54,
      assists: 128
    },
    liveGameStats: {
      currentPoints: 17.2,
      summary: '16 PTS, 11 REB, 3 BLK',
      onField: true
    }
  },
  {
    id: 'wnba-p-3',
    name: "A'ja Wilson",
    teamId: 'wnba-lva',
    teamShort: 'LVA',
    league: 'WNBA',
    position: 'F/Center',
    jerseyNumber: 22,
    fantasyTier: 1,
    adp: 1.0,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Paladin Defender',
    synergyTrait: 'Sovereign Double-Double Ward (+30% rebound & block fantasy rating)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Matriarch of the Realm: Multiplies weekly matchup ceiling & grants Matriarch Shield against gutter plummeters!',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 38,
      fantasyPointsPerGame: 28.2,
      totalFantasyPoints: 1071.6,
      points: 1021,
      rebounds: 450,
      blocks: 98,
      steals: 67
    },
    liveGameStats: {
      currentPoints: 31.0,
      summary: '30 PTS, 14 REB, 4 BLK, 3 STL',
      onField: true
    }
  },
  {
    id: 'wnba-p-4',
    name: 'Sabrina Ionescu',
    teamId: 'wnba-nyl',
    teamShort: 'NYL',
    league: 'WNBA',
    position: 'G',
    jerseyNumber: 20,
    fantasyTier: 1,
    adp: 1.4,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Ranger Sniper',
    synergyTrait: 'Clutch Triple Rain (Triple-doubles score 1.5x points)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% secret multiplier & perimeter rain',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 38,
      fantasyPointsPerGame: 21.4,
      totalFantasyPoints: 813.2,
      points: 692,
      assists: 236,
      rebounds: 167,
      steals: 38
    },
    liveGameStats: {
      currentPoints: 22.8,
      summary: '22 PTS, 7 AST, 5 REB, 4 3PM',
      onField: true
    }
  },

  // NWSL Superstars (Secret Perks Active)
  {
    id: 'nwsl-p-1',
    name: 'Sophia Smith',
    teamId: 'nwsl-por',
    teamShort: 'POR',
    league: 'NWSL',
    position: 'FW/Striker',
    jerseyNumber: 9,
    fantasyTier: 1,
    adp: 1.3,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Warlock Striker',
    synergyTrait: 'Golden Boot Cataclysm (+25% breakaway goal impact)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% secret multiplier & +25 bonus secret points!',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 20,
      fantasyPointsPerGame: 19.4,
      totalFantasyPoints: 388.0,
      goals: 12,
      assists: 6,
      saves: 0
    },
    liveGameStats: {
      currentPoints: 21.5,
      summary: '1 Goal, 2 Assists, 4 Shots on Goal',
      onField: true
    }
  },
  {
    id: 'nwsl-p-2',
    name: 'Trinity Rodman',
    teamId: 'nwsl-was',
    teamShort: 'WAS',
    league: 'NWSL',
    position: 'FW/Winger',
    jerseyNumber: 2,
    fantasyTier: 1,
    adp: 1.5,
    injuryStatus: 'HEALTHY',
    rpgClass: 'Barbarian Enforcer',
    synergyTrait: 'Sonic Wing Rampage (+20% pressuring assist value)',
    isWomensSports: true,
    secretPerkActive: true,
    secretPerkDescription: '👑 Valkyrie Sovereign: +20% secret multiplier & unstoppable sonic rush!',
    secretBonusPoints: 25,
    stats: {
      gamesPlayed: 21,
      fantasyPointsPerGame: 18.2,
      totalFantasyPoints: 382.2,
      goals: 8,
      assists: 7
    },
    liveGameStats: {
      currentPoints: 17.8,
      summary: '1 Goal, 1 Assist, 3 Successful Take-ons',
      onField: true
    }
  }
];

export const INITIAL_GAMES: LiveGame[] = [
  {
    id: 'game-1',
    league: 'NFL',
    homeTeamId: 'nfl-kc',
    awayTeamId: 'nfl-sf',
    homeScore: 27,
    awayScore: 24,
    status: 'LIVE',
    clock: '4th 01:42',
    period: 'Q4',
    venue: 'Arrowhead Colosseum (Kansas City, MO)',
    venueEnvironment: {
      stadium: 'Arrowhead Stadium',
      city: 'Kansas City',
      stateOrCountry: 'MO, USA',
      isIndoors: false,
      isNorthernRealm: false,
      temperatureF: 88,
      weatherCondition: 'Late-September Sunbaked Heatwave (88°F, 65% Humidity)',
      seasonContext: 'Hot September late-summer open-air sun',
      environmentalBuff: '+18% Air-yards velocity on deep passes & high-octane red zone plays',
      environmentalDebuff: '-10% Defensive stamina & higher heat fatigue checks in 4th quarter',
      dcSavingThrow: 12,
      dndLoreFlavor: 'Sunbaked natural turf radiates intense late-summer heat; quarterbacks throw with laser velocity while defenders suffer stamina burn.'
    },
    startTime: '2026-09-15T17:30:00Z',
    plays: [
      {
        id: 'play-1',
        time: '01:42',
        quarterOrPeriod: 'Q4',
        description: 'P. Mahomes 14-yd touchdown strike down seam to T. Kelce! Arrowhead erupts.',
        teamId: 'nfl-kc',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'nfl-p-1', playerName: 'Patrick Mahomes', points: 4.56 }
      },
      {
        id: 'play-2',
        time: '03:10',
        quarterOrPeriod: 'Q4',
        description: 'C. McCaffrey breaks 3 tackles along right sideline for a clutch 28-yard gain.',
        teamId: 'nfl-sf',
        scoringPlay: false,
        fantasyPointsImpact: { playerId: 'nfl-p-3', playerName: 'Christian McCaffrey', points: 2.8 }
      },
      {
        id: 'play-3',
        time: '06:22',
        quarterOrPeriod: 'Q4',
        description: 'N. Bosa bull-rushes tackle for a strip-sack turnover in Kansas City territory!',
        teamId: 'nfl-sf',
        scoringPlay: false,
        fantasyPointsImpact: { playerId: 'nfl-p-4', playerName: 'Nick Bosa', points: 4.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'Passing Yds': 312, 'Rushing Yds': 98, 'Turnovers': 1, 'Red Zone': '3/4' },
      awayTeamStats: { 'Passing Yds': 245, 'Rushing Yds': 168, 'Turnovers': 0, 'Red Zone': '2/3' },
      topPerformers: [
        { playerId: 'nfl-p-1', name: 'Patrick Mahomes', team: 'KC', statLine: '26/34, 312 YDS, 3 TD', fantasyPoints: 24.8 },
        { playerId: 'nfl-p-3', name: 'Christian McCaffrey', team: 'SF', statLine: '18 ATT, 114 YDS, 1 TD', fantasyPoints: 21.4 }
      ]
    }
  },
  {
    id: 'game-2',
    league: 'NBA',
    homeTeamId: 'nba-bos',
    awayTeamId: 'nba-gsw',
    homeScore: 112,
    awayScore: 108,
    status: 'LIVE',
    clock: '4th 00:54',
    period: 'Q4',
    venue: 'TD Garden Bastion (Boston, MA)',
    venueEnvironment: {
      stadium: 'TD Garden',
      city: 'Boston',
      stateOrCountry: 'MA, USA',
      isIndoors: true,
      isNorthernRealm: false,
      temperatureF: 72,
      weatherCondition: 'Parquet Climatron Vault (72°F Climate Controlled)',
      seasonContext: 'Indoor arena sanctuary unaffected by outside elements',
      environmentalBuff: '+15% Perimeter shooting accuracy & ball-handling dexterity',
      environmentalDebuff: 'Tight court dimensions increase foul collision risk (-2 pts on charges)',
      dcSavingThrow: 10,
      dndLoreFlavor: 'Subterranean climate controls seal out external atmospheric turbulence, enabling surgical perimeter sharpshooting.'
    },
    startTime: '2026-09-15T19:00:00Z',
    plays: [
      {
        id: 'play-nba-1',
        time: '00:54',
        quarterOrPeriod: 'Q4',
        description: 'Jayson Tatum sinks a contested step-back 28ft triple over Draymond Green!',
        teamId: 'nba-bos',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'nba-p-1', playerName: 'Jayson Tatum', points: 4.0 }
      },
      {
        id: 'play-nba-2',
        time: '01:30',
        quarterOrPeriod: 'Q4',
        description: 'Stephen Curry answers with an acrobatic high-arching floater off glass.',
        teamId: 'nba-gsw',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'nba-p-3', playerName: 'Stephen Curry', points: 2.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'FG%': '49.4%', '3PT': '18/41', 'Rebounds': 46, 'Assists': 28 },
      awayTeamStats: { 'FG%': '47.2%', '3PT': '19/44', 'Rebounds': 42, 'Assists': 26 },
      topPerformers: [
        { playerId: 'nba-p-1', name: 'Jayson Tatum', team: 'BOS', statLine: '34 PTS, 9 REB, 5 AST', fantasyPoints: 47.8 },
        { playerId: 'nba-p-3', name: 'Stephen Curry', team: 'GSW', statLine: '31 PTS, 7 3PM, 6 AST', fantasyPoints: 42.2 }
      ]
    }
  },
  {
    id: 'game-3',
    league: 'EPL',
    homeTeamId: 'epl-ars',
    awayTeamId: 'epl-mci',
    homeScore: 2,
    awayScore: 2,
    status: 'LIVE',
    clock: '88\'',
    period: '2nd Half',
    venue: 'Emirates Sanctum (London, UK)',
    venueEnvironment: {
      stadium: 'Emirates Stadium',
      city: 'London',
      stateOrCountry: 'England, UK',
      isIndoors: false,
      isNorthernRealm: false,
      temperatureF: 64,
      weatherCondition: 'Autumn Thames Mist & Crisp Evening Dew (64°F, Overcast)',
      seasonContext: 'Mild English September dusk with slick natural grass',
      environmentalBuff: '+20% Speed on counter-attack through balls & curling strikes',
      environmentalDebuff: 'Slick turf increases slide tackle fouls & referee card penalties',
      dcSavingThrow: 11,
      dndLoreFlavor: 'Cool London autumnal mist slicks the pitch, accelerating low through-balls and fast-break counter strikes.'
    },
    startTime: '2026-09-15T14:30:00Z',
    plays: [
      {
        id: 'play-epl-1',
        time: '86\'',
        quarterOrPeriod: '2H',
        description: 'Erling Haaland thunders a header into top corner from a De Bruyne pinpoint cross!',
        teamId: 'epl-mci',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'epl-p-3', playerName: 'Erling Haaland', points: 6.0 }
      },
      {
        id: 'play-epl-2',
        time: '71\'',
        quarterOrPeriod: '2H',
        description: 'Bukayo Saka cuts inside two defenders and buries a curling rocket into bottom bin.',
        teamId: 'epl-ars',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'epl-p-1', playerName: 'Bukayo Saka', points: 6.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'Possession': '48%', 'Shots': 14, 'On Target': 6, 'Corners': 7 },
      awayTeamStats: { 'Possession': '52%', 'Shots': 16, 'On Target': 7, 'Corners': 5 },
      topPerformers: [
        { playerId: 'epl-p-3', name: 'Erling Haaland', team: 'MCI', statLine: '2 Goals, 5 Shots', fantasyPoints: 18.0 },
        { playerId: 'epl-p-1', name: 'Bukayo Saka', team: 'ARS', statLine: '1 Goal, 1 Assist', fantasyPoints: 15.0 }
      ]
    }
  },
  {
    id: 'game-4',
    league: 'MLB',
    homeTeamId: 'mlb-lad',
    awayTeamId: 'mlb-nyy',
    homeScore: 6,
    awayScore: 4,
    status: 'FINAL',
    clock: 'Final 9th',
    period: 'F',
    venue: 'Dodger Stadium Arena (Los Angeles, CA)',
    venueEnvironment: {
      stadium: 'Dodger Stadium',
      city: 'Los Angeles',
      stateOrCountry: 'CA, USA',
      isIndoors: false,
      isNorthernRealm: false,
      temperatureF: 91,
      weatherCondition: 'Chavez Ravine Solar Flare (91°F Dry Santa Ana Wind)',
      seasonContext: 'Late-September dry California heat elevating thermal updrafts',
      environmentalBuff: '+25% Extra base hit and home run distance (Deep bombs crit for +3 pts)',
      environmentalDebuff: 'Pitcher grip degradation past 75 pitches causes velocity drops',
      dcSavingThrow: 13,
      dndLoreFlavor: 'Rising thermal updrafts from the dry ravine carry fly balls an additional 15 feet into the right-field pavilions.'
    },
    startTime: '2026-09-14T20:00:00Z',
    plays: [
      {
        id: 'play-mlb-1',
        time: 'Bottom 8th',
        quarterOrPeriod: '8th',
        description: 'Shohei Ohtani crushes a mammoth 450-ft 2-run home run into the right pavilion!',
        teamId: 'mlb-lad',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'mlb-p-1', playerName: 'Shohei Ohtani', points: 10.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'Hits': 9, 'Runs': 6, 'Errors': 0, 'HR': 2 },
      awayTeamStats: { 'Hits': 7, 'Runs': 4, 'Errors': 1, 'HR': 1 },
      topPerformers: [
        { playerId: 'mlb-p-1', name: 'Shohei Ohtani', team: 'LAD', statLine: '2-4, HR, 3 RBI, SB', fantasyPoints: 16.0 },
        { playerId: 'mlb-p-3', name: 'Aaron Judge', team: 'NYY', statLine: '1-3, HR, 2 BB, 2 RBI', fantasyPoints: 12.0 }
      ]
    }
  },
  {
    id: 'game-5',
    league: 'NHL',
    homeTeamId: 'nhl-edm',
    awayTeamId: 'nhl-edm', // Exhibition Northern Showcase
    homeScore: 4,
    awayScore: 1,
    status: 'LIVE',
    clock: '3rd 04:12',
    period: 'P3',
    venue: 'Rogers Place Citadel (Edmonton, AB)',
    venueEnvironment: {
      stadium: 'Rogers Place',
      city: 'Edmonton',
      stateOrCountry: 'Alberta, Canada',
      isIndoors: true,
      isNorthernRealm: true,
      temperatureF: 52,
      weatherCondition: 'Sub-Arctic Frontier Chill (52°F Outer / 18°F Ice Surface)',
      seasonContext: 'The Northern Realm — dormant in September UNLESS a Northern Sweep occurs!',
      environmentalBuff: '+25% Adamantine defensive armor, goalie saves, and physical hits across all leagues',
      environmentalDebuff: '-15% Deep passing precision as sudden freezing gale blankets the turf',
      dcSavingThrow: 15,
      dndLoreFlavor: 'Ancient scrolls say: No winter lizards stalk hot September—unless the Northern Warriors sweep the ice, unleashing the mythical frost front!',
      northernSweepActive: false
    },
    startTime: '2026-09-15T21:00:00Z',
    plays: [
      {
        id: 'play-nhl-1',
        time: 'P3 04:12',
        quarterOrPeriod: 'P3',
        description: 'Connor McDavid weaves through three defenders at hypersonic speed and buries a wrist shot top shelf!',
        teamId: 'nhl-edm',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'nhl-p-1', playerName: 'Connor McDavid', points: 5.5 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'Shots': 36, 'Faceoff%': '58%', 'PowerPlay': '2/3', 'Hits': 24 },
      awayTeamStats: { 'Shots': 22, 'Faceoff%': '42%', 'PowerPlay': '0/2', 'Hits': 19 },
      topPerformers: [
        { playerId: 'nhl-p-1', name: 'Connor McDavid', team: 'EDM', statLine: '2 Goals, 2 Assists, +3', fantasyPoints: 19.5 }
      ]
    }
  },
  {
    id: 'game-wnba-1',
    league: 'WNBA',
    homeTeamId: 'wnba-lva',
    awayTeamId: 'wnba-ind',
    homeScore: 88,
    awayScore: 85,
    status: 'LIVE',
    clock: '4th 00:38',
    period: 'Q4',
    venue: 'Michelob ULTRA Arena (Las Vegas, NV)',
    venueEnvironment: {
      stadium: 'Michelob ULTRA Arena',
      city: 'Las Vegas',
      stateOrCountry: 'NV, USA',
      isIndoors: true,
      isNorthernRealm: false,
      temperatureF: 72,
      weatherCondition: 'Desert Oasis Climatron Vault (72°F Climate-Controlled)',
      seasonContext: 'WNBA Playoff Crucible indoors unaffected by desert heat',
      environmentalBuff: '+20% Transition speed, fast-break flow & perimeter three-point surge',
      environmentalDebuff: 'High-octane tempo triggers 4th quarter stamina saving throw DC 12',
      dcSavingThrow: 12,
      dndLoreFlavor: 'Valkyries clash on the hardwood; Caitlin Clark’s logo triples duel against A\'ja Wilson’s sovereign rim protection.'
    },
    startTime: '2026-09-15T20:00:00Z',
    plays: [
      {
        id: 'play-wnba-1',
        time: '00:38',
        quarterOrPeriod: 'Q4',
        description: 'Caitlin Clark steps back from 33 feet and drains a blistering logo 3-pointer!',
        teamId: 'wnba-ind',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'wnba-p-1', playerName: 'Caitlin Clark', points: 4.5 }
      },
      {
        id: 'play-wnba-2',
        time: '01:10',
        quarterOrPeriod: 'Q4',
        description: "A'ja Wilson blocks a driving layup off the glass, outlets, and trails for the putback slam!",
        teamId: 'wnba-lva',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'wnba-p-3', playerName: "A'ja Wilson", points: 4.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'FG%': '50.8%', '3PT': '9/22', 'Rebounds': 44, 'Blocks': 7 },
      awayTeamStats: { 'FG%': '48.2%', '3PT': '14/31', 'Rebounds': 38, 'Assists': 26 },
      topPerformers: [
        { playerId: 'wnba-p-3', name: "A'ja Wilson", team: 'LVA', statLine: '30 PTS, 14 REB, 4 BLK', fantasyPoints: 31.0 },
        { playerId: 'wnba-p-1', name: 'Caitlin Clark', team: 'IND', statLine: '28 PTS, 11 AST, 5 3PM', fantasyPoints: 27.5 }
      ]
    }
  },
  {
    id: 'game-nwsl-1',
    league: 'NWSL',
    homeTeamId: 'nwsl-por',
    awayTeamId: 'nwsl-was',
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    clock: '82\'',
    period: '2nd Half',
    venue: 'Providence Park (Portland, OR)',
    venueEnvironment: {
      stadium: 'Providence Park',
      city: 'Portland',
      stateOrCountry: 'OR, USA',
      isIndoors: false,
      isNorthernRealm: false,
      temperatureF: 68,
      weatherCondition: 'Pacific Northwest Late-September Twilight (68°F, Clear)',
      seasonContext: 'Temperate evening conditions on natural turf',
      environmentalBuff: '+15% Counter-attack precision and breakaway speed',
      environmentalDebuff: 'Dense turf increases slide tackle foul risk on 50/50 challenges',
      dcSavingThrow: 11,
      dndLoreFlavor: 'The Rose City bastion roars as Sophia Smith leads the frontline charge against Trinity Rodman’s sonic counter-attacks.'
    },
    startTime: '2026-09-15T19:30:00Z',
    plays: [
      {
        id: 'play-nwsl-1',
        time: '78\'',
        quarterOrPeriod: '2nd Half',
        description: 'Sophia Smith cuts past the center back and hammers a right-footed curler into the top right corner!',
        teamId: 'nwsl-por',
        scoringPlay: true,
        fantasyPointsImpact: { playerId: 'nwsl-p-1', playerName: 'Sophia Smith', points: 6.0 }
      }
    ],
    boxScore: {
      homeTeamStats: { 'Possession': '54%', 'Shots': 15, 'On Target': 7, 'Corners': 6 },
      awayTeamStats: { 'Possession': '46%', 'Shots': 11, 'On Target': 4, 'Corners': 3 },
      topPerformers: [
        { playerId: 'nwsl-p-1', name: 'Sophia Smith', team: 'POR', statLine: '1 Goal, 2 Assists, 4 Shots', fantasyPoints: 21.5 },
        { playerId: 'nwsl-p-2', name: 'Trinity Rodman', team: 'WAS', statLine: '1 Goal, 1 Assist, 3 Take-ons', fantasyPoints: 17.8 }
      ]
    }
  }
];

export const CAMPAIGN_MODIFIERS: CampaignModifier[] = [
  {
    id: 'mod-1',
    name: 'Sunbaked Arrowhead Caldera (Kansas City - 88°F)',
    flavorText: 'Late-September heatwave bakes the natural grass field under blazing Missouri sun.',
    sportAffected: 'NFL',
    buffDescription: '+18% Air-yards velocity on deep passes & high-octane red zone plays',
    debuffDescription: '-10% Defensive stamina & higher heat fatigue checks in 4th quarter',
    diceRollRequired: 12,
    venueLocation: 'Arrowhead Stadium, Kansas City, MO',
    temperatureF: 88,
    isSeptemberHeat: true
  },
  {
    id: 'mod-2',
    name: 'Autumn Thames Mist (London - 64°F)',
    flavorText: 'Crisp North London evening mist slicks the pristine grass of the Emirates.',
    sportAffected: 'EPL',
    buffDescription: '+20% Speed on counter-attack through balls & curling strikes',
    debuffDescription: 'Slick turf increases slide tackle fouls & referee yellow card risk',
    diceRollRequired: 11,
    venueLocation: 'Emirates Stadium, London, UK',
    temperatureF: 64
  },
  {
    id: 'mod-3',
    name: 'Chavez Ravine Solar Flare (Los Angeles - 91°F)',
    flavorText: 'Dry Santa Ana late-summer heat currents elevate fly balls in the California afternoon.',
    sportAffected: 'MLB',
    buffDescription: '+25% Extra base hit and home run distance (Deep bombs crit for +3 pts)',
    debuffDescription: 'Pitchers experience faster pitch velocity drop-off past 75 pitches',
    diceRollRequired: 13,
    venueLocation: 'Dodger Stadium, Los Angeles, CA',
    temperatureF: 91,
    isSeptemberHeat: true
  },
  {
    id: 'mod-4',
    name: 'Parquet Climatron Bastion (Boston - 72°F Indoors)',
    flavorText: 'Subterranean arena HVAC shields athletes from outside weather; pure basketball equilibrium.',
    sportAffected: 'NBA',
    buffDescription: '+15% Perimeter shooting accuracy & ball-handling dexterity',
    debuffDescription: 'Tight parquet floor bounds reward physical defense; charges cost -2 pts',
    diceRollRequired: 10,
    venueLocation: 'TD Garden, Boston, MA',
    temperatureF: 72
  },
  {
    id: 'mod-winter-lizard',
    name: 'Winter Lizard Frost Surge (Northern Sweep)',
    flavorText: 'The Northern Warriors of Edmonton sweep and dominate the field, unleashing a freak sub-zero blizzard in the middle of hot September!',
    sportAffected: 'ALL',
    buffDescription: '+25% Adamantine defensive armor, goalie saves, and physical hits across all leagues',
    debuffDescription: '-15% Deep passing precision as sudden freezing gale blankets the turf',
    diceRollRequired: 15,
    venueLocation: 'Rogers Place, Edmonton, AB (The Northern Realm)',
    temperatureF: 26,
    isNorthernSweep: true
  }
];

export const INITIAL_CAMPAIGN: FantasyCampaign = {
  id: 'campaign-alpha-2026',
  name: 'Chronicles of the Iron League: Season IV',
  commissionerName: 'Arch-Commissioner Vorath (AI Master)',
  inviteCode: 'REALM-CHAMP-7749',
  seasonYear: '2026',
  leaguesIncluded: ['NFL', 'NBA', 'EPL', 'MLB', 'NHL', 'WNBA', 'NWSL'],
  status: 'ACTIVE_CAMPAIGN',
  currentWeek: 4,
  totalWeeks: 10,
  campaignLore: 'The sports pantheon converges across dimensions. Human managers form guilds of tactical coordination to wield legendary superstars in weekly battles of glory, dice rolls, and real-time box score dominance.',
  guilds: [
    {
      id: 'guild-1',
      name: 'Vanguard of Thunder',
      bannerColor: '#3B82F6',
      crestIcon: 'ShieldAlert',
      budget: 185,
      gutterStatus: 'NORMAL',
      wagerWinStreak: 1,
      womensSportsPerks: {
        active: true,
        secretMultiplier: 1.20,
        secretBonusPoints: 25,
        matriarchShieldAvailable: true
      },
      campaignStats: { wins: 3, losses: 0, ties: 0, totalPoints: 532.4, guildXP: 2450, level: 3 },
      members: [
        {
          id: 'mem-1',
          name: 'J. Denton (You)',
          email: 'J.Denton1207@gmail.com',
          avatarColor: 'bg-amber-500',
          role: 'GUILD_MASTER',
          roleTitle: 'Supreme Guildmaster',
          assignedPlayerIds: ['nfl-p-1', 'nba-p-1', 'wnba-p-1'], // Mahomes, Tatum, Caitlin Clark
          tacticalXP: 1420,
          prestigeRank: 'Grand Strategist Tier II'
        },
        {
          id: 'mem-2',
          name: 'Sarah Chen',
          email: 'sarah.c@realm.net',
          avatarColor: 'bg-indigo-500',
          role: 'OFFENSE_COORDINATOR',
          roleTitle: 'Offensive Commander',
          assignedPlayerIds: ['epl-p-1', 'mlb-p-1'], // Saka, Ohtani
          tacticalXP: 980,
          prestigeRank: 'Striker Adept'
        },
        {
          id: 'mem-3',
          name: 'Marcus Brody',
          email: 'marcus.b@tactics.gg',
          avatarColor: 'bg-emerald-500',
          role: 'DEFENSE_TACTICIAN',
          roleTitle: 'Iron Wall Captain',
          assignedPlayerIds: ['nfl-p-4', 'epl-p-2'], // Nick Bosa, Saliba
          tacticalXP: 850,
          prestigeRank: 'Shield Warden'
        }
      ],
      roster: [
        INITIAL_PLAYERS[0], // Mahomes
        INITIAL_PLAYERS[6], // Tatum
        INITIAL_PLAYERS[10], // Saka
        INITIAL_PLAYERS[14], // Ohtani
        INITIAL_PLAYERS[3], // Nick Bosa
        INITIAL_PLAYERS[11], // Saliba
        INITIAL_PLAYERS[17] // Caitlin Clark (WNBA - Valkyrie Sovereign Ward)
      ]
    },
    {
      id: 'guild-2',
      name: 'Shadow Syndicate FC',
      bannerColor: '#EC4899',
      crestIcon: 'Flame',
      budget: 160,
      gutterStatus: 'NORMAL',
      wagerWinStreak: 0,
      campaignStats: { wins: 2, losses: 1, ties: 0, totalPoints: 498.2, guildXP: 1980, level: 2 },
      members: [
        {
          id: 'mem-opp-1',
          name: 'Darius Vance',
          email: 'darius@shadowsyn.io',
          avatarColor: 'bg-rose-500',
          role: 'GUILD_MASTER',
          roleTitle: 'Shadow Warlord',
          assignedPlayerIds: ['nfl-p-3', 'epl-p-3'], // McCaffrey, Haaland
          tacticalXP: 1200,
          prestigeRank: 'Dark Commander'
        },
        {
          id: 'mem-opp-2',
          name: 'Elena Rostova',
          email: 'elena.r@shadowsyn.io',
          avatarColor: 'bg-purple-500',
          role: 'OFFENSE_COORDINATOR',
          roleTitle: 'Spellweaver Tactician',
          assignedPlayerIds: ['nba-p-3', 'mlb-p-3'], // Curry, Judge
          tacticalXP: 780,
          prestigeRank: 'Chaos Gunner'
        }
      ],
      roster: [
        INITIAL_PLAYERS[2], // McCaffrey
        INITIAL_PLAYERS[12], // Haaland
        INITIAL_PLAYERS[8], // Curry
        INITIAL_PLAYERS[15], // Judge
        INITIAL_PLAYERS[1] // Kelce
      ]
    },
    {
      id: 'guild-3',
      name: 'Titanium Kraken',
      bannerColor: '#10B981',
      crestIcon: 'Anchor',
      budget: 140,
      campaignStats: { wins: 1, losses: 2, ties: 0, totalPoints: 442.8, guildXP: 1400, level: 2 },
      members: [
        {
          id: 'mem-krak-1',
          name: 'Liam Sterling',
          email: 'liam@kraken.sport',
          avatarColor: 'bg-teal-500',
          role: 'GUILD_MASTER',
          roleTitle: 'Kraken High Admiral',
          assignedPlayerIds: ['nfl-p-5', 'nba-p-4'],
          tacticalXP: 910,
          prestigeRank: 'Reaver'
        }
      ],
      roster: [
        INITIAL_PLAYERS[4], // Lamar Jackson
        INITIAL_PLAYERS[9], // Jokic
        INITIAL_PLAYERS[13], // De Bruyne
        INITIAL_PLAYERS[16] // McDavid
      ]
    },
    {
      id: 'guild-4',
      name: 'Frostpeak Valkyries',
      bannerColor: '#8B5CF6',
      crestIcon: 'Crown',
      budget: 155,
      gutterStatus: 'NORMAL',
      wagerWinStreak: 2,
      womensSportsPerks: {
        active: true,
        secretMultiplier: 1.20,
        secretBonusPoints: 25,
        matriarchShieldAvailable: true
      },
      campaignStats: { wins: 2, losses: 1, ties: 0, totalPoints: 478.6, guildXP: 1850, level: 2 },
      members: [
        {
          id: 'mem-valk-1',
          name: 'Freja Lindqvist',
          email: 'freja@frostpeak.gg',
          avatarColor: 'bg-purple-500',
          role: 'GUILD_MASTER',
          roleTitle: 'High Valkyrie Matriarch',
          assignedPlayerIds: ['wnba-p-3', 'nwsl-p-1'],
          tacticalXP: 1150,
          prestigeRank: 'Shield Maiden Sovereign'
        }
      ],
      roster: [
        INITIAL_PLAYERS[19], // A'ja Wilson (WNBA MVP)
        INITIAL_PLAYERS[21], // Sophia Smith (NWSL)
        INITIAL_PLAYERS[5],  // Justin Jefferson (NFL)
        INITIAL_PLAYERS[7]   // Giannis (NBA)
      ]
    }
  ],
  matchups: [
    {
      id: 'matchup-w4-1',
      weekNumber: 4,
      weekTitle: 'Week 4: Siege of the Thunder Colosseum',
      homeGuildId: 'guild-1',
      awayGuildId: 'guild-2',
      homeScore: 114.7,
      awayScore: 108.2,
      status: 'IN_PROGRESS',
      activeModifier: CAMPAIGN_MODIFIERS[0],
      weatherOrRealmCondition: 'Sunbaked Arrowhead Caldera (Kansas City - 88°F September Sun)',
      venueEnvironment: {
        stadium: 'Arrowhead Stadium',
        city: 'Kansas City',
        stateOrCountry: 'MO, USA',
        isIndoors: false,
        isNorthernRealm: false,
        temperatureF: 88,
        weatherCondition: 'Late-September Sunbaked Heatwave (88°F)',
        seasonContext: 'Hot September late-summer open-air sun',
        environmentalBuff: '+18% Air-yards velocity on deep passes & high-octane red zone plays',
        environmentalDebuff: '-10% Defensive stamina & higher heat fatigue checks in 4th quarter',
        dcSavingThrow: 12,
        dndLoreFlavor: 'Sunbaked natural turf radiates intense late-summer heat; quarterbacks throw with laser velocity while defenders suffer stamina burn.'
      },
      storyNarrative: 'Mahomes and Tatum lead the Vanguard charge through the sweltering 88°F September afternoon while the Shadow Syndicate counters with Haaland and McCaffrey!'
    },
    {
      id: 'matchup-w3-1',
      weekNumber: 3,
      weekTitle: 'Week 3: Clash of the Astral Citadels',
      homeGuildId: 'guild-3',
      awayGuildId: 'guild-1',
      homeScore: 122.0,
      awayScore: 139.5,
      status: 'COMPLETED',
      activeModifier: CAMPAIGN_MODIFIERS[1],
      weatherOrRealmCondition: 'Autumn Thames Mist (London - 64°F)',
      venueEnvironment: {
        stadium: 'Emirates Stadium',
        city: 'London',
        stateOrCountry: 'England, UK',
        isIndoors: false,
        isNorthernRealm: false,
        temperatureF: 64,
        weatherCondition: 'Autumn Thames Mist & Crisp Evening Dew (64°F)',
        seasonContext: 'Mild English September dusk with slick natural grass',
        environmentalBuff: '+20% Speed on counter-attack through balls & curling strikes',
        environmentalDebuff: 'Slick turf increases slide tackle fouls & referee card penalties',
        dcSavingThrow: 11,
        dndLoreFlavor: 'Cool London autumnal mist slicks the pitch, accelerating low through-balls and fast-break counter strikes.'
      },
      storyNarrative: 'Vanguard secured victory in a frantic finish thanks to Saka’s late heroics!'
    }
  ]
};

export const INITIAL_WAGERS: FriendlyWager[] = [
  {
    id: 'wager-1',
    proposingGuildId: 'guild-1',
    proposingGuildName: 'Vanguard of Thunder',
    proposingManagerName: 'J. Denton',
    targetGuildId: 'guild-2',
    targetGuildName: 'Shadow Syndicate FC',
    wagerType: 'MATCHUP_DUEL',
    title: 'The Blood & Thunder Showdown',
    description: 'Vanguard stakes 50 guild fantasy points that their squad will defeat Shadow Syndicate in Week 4 by at least 10 points!',
    wagerPoints: 50,
    potentialRewardPoints: 100,
    gutterPenaltyDescription: 'Loser plummets directly to the Sewer Gutter as a Street Rat begging for mercy, wearing the Jester Rat cap for 48 hours!',
    status: 'ACTIVE',
    createdAt: '2026-09-15T16:00:00Z'
  },
  {
    id: 'wager-2',
    proposingGuildId: 'guild-2',
    proposingGuildName: 'Shadow Syndicate FC',
    proposingManagerName: 'Darius Vance',
    targetGuildId: 'guild-3',
    targetGuildName: 'Titanium Kraken',
    wagerType: 'POINT_THRESHOLD',
    title: 'Overlapping Century Conquest',
    description: 'Shadow Syndicate wagers 30 points that Erling Haaland and Steph Curry will score a combined 40+ points across their overlapping games.',
    wagerPoints: 30,
    potentialRewardPoints: 60,
    gutterPenaltyDescription: 'Surrender 30 points and beg publicly in the Guild Square with rat emojis.',
    status: 'WON',
    createdAt: '2026-09-14T18:00:00Z',
    resolvedAt: '2026-09-15T02:00:00Z',
    outcomeNarrative: 'Haaland bagged 2 goals while Curry hit 4 triples; Shadow Syndicate claimed 60 points!'
  }
];

export const INITIAL_NAGGING_MESSAGES: NaggingMessage[] = [
  {
    id: 'nag-1',
    senderGuildId: 'guild-2',
    senderGuildName: 'Shadow Syndicate FC',
    senderManagerName: 'Darius Vance',
    targetGuildId: 'guild-1',
    targetGuildName: 'Vanguard of Thunder',
    text: 'Enjoy the penthouse while you can, Denton! Haaland is hungry and your 4th quarter defense is melting in the September sun! 🧀🐀',
    emoji: '🧀',
    gifUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
    gifTitle: 'Cheeky smirk GIF',
    timestamp: '10m ago',
    reactions: [
      { emoji: '🔥', count: 3 },
      { emoji: '🐀', count: 2 }
    ]
  },
  {
    id: 'nag-2',
    senderGuildId: 'guild-1',
    senderGuildName: 'Vanguard of Thunder',
    senderManagerName: 'J. Denton',
    targetGuildId: 'guild-2',
    targetGuildName: 'Shadow Syndicate FC',
    text: 'Caitlin Clark is draining 35-footers while our Valkyrie Sovereign perk provides a +20% boost. Prepare your gutter bowl, Darius!',
    emoji: '👑',
    gifUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    gifTitle: 'Victory celebration GIF',
    timestamp: '5m ago',
    reactions: [
      { emoji: '⚡', count: 5 },
      { emoji: '👑', count: 4 }
    ]
  },
  {
    id: 'nag-3',
    senderGuildId: 'guild-3',
    senderGuildName: 'Titanium Kraken',
    senderManagerName: 'Liam Sterling',
    targetGuildId: 'guild-2',
    targetGuildName: 'Shadow Syndicate FC',
    text: 'We lost our 30-pt wager and have officially plummeted to Street Rat status... Spare some cheese crumbs, good lords! 🐭😭🙏',
    emoji: '🐀',
    isBeggingForMercy: true,
    mercyGranted: false,
    gifUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&auto=format&fit=crop&q=80',
    gifTitle: 'Begging hamster with hands together GIF',
    timestamp: '2m ago',
    reactions: [
      { emoji: '🧀', count: 7 },
      { emoji: '😂', count: 6 },
      { emoji: '🙏', count: 3 }
    ]
  }
];

