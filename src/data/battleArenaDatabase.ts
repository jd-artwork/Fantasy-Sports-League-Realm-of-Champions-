import { 
  TournamentSeason, ClubFighter, FighterAbility, SportsPlayer, 
  DeathballState, TriathlonState, SportLeague, CombatStatusEffect 
} from '../types';

export const TOURNAMENT_SEASONS: TournamentSeason[] = [
  {
    id: 'autumn_crucible',
    name: 'Autumn Crucible',
    codename: 'The Gridiron & Fall Pitch',
    seasonPeriod: 'Sept - Nov (Active Now)',
    activeSports: ['NFL', 'EPL', 'WNBA', 'MLB'],
    themeDescription: 'The autumn gale descends upon the arena. Football titans charge through torrential rain as soccer playmakers bend curved strikes across frozen pitches and MLB postseason heroics shake the earth.',
    arenaHazard: 'Autumn Tempest & Mud Slick (Reduces DEX checks by 2 unless player has High-Traction Cleats)',
    seasonProgressWeeks: 12,
    currentWeek: 4,
    sportBuffs: [
      { sport: 'NFL', buffName: 'Gridiron Rush', description: '+20% damage on physical charges and red-zone strikes', bonusMultiplier: 1.20 },
      { sport: 'EPL', buffName: 'Heavy Pitch Curve', description: '+15% accuracy on curved ball projectiles', bonusMultiplier: 1.15 },
      { sport: 'WNBA', buffName: 'Championship Form', description: '+25% defensive shielding during playoff crunch-time', bonusMultiplier: 1.25 },
      { sport: 'MLB', buffName: 'October Clutch', description: '+30% critical strike chance on slugger power swings', bonusMultiplier: 1.30 }
    ]
  },
  {
    id: 'winter_siege',
    name: 'Winter Solstice Siege',
    codename: 'Hardcourt Frost & Ice Daggers',
    seasonPeriod: 'Dec - Feb',
    activeSports: ['NBA', 'NHL', 'EPL', 'NFL'],
    themeDescription: 'Permafrost blankets the arena floor. Blistering fast-breaks on hardwood clash with razor-sharp ice hockey checks, requiring relentless stamina and high-tempo endurance.',
    arenaHazard: 'Permafrost Glaze (Every 3rd turn, agility saves must be rolled or fighters slide 10 yards out of position)',
    seasonProgressWeeks: 12,
    currentWeek: 1,
    sportBuffs: [
      { sport: 'NBA', buffName: 'Fast-Break Inferno', description: '+25% speed and AP recovery on turnaround dunks and 3-pointers', bonusMultiplier: 1.25 },
      { sport: 'NHL', buffName: 'Glacial Check', description: 'Checks inflict Freeze/Stun on hit targets', bonusMultiplier: 1.20 },
      { sport: 'EPL', buffName: 'Boxing Day Grit', description: '+15% Constitution stamina preservation', bonusMultiplier: 1.15 }
    ]
  },
  {
    id: 'spring_awakening',
    name: 'Spring Awakening',
    codename: 'The Pitch & Diamond Conquest',
    seasonPeriod: 'Mar - May',
    activeSports: ['MLB', 'NWSL', 'EPL', 'NBA'],
    themeDescription: 'The blooming sun ignites the diamond and pitch. 100mph blazing fastballs clash with NWSL breakaways and European knockout championship drama.',
    arenaHazard: 'Sudden Spring Deluge (Water hazards spawn across the arena center)',
    seasonProgressWeeks: 12,
    currentWeek: 1,
    sportBuffs: [
      { sport: 'MLB', buffName: 'Spring Slugger Surge', description: '+25% home-run distance damage and batting crit', bonusMultiplier: 1.25 },
      { sport: 'NWSL', buffName: 'Rose City Sprint', description: '+30% breakaway speed & counter-attack burst', bonusMultiplier: 1.30 },
      { sport: 'EPL', buffName: 'Champions League Euphoria', description: '+20% team morale and tactical synergy', bonusMultiplier: 1.20 }
    ]
  },
  {
    id: 'summer_olympiad',
    name: 'Summer Multi-Sport Olympiad',
    codename: 'The Sovereign Sun Gauntlet',
    seasonPeriod: 'Jun - Aug',
    activeSports: ['WNBA', 'NWSL', 'MLB'],
    themeDescription: 'The sovereign zenith of summer sports. Caitlin Clark and A\'ja Wilson lead the WNBA crusade alongside world-class women\'s soccer and midsummer baseball showcases.',
    arenaHazard: 'Solar Flare Radiance (All abilities cost 1 less AP during the 1st round)',
    seasonProgressWeeks: 10,
    currentWeek: 1,
    sportBuffs: [
      { sport: 'WNBA', buffName: 'Valkyrie Sovereign Glory', description: '+35% all stats and golden aura bonus points', bonusMultiplier: 1.35 },
      { sport: 'NWSL', buffName: 'World Stage Velocity', description: '+25% stamina recovery and slide tackle reach', bonusMultiplier: 1.25 },
      { sport: 'MLB', buffName: 'All-Star Moonshots', description: '+20% distance on power hits', bonusMultiplier: 1.20 }
    ]
  }
];

// Helper to construct abilities based on sport and player archetype
export function generateFighterAbilities(player: SportsPlayer): FighterAbility[] {
  const abilities: FighterAbility[] = [];
  const pName = player.name.toLowerCase();

  // Basic sports strike for everyone
  abilities.push({
    id: `${player.id}-basic`,
    name: player.league === 'NFL' ? 'Tackle & Stiff Arm' :
          player.league === 'NBA' || player.league === 'WNBA' ? 'Drive & Crossover Slam' :
          player.league === 'MLB' ? 'Line-Drive Slug' :
          player.league === 'NHL' ? 'Slapshot Check' : 'Curved Precision Volley',
    sportSource: player.league,
    category: 'STRIKE',
    description: `Standard athletic offensive clash utilizing ${player.league} fundamentals.`,
    apCost: 1,
    cooldownTurns: 0,
    currentCooldown: 0,
    d20Bonus: player.fantasyTier === 1 ? 4 : 2,
    damageRange: [18, 28],
    effectSummary: 'Direct physical athletic damage'
  });

  // Unique signature abilities tailored to iconic multi-sport superstars
  if (pName.includes('mahomes')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'No-Look Arcane Spiral',
      sportSource: 'NFL',
      category: 'TACTICAL',
      description: 'Disorients the arena with a physics-defying sidearm pass that bypasses guards.',
      apCost: 2,
      cooldownTurns: 2,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [28, 42],
      effectSummary: 'Deals 35 dmg and grants Fast Break (+1 AP next turn)'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Arcane Hail Mary Javelin',
      sportSource: 'NFL',
      category: 'ULTIMATE',
      description: 'Launches a 70-yard thunderous javelin into the stratosphere, crashing onto the enemy club.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [50, 75],
      effectSummary: 'Massive blast + Knocks target back 20 yards'
    });
  } else if (pName.includes('caitlin') || pName.includes('clark')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Court Vision Laser Assist',
      sportSource: 'WNBA',
      category: 'TACTICAL',
      description: 'Threads a needle pass across three defenders, energizing the entire club.',
      apCost: 1,
      cooldownTurns: 2,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [22, 32],
      effectSummary: 'Buffs team accuracy and heals 15 HP'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Logo 3PT Comet Snipe',
      sportSource: 'WNBA',
      category: 'ULTIMATE',
      description: 'Pulls up from 38 feet out, raining an explosive arcane basketball down through the net!',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 7,
      damageRange: [55, 80],
      effectSummary: 'Ignores enemy defense shields & inflicts On Fire'
    });
  } else if (pName.includes('haaland')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Nordic Berserk Cleave',
      sportSource: 'EPL',
      category: 'STRIKE',
      description: 'Charges into the box like an unstoppable Norse warband, blasting a 90mph strike.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [35, 52],
      effectSummary: 'Heavy impact; doubles damage if target is below 50% HP'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Bicycle Kick Extinction Wave',
      sportSource: 'EPL',
      category: 'ULTIMATE',
      description: 'Leaps 8 feet into the air to unleash an airborne bicycle strike of apocalyptic velocity.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [60, 85],
      effectSummary: 'Shatters enemy armor and causes Stun'
    });
  } else if (pName.includes('ohtani')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: '102mph Arcane Fireball',
      sportSource: 'MLB',
      category: 'TACTICAL',
      description: 'Fires a blistering gyro-slider with wicked horizontal break.',
      apCost: 2,
      cooldownTurns: 2,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [30, 45],
      effectSummary: 'Blinds target, lowering their hit chance by 40%'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: '50/50 Dual Mastery Grand Slam',
      sportSource: 'MLB',
      category: 'ULTIMATE',
      description: 'Channeling both ace pitching and historic slugging, strikes a 470ft cataclysmic blast!',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 7,
      damageRange: [65, 90],
      effectSummary: 'Clears the bases: deals heavy damage + steals 1 AP'
    });
  } else if (pName.includes('wilson') || pName.includes("a'ja")) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Matriarch Sovereign Ward',
      sportSource: 'WNBA',
      category: 'DEFENSIVE',
      description: 'Erects an impenetrable golden shield around the club.',
      apCost: 2,
      cooldownTurns: 2,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [15, 25],
      effectSummary: 'Grants Matriarch Shield (Absorbs 45 damage)'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Unstoppable Paint Hammer Slam',
      sportSource: 'WNBA',
      category: 'ULTIMATE',
      description: 'Dominates the key with thunderous double-double majesty, crushing all who stand in the lane.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [50, 78],
      effectSummary: 'Heavy slam damage + Knocks out target for 1 turn'
    });
  } else if (pName.includes('curry')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Step-Back Mystic Splash',
      sportSource: 'NBA',
      category: 'STRIKE',
      description: 'Quick crossover into a high-arcing rainbow jumper.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [28, 44],
      effectSummary: 'Critical hit deals 1.5x damage'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Orbital Distance Rainstorm',
      sportSource: 'NBA',
      category: 'ULTIMATE',
      description: 'Rains three successive mystical 30-foot triples onto the enemy squad.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [52, 76],
      effectSummary: 'Hits all active enemy fighters'
    });
  } else if (pName.includes('mcdavid')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Hypersonic Ice Blitz',
      sportSource: 'NHL',
      category: 'TACTICAL',
      description: 'Accelerates to 25mph on razor skates, darting through opposing ranks.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [30, 45],
      effectSummary: 'Fast-break attack; cannot be blocked'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Power Play Deconstruction',
      sportSource: 'NHL',
      category: 'ULTIMATE',
      description: 'Carves up the defense with surgical stickhandling and roofed top-shelf wrist shot.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 7,
      damageRange: [54, 82],
      effectSummary: 'Top-shelf strike + gives team Berserk buff'
    });
  } else if (pName.includes('judge')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Bronx Bomber Cleave',
      sportSource: 'MLB',
      category: 'STRIKE',
      description: 'Unleashes a 115mph exit velocity swing that generates shockwaves.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [34, 50],
      effectSummary: 'Inflicts heavy Armor Break'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: '465ft Monument Park Moonshot',
      sportSource: 'MLB',
      category: 'ULTIMATE',
      description: 'Obliterates the sphere with titanic force, shattering the stadium lights.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [58, 86],
      effectSummary: 'Stuns the primary target for 1 turn'
    });
  } else if (pName.includes('kelce')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Red Zone Juggernaut',
      sportSource: 'NFL',
      category: 'STRIKE',
      description: 'Drags three tacklers across the goal-line through sheer grit.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [28, 44],
      effectSummary: 'Taunts target to attack Kelce next turn'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Spike of Triumph',
      sportSource: 'NFL',
      category: 'ULTIMATE',
      description: 'Spikes the football with enough force to crack bedrock, knocking back the frontline.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [48, 72],
      effectSummary: 'Area shockwave; disrupts opponent cast'
    });
  } else if (pName.includes('jokic') || pName.includes('jokić')) {
    abilities.push({
      id: `${player.id}-spec1`,
      name: 'Sombor Shuffle Fade',
      sportSource: 'NBA',
      category: 'STRIKE',
      description: 'Off-balance one-legged rainbow shot that arcs beyond the rafters.',
      apCost: 2,
      cooldownTurns: 1,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [26, 40],
      effectSummary: 'High arc; ignores defensive block'
    });
    abilities.push({
      id: `${player.id}-ult`,
      name: 'Oracle Triple-Double Symphony',
      sportSource: 'NBA',
      category: 'ULTIMATE',
      description: 'Coordinates the entire roster into flawless synchronized basketball mastery.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 6,
      damageRange: [40, 60],
      effectSummary: 'Deals 50 damage, restores 30 HP to all allies, grants +1 AP'
    });
  } else {
    // Standard archetype abilities for other players
    abilities.push({
      id: `${player.id}-archetype-tactical`,
      name: `${player.rpgClass} Tactical Maneuver`,
      sportSource: player.league,
      category: 'TACTICAL',
      description: `Executes a masterclass play rooted in ${player.synergyTrait}.`,
      apCost: 2,
      cooldownTurns: 2,
      currentCooldown: 0,
      d20Bonus: 4,
      damageRange: [24, 38],
      effectSummary: 'Deals tactical damage and applies Fast Break'
    });
    abilities.push({
      id: `${player.id}-archetype-ult`,
      name: `${player.synergyTrait.split('(')[0].trim()} Surge`,
      sportSource: player.league,
      category: 'ULTIMATE',
      description: 'Channels signature real-world athletic mastery into an all-out arena blitz.',
      apCost: 3,
      cooldownTurns: 3,
      currentCooldown: 0,
      d20Bonus: 5,
      damageRange: [45, 70],
      effectSummary: 'Major athletic burst damage'
    });
  }

  // Defensive Guard for everyone
  abilities.push({
    id: `${player.id}-guard`,
    name: 'Iron Defensive Stance',
    sportSource: player.league,
    category: 'DEFENSIVE',
    description: 'Plants feet, squares shoulders, and prepares to absorb the next incoming strike.',
    apCost: 1,
    cooldownTurns: 1,
    currentCooldown: 0,
    d20Bonus: 3,
    damageRange: [0, 0],
    effectSummary: 'Reduces next incoming damage by 50%'
  });

  return abilities;
}

// Convert a SportsPlayer into a Club Fighter
export function createClubFighter(
  player: SportsPlayer, 
  guild: { id: string; name: string }
): ClubFighter {
  const stats = player.stats;
  const ppg = stats.fantasyPointsPerGame || 15;

  // Scaling combat attributes from sports statistics
  const maxHp = Math.round(120 + (player.fantasyTier === 1 ? 40 : 20) + (ppg * 1.2));
  
  // STR: football yards/tackles, baseball HRs, soccer goals, hockey checks
  const str = Math.min(20, Math.round(10 + ((stats.rushingYards || 0) / 200) + ((stats.homeRuns || 0) / 5) + ((stats.goals || 0) / 3) + ((stats.blocks || 0) / 10)));
  
  // DEX: steals, assists, passing yards, 3-pointers, sprint agility
  const dex = Math.min(20, Math.round(10 + ((stats.steals || 0) / 4) + ((stats.assists || 0) / 25) + ((stats.passingYards || 0) / 500)));
  
  // CON: games played, stamina durability, minutes
  const con = Math.min(20, Math.round(10 + (stats.gamesPlayed / 6)));
  
  // IQ: assists, pass completion, court vision, playmaking
  const iq = Math.min(20, Math.round(11 + ((stats.assists || 0) / 30) + ((stats.passingTouchdowns || 0) / 4)));

  const abilities = generateFighterAbilities(player);

  return {
    id: `fighter-${player.id}-${guild.id}`,
    playerId: player.id,
    name: player.name,
    guildId: guild.id,
    guildName: guild.name,
    league: player.league,
    position: player.position,
    jerseyNumber: player.jerseyNumber,
    avatarUrl: player.avatarUrl,
    rpgClass: player.rpgClass,
    isWomensSports: player.isWomensSports,
    maxHp,
    currentHp: maxHp,
    ap: 3,
    maxAp: 3,
    str,
    dex,
    con,
    iq,
    abilities,
    statusEffects: player.secretPerkActive ? [
      { type: 'MATRIARCH_SHIELD', turnsRemaining: 3, description: '👑 Sovereign perk active (+15 shield)' }
    ] : [],
    statSummary: `${player.position} | ${player.league} - ${ppg.toFixed(1)} FPPG`
  };
}

// Initial Deathball Battle Royale State generator
export function createInitialDeathballState(guilds: Array<{ id: string; name: string; bannerColor?: string }>): DeathballState {
  const scores: Record<string, any> = {};
  const defaultColors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'];

  guilds.slice(0, 4).forEach((g, idx) => {
    scores[g.id] = {
      guildId: g.id,
      guildName: g.name,
      color: g.bannerColor || defaultColors[idx % defaultColors.length],
      goals: 0,
      touchdowns: 0,
      homeruns: 0,
      threePointers: 0,
      tacklesOrSacks: 0,
      totalPoints: 0,
      eliminated: false,
      mvpPlay: 'Awaiting opening drop'
    };
  });

  return {
    round: 1,
    maxRounds: 8,
    ballCarrierFighterId: null,
    ballCarrierGuildId: guilds[0]?.id || 'guild-1',
    activeHazard: '⚡ Central Arcane Leyline (Passes over the midfield arc gain +3 yards of momentum)',
    scores,
    playLog: [
      {
        id: 'db-init-1',
        round: 1,
        text: 'The Arcane Deathball drops from the stadium rafters! A gleaming golden orb charged with Football leather, Basketball grip, Baseball seams, and Soccer aerotrac curves hums in the center circle.',
        sportType: 'HAZARD',
        points: 0,
        actorGuildId: guilds[0]?.id || 'guild-1',
        actorGuildName: guilds[0]?.name || 'Guild',
        actorPlayerName: 'The Commissioner'
      }
    ],
    isGameOver: false
  };
}

// Initial Fields of Torture Triathlon State generator
export function createInitialTriathlonState(
  guilds: Array<{ id: string; name: string; bannerColor?: string; crestIcon?: string }>,
  players: SportsPlayer[]
): TriathlonState {
  const defaultColors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'];
  const racers = guilds.slice(0, 4).map((g, idx) => {
    // Pick an iconic athlete for each club
    const candidatePlayer = players[idx % players.length] || players[0];
    return {
      guildId: g.id,
      guildName: g.name,
      color: g.bannerColor || defaultColors[idx % defaultColors.length],
      crest: g.crestIcon || '🛡️',
      racerPlayerName: candidatePlayer.name,
      sportLeague: candidatePlayer.league,
      currentStage: 1 as const,
      stageProgressPercent: 0,
      stamina: 100,
      paceMode: 'STEADY' as const,
      hazardsEncountered: [],
      splitTimeSeconds: 0,
      rank: idx + 1,
      finished: false,
      specialPerkUsed: false
    };
  });

  return {
    currentStage: 1,
    stageName: 'Stage 1: The Abyssal Rapids & Tempest Swim',
    stageSportFocus: 'CON & Swimming Stroke / Fluidity (EPL & WNBA Endurance Perks)',
    stageTerrainHazard: 'Whirlpool Churn: High water turbulence demands CON checks or 15% stamina drain',
    elapsedSeconds: 0,
    racers,
    eventLogs: [
      'The Horn of Olympus blares! The multi-club triathlon begins at the Abyssal Rapids starting pontoon.',
      'Racers dive headfirst into the freezing mountain runoff. The water elementals swirl around the buoys!'
    ],
    isFinished: false,
    podium: []
  };
}
