import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { fetchRealESPNScoreboards } from "./server/espnService";
import { INITIAL_TEAMS, INITIAL_PLAYERS, INITIAL_GAMES, INITIAL_CAMPAIGN, CAMPAIGN_MODIFIERS, INITIAL_WAGERS, INITIAL_NAGGING_MESSAGES } from "./src/data/sportsDatabase";
import { INITIAL_ACHIEVEMENT_BADGES, evaluateBadges } from "./src/data/achievementBadges";
import { LiveGame, FantasyCampaign, SportsPlayer, GuildMember, DraftPick, DraftSession, AchievementBadge, FriendlyWager, NaggingMessage } from "./src/types";

// Server-side in-memory mutable store for real-time campaign & sports tracking
let sportsTeams = [...INITIAL_TEAMS];
let sportsPlayers = [...INITIAL_PLAYERS];
let liveGames: LiveGame[] = JSON.parse(JSON.stringify(INITIAL_GAMES));
let currentCampaign: FantasyCampaign = JSON.parse(JSON.stringify(INITIAL_CAMPAIGN));
let achievementBadges: AchievementBadge[] = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENT_BADGES));
let friendlyWagers: FriendlyWager[] = JSON.parse(JSON.stringify(INITIAL_WAGERS));
let naggingMessages: NaggingMessage[] = JSON.parse(JSON.stringify(INITIAL_NAGGING_MESSAGES));
let northernSweepActive = false;

let currentDraftSession: DraftSession = {
  campaignId: currentCampaign.id,
  totalRounds: 6,
  timePerPickSeconds: 30,
  currentRound: 1,
  currentPickIndex: 0,
  isPaused: false,
  status: 'IN_PROGRESS',
  draftOrder: [
    { guildId: 'guild-1', guildName: 'Vanguard of Thunder' },
    { guildId: 'guild-2', guildName: 'Shadow Syndicate FC' },
    { guildId: 'guild-3', guildName: 'Titanium Kraken' }
  ],
  picks: []
};

// Safe Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 2. Sports Teams API
  app.get("/api/sports/teams", (req, res) => {
    const { league, search } = req.query;
    let filtered = [...sportsTeams];
    if (league && league !== 'ALL') {
      filtered = filtered.filter(t => t.league === league);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.city.toLowerCase().includes(q));
    }
    res.json({ teams: filtered });
  });

  // 3. Sports Players API
  app.get("/api/sports/players", (req, res) => {
    const { league, teamId, position, search } = req.query;
    let filtered = [...sportsPlayers];
    if (league && league !== 'ALL') {
      filtered = filtered.filter(p => p.league === league);
    }
    if (teamId) {
      filtered = filtered.filter(p => p.teamId === teamId);
    }
    if (position && position !== 'ALL') {
      filtered = filtered.filter(p => p.position.includes(position as string));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.teamShort.toLowerCase().includes(q) || p.rpgClass.toLowerCase().includes(q));
    }
    res.json({ players: filtered });
  });

  // 4. Live Games & Scores API (With Real-World ESPN Sync)
  app.get("/api/sports/live-games", async (req, res) => {
    // If query ?sync=true is provided or liveGames is initial seed, attempt ESPN sync
    if (req.query.sync === 'true') {
      try {
        const { games: espnGames, teams: espnTeams, source } = await fetchRealESPNScoreboards();
        if (espnGames.length > 0) {
          liveGames = espnGames;
        }
        if (espnTeams.length > 0) {
          sportsTeams = espnTeams;
        }
        return res.json({ games: liveGames, source });
      } catch (err) {
        console.warn("ESPN sync in live-games route failed:", err);
      }
    }
    res.json({ games: liveGames, source: 'SERVER_CACHE' });
  });

  // 4b. Explicit Real-Time ESPN Scoreboard Sync
  app.get("/api/sports/real-sync", async (req, res) => {
    try {
      const { games: espnGames, teams: espnTeams, source } = await fetchRealESPNScoreboards();
      if (espnGames.length > 0) {
        liveGames = espnGames;
      }
      if (espnTeams.length > 0) {
        sportsTeams = espnTeams;
      }
      res.json({ success: true, games: liveGames, teams: sportsTeams, source, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to sync ESPN feeds", message: err.message });
    }
  });

  // 5. Simulate Game Tick (Advances clocks, generates authentic play-by-play, updates fantasy points)
  app.post("/api/sports/simulate-tick", (req, res) => {
    const { gameId } = req.body;
    const targetGame = liveGames.find(g => g.id === gameId) || liveGames.find(g => g.status === 'LIVE');

    if (!targetGame) {
      return res.status(404).json({ error: "No active live game found" });
    }

    // Dynamic game tick simulation
    const randomScoreIncrement = Math.random() > 0.4;
    const isHome = Math.random() > 0.45;
    let ptsAdded = 0;

    if (targetGame.league === 'NFL') {
      ptsAdded = Math.random() > 0.7 ? 7 : (Math.random() > 0.5 ? 3 : 0);
    } else if (targetGame.league === 'NBA' || targetGame.league === 'WNBA') {
      ptsAdded = Math.random() > 0.3 ? 2 : 3;
    } else if (targetGame.league === 'EPL' || targetGame.league === 'NWSL') {
      ptsAdded = Math.random() > 0.85 ? 1 : 0;
    } else if (targetGame.league === 'MLB') {
      ptsAdded = Math.random() > 0.8 ? 1 : 0;
    }

    if (ptsAdded > 0) {
      if (isHome) {
        targetGame.homeScore += ptsAdded;
      } else {
        targetGame.awayScore += ptsAdded;
      }
    }

    // Generate dynamic play-by-play
    const samplePlaysNFL = [
      { desc: "P. Mahomes sidesteps rusher and lasers a 19-yd completion across the hash marks!", team: "nfl-kc", pid: "nfl-p-1", name: "Patrick Mahomes", fp: 1.8 },
      { desc: "C. McCaffrey powers between tackle and guard for a physical 9-yard gain.", team: "nfl-sf", pid: "nfl-p-3", name: "Christian McCaffrey", fp: 0.9 },
      { desc: "T. Kelce shields defensive back and grabs first-down grab over the middle.", team: "nfl-kc", pid: "nfl-p-2", name: "Travis Kelce", fp: 1.6 },
      { desc: "N. Bosa explodes off snap to pressure the pocket, forcing an incompletion!", team: "nfl-sf", pid: "nfl-p-4", name: "Nick Bosa", fp: 1.0 }
    ];

    const samplePlaysNBA = [
      { desc: "Jayson Tatum drives the baseline and unleashes a ferocious two-handed flush!", team: "nba-bos", pid: "nba-p-1", name: "Jayson Tatum", fp: 2.0 },
      { desc: "Stephen Curry pulls up from the logo—SPLASH! Arena in absolute shock!", team: "nba-gsw", pid: "nba-p-3", name: "Stephen Curry", fp: 3.5 }
    ];

    const samplePlaysWNBA = [
      { desc: "Caitlin Clark steps back from 34 feet and drills a cold-blooded logo triple! 👑 Valkyrie Boon triggered!", team: "wnba-ind", pid: "wnba-p-1", name: "Caitlin Clark", fp: 4.5 },
      { desc: "A'ja Wilson swats the shot, grabs rebound, and hits the turnaround fadeaway! 👑 Matriarch Perk active!", team: "wnba-lva", pid: "wnba-p-3", name: "A'ja Wilson", fp: 4.0 },
      { desc: "Sabrina Ionescu executes a surgical behind-the-back assist for the fastbreak bucket!", team: "wnba-nyl", pid: "wnba-p-4", name: "Sabrina Ionescu", fp: 3.0 }
    ];

    const samplePlaysNWSL = [
      { desc: "Sophia Smith executes an electrifying nutmeg and curls the ball into the top right corner! 👑 Rose City Boon!", team: "nwsl-por", pid: "nwsl-p-1", name: "Sophia Smith", fp: 6.0 },
      { desc: "Trinity Rodman burns past defender on the wing and crosses right onto the striker's boot!", team: "nwsl-was", pid: "nwsl-p-2", name: "Trinity Rodman", fp: 4.0 }
    ];

    const samplePlaysEPL = [
      { desc: "Bukayo Saka leaves defender frozen with lightning stepover and crosses dangerously!", team: "epl-ars", pid: "epl-p-1", name: "Bukayo Saka", fp: 1.5 },
      { desc: "Erling Haaland launches a rocket on target, goalkeeper parries out for corner!", team: "epl-mci", pid: "epl-p-3", name: "Erling Haaland", fp: 1.2 }
    ];

    let playPool = samplePlaysNFL;
    if (targetGame.league === 'NBA') playPool = samplePlaysNBA;
    if (targetGame.league === 'WNBA') playPool = samplePlaysWNBA;
    if (targetGame.league === 'NWSL') playPool = samplePlaysNWSL;
    if (targetGame.league === 'EPL') playPool = samplePlaysEPL;

    const chosenPlay = playPool[Math.floor(Math.random() * playPool.length)];

    // Check if player has women's sports secret perk
    const affectedPlayer = sportsPlayers.find(p => p.id === chosenPlay.pid);
    let finalFp = chosenPlay.fp;
    if (affectedPlayer?.isWomensSports) {
      // 20% secret perk multiplier
      finalFp = parseFloat((chosenPlay.fp * 1.2).toFixed(1));
    }

    const newPlay = {
      id: `play-${Date.now()}`,
      time: targetGame.clock,
      quarterOrPeriod: targetGame.period,
      description: chosenPlay.desc,
      teamId: chosenPlay.team,
      scoringPlay: ptsAdded > 0,
      fantasyPointsImpact: {
        playerId: chosenPlay.pid,
        playerName: chosenPlay.name,
        points: finalFp
      }
    };

    targetGame.plays.unshift(newPlay);
    if (targetGame.plays.length > 25) {
      targetGame.plays.pop();
    }

    // Update player live fantasy points
    if (affectedPlayer && affectedPlayer.liveGameStats) {
      affectedPlayer.liveGameStats.currentPoints = parseFloat((affectedPlayer.liveGameStats.currentPoints + finalFp).toFixed(1));
    }

    // Update active campaign matchup score
    const activeMatchup = currentCampaign.matchups.find(m => m.status === 'IN_PROGRESS');
    if (activeMatchup) {
      if (chosenPlay.pid === 'nfl-p-1' || chosenPlay.pid === 'nba-p-1' || chosenPlay.pid === 'epl-p-1' || chosenPlay.pid === 'wnba-p-1') {
        activeMatchup.homeScore = parseFloat((activeMatchup.homeScore + finalFp).toFixed(1));
      } else if (chosenPlay.pid === 'nfl-p-3' || chosenPlay.pid === 'epl-p-3' || chosenPlay.pid === 'nba-p-3' || chosenPlay.pid === 'wnba-p-3') {
        activeMatchup.awayScore = parseFloat((activeMatchup.awayScore + finalFp).toFixed(1));
      }
    }

    // Re-evaluate badges after play impact
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      { northernSweepActive }
    ).updatedBadges;

    res.json({ success: true, game: targetGame, newPlay, matchup: activeMatchup, badges: achievementBadges });
  });

  // 6. Campaign Hub API
  app.get("/api/campaigns/active", (req, res) => {
    res.json({ campaign: currentCampaign });
  });

  // 7. User-to-User Invite API
  app.post("/api/campaigns/invite", (req, res) => {
    const { guildId, newMemberName, newMemberEmail, role } = req.body;
    const guild = currentCampaign.guilds.find(g => g.id === guildId);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const roleTitles: Record<string, string> = {
      'GUILD_MASTER': 'Guildmaster Strategist',
      'OFFENSE_COORDINATOR': 'Offensive Commander',
      'DEFENSE_TACTICIAN': 'Iron Wall Captain',
      'SCOUT_SPECIALIST': 'Grand Scout Specialist'
    };

    const colors = ['bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-cyan-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember: GuildMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName || 'Invited Comrade',
      email: newMemberEmail || 'teammate@realm.net',
      avatarColor: randomColor,
      role: role || 'SCOUT_SPECIALIST',
      roleTitle: roleTitles[role] || 'Tactical Specialist',
      assignedPlayerIds: [],
      tacticalXP: 250,
      prestigeRank: 'Recruit Strategist'
    };

    guild.members.push(newMember);
    res.json({ success: true, member: newMember, guild });
  });

  // 8. Assign Player to Co-Manager
  app.post("/api/campaigns/assign-manager-player", (req, res) => {
    const { guildId, memberId, playerId } = req.body;
    const guild = currentCampaign.guilds.find(g => g.id === guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    // Remove player from other members in this guild first
    guild.members.forEach(m => {
      m.assignedPlayerIds = m.assignedPlayerIds.filter(id => id !== playerId);
    });

    const targetMember = guild.members.find(m => m.id === memberId);
    if (targetMember) {
      targetMember.assignedPlayerIds.push(playerId);
      targetMember.tacticalXP += 50; // XP reward for assigning command
    }

    res.json({ success: true, guild });
  });

  // 9. D&D Dice Roll for Campaign Event Modifier
  app.post("/api/campaigns/roll-dice", (req, res) => {
    const { matchupId, modifierId } = req.body;
    const matchup = currentCampaign.matchups.find(m => m.id === matchupId);
    const modifier = CAMPAIGN_MODIFIERS.find(m => m.id === modifierId) || CAMPAIGN_MODIFIERS[0];

    const d20 = Math.floor(Math.random() * 20) + 1;
    const success = d20 >= (modifier.diceRollRequired || 12);

    let resultNarrative = "";
    if (success) {
      resultNarrative = `NATURAL ${d20}! The dice favored your syndicate! ${modifier.name} activated its celestial buff: ${modifier.buffDescription}.`;
      if (matchup) {
        matchup.homeScore = parseFloat((matchup.homeScore + 5.0).toFixed(1));
      }
    } else {
      resultNarrative = `Rolled a ${d20} (Needed ${modifier.diceRollRequired}). The weather turned treacherous! ${modifier.debuffDescription}.`;
    }

    if (matchup) {
      matchup.storyNarrative = resultNarrative;
      matchup.activeModifier = modifier;
    }

    // Evaluate badges with dice context
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      {
        lastDiceRoll: d20,
        diceSuccess: success,
        northernSweepActive
      }
    ).updatedBadges;

    res.json({ d20, success, narrative: resultNarrative, matchup, badges: achievementBadges });
  });

  // 10. Achievements API
  app.get("/api/achievements", (req, res) => {
    // Refresh badges based on latest data
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      { northernSweepActive }
    ).updatedBadges;
    res.json({
      badges: achievementBadges,
      northernSweepActive
    });
  });

  // 11. Northern Sweep Seasonal Environmental Override Trigger
  app.post("/api/campaigns/trigger-northern-sweep", (req, res) => {
    northernSweepActive = !northernSweepActive;

    const activeMatchup = currentCampaign.matchups.find(m => m.status === 'IN_PROGRESS') || currentCampaign.matchups[0];
    const winterLizardModifier = CAMPAIGN_MODIFIERS.find(m => m.id === 'mod-winter-lizard') || CAMPAIGN_MODIFIERS[0];
    const normalModifier = CAMPAIGN_MODIFIERS[0];

    if (activeMatchup) {
      if (northernSweepActive) {
        activeMatchup.activeModifier = winterLizardModifier;
        activeMatchup.weatherOrRealmCondition = "Winter Lizard Frost Surge (26°F) - Northern Dominance";
        activeMatchup.storyNarrative = "A mythical cold front sweeps south as the Northern Canadian NHL division sweeps their series! The arena drops to 26°F.";
      } else {
        activeMatchup.activeModifier = normalModifier;
        activeMatchup.weatherOrRealmCondition = "Sunbaked Arrowhead Caldera (88°F)";
        activeMatchup.storyNarrative = "The September sun returns to bake the open-air stadiums in 88°F sweltering heat.";
      }
    }

    // Update venueEnvironments for live games
    liveGames.forEach(game => {
      if (game.venueEnvironment) {
        game.venueEnvironment.northernSweepActive = northernSweepActive;
        if (northernSweepActive) {
          game.venueEnvironment.temperatureF = 26;
          game.venueEnvironment.weatherCondition = "Winter Lizard Frost Surge";
          game.venueEnvironment.environmentalBuff = "+25% Adamantine Armor & Goalie Saves in Sub-Zero Chill";
          game.venueEnvironment.environmentalDebuff = "-15% Deep passing precision in freezing blizzard";
        } else {
          // Restore default September heat
          if (game.venueEnvironment.stadium.includes('Arrowhead')) {
            game.venueEnvironment.temperatureF = 88;
            game.venueEnvironment.weatherCondition = "Sunbaked High Heat & Humidity (Late Summer)";
            game.venueEnvironment.environmentalBuff = "+10% Fire Damage / Explosive YAC";
            game.venueEnvironment.environmentalDebuff = "-15% Fourth-quarter stamina decay";
          } else if (game.venueEnvironment.stadium.includes('Rogers')) {
            game.venueEnvironment.temperatureF = 58;
            game.venueEnvironment.weatherCondition = "Mild Canadian Autumn Evening";
            game.venueEnvironment.environmentalBuff = "+15% Slapshot velocity on pristine indoor ice";
            game.venueEnvironment.environmentalDebuff = "None (Indoor climate controlled)";
          } else if (game.venueEnvironment.stadium.includes('Etihad')) {
            game.venueEnvironment.temperatureF = 64;
            game.venueEnvironment.weatherCondition = "Classic British Drizzle & Slick Turf";
            game.venueEnvironment.environmentalBuff = "+15% Through-ball skid velocity on wet grass";
            game.venueEnvironment.environmentalDebuff = "-10% Goalkeeper handling grip";
          }
        }
      }
    });

    // Re-evaluate badges
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      { northernSweepActive }
    ).updatedBadges;

    res.json({
      success: true,
      northernSweepActive,
      campaign: currentCampaign,
      liveGames,
      badges: achievementBadges,
      message: northernSweepActive 
        ? "Winter Lizard Unleashed! The Northern Team sweep has triggered an unseasonable polar frost!" 
        : "Sunbaked Autumn Restored! Standard September heat resumed."
    });
  });

  // 12. Friendly Wagers API
  app.get("/api/wagers", (req, res) => {
    res.json({
      wagers: friendlyWagers,
      userGuild: currentCampaign.guilds[0]
    });
  });

  app.post("/api/wagers/create", (req, res) => {
    const {
      proposingGuildId,
      targetGuildId,
      wagerType,
      title,
      description,
      wagerPoints,
      potentialRewardPoints,
      gutterPenaltyDescription
    } = req.body;

    const proposingGuild = currentCampaign.guilds.find(g => g.id === proposingGuildId) || currentCampaign.guilds[0];
    const targetGuild = currentCampaign.guilds.find(g => g.id === targetGuildId) || currentCampaign.guilds[1];

    const points = Number(wagerPoints) || 50;
    const reward = Number(potentialRewardPoints) || (points * 2);

    const newWager: FriendlyWager = {
      id: `wager-${Date.now()}`,
      proposingGuildId: proposingGuild.id,
      proposingGuildName: proposingGuild.name,
      proposingManagerName: proposingGuild?.members?.[0]?.name || 'Guildmaster',
      targetGuildId: targetGuild.id,
      targetGuildName: targetGuild.name,
      wagerType: wagerType || 'MATCHUP_DUEL',
      title: title || 'High-Stakes Guild Duel',
      description: description || `Wagers ${points} fantasy points on glory vs gutter ruin!`,
      wagerPoints: points,
      potentialRewardPoints: reward,
      gutterPenaltyDescription: gutterPenaltyDescription || 'Plummet straight to the sewer gutter like a street rat begging for mercy!',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    friendlyWagers.unshift(newWager);

    // Friendly nagging banter injected to square
    const nagAlert: NaggingMessage = {
      id: `nag-${Date.now()}`,
      senderGuildId: proposingGuild.id,
      senderGuildName: proposingGuild.name,
      senderManagerName: proposingGuild?.members?.[0]?.name || 'Guildmaster',
      targetGuildId: targetGuild.id,
      targetGuildName: targetGuild.name,
      text: `⚔️ AUDACIOUS WAGER: "${newWager.title}" for ${newWager.wagerPoints} PTS! Soar to the stars or dine on gutter sewage!`,
      emoji: '⚔️',
      timestamp: 'Just now',
      reactions: [{ emoji: '🔥', count: 1 }, { emoji: '🐀', count: 1 }]
    };
    naggingMessages.unshift(nagAlert);

    res.json({ success: true, wager: newWager, wagers: friendlyWagers });
  });

  app.post("/api/wagers/resolve", (req, res) => {
    const { wagerId, outcome } = req.body; // 'WON' | 'LOST'
    const wager = friendlyWagers.find(w => w.id === wagerId);
    if (!wager) return res.status(404).json({ error: "Wager not found" });

    const proposingGuild = currentCampaign.guilds.find(g => g.id === wager.proposingGuildId) || currentCampaign.guilds[0];
    const targetGuild = currentCampaign.guilds.find(g => g.id === wager.targetGuildId) || currentCampaign.guilds[1];

    wager.status = outcome === 'WON' ? 'WON' : 'LOST';
    wager.resolvedAt = new Date().toISOString();

    let narrative = '';

    if (outcome === 'WON') {
      // Proposing guild soars to the skies!
      proposingGuild.campaignStats.totalPoints = parseFloat((proposingGuild.campaignStats.totalPoints + wager.potentialRewardPoints).toFixed(1));
      proposingGuild.gutterStatus = 'HIGH_ROLLER';
      proposingGuild.wagerWinStreak = (proposingGuild.wagerWinStreak || 0) + 1;

      // Target guild plummets!
      let ptsLost = wager.wagerPoints;
      let shieldUsed = false;
      if (targetGuild.womensSportsPerks?.matriarchShieldAvailable) {
        ptsLost = Math.floor(ptsLost / 2);
        shieldUsed = true;
        wager.secretValkyrieShieldApplied = true;
      }

      targetGuild.campaignStats.totalPoints = Math.max(0, parseFloat((targetGuild.campaignStats.totalPoints - ptsLost).toFixed(1)));
      targetGuild.gutterStatus = 'STREET_RAT';
      targetGuild.streetRatReason = `Plunged into the gutter after losing ${wager.wagerPoints} pt wager "${wager.title}"!`;
      targetGuild.beggingPleaCount = 0;
      wager.streetRatTriggered = true;

      narrative = `TRIUMPH! ${proposingGuild.name} claimed +${wager.potentialRewardPoints} PTS and soared to the stars as HIGH ROLLERS! ${targetGuild.name} plummeted into the sewer gutter like a street rat begging for mercy${shieldUsed ? ' (Valkyrie Aegis absorbed half the point shock!)' : ''}!`;
    } else {
      // Proposing guild loses and plummets!
      let ptsLost = wager.wagerPoints;
      let shieldUsed = false;
      if (proposingGuild.womensSportsPerks?.matriarchShieldAvailable) {
        ptsLost = Math.floor(ptsLost / 2);
        shieldUsed = true;
        wager.secretValkyrieShieldApplied = true;
      }

      proposingGuild.campaignStats.totalPoints = Math.max(0, parseFloat((proposingGuild.campaignStats.totalPoints - ptsLost).toFixed(1)));
      proposingGuild.gutterStatus = 'STREET_RAT';
      proposingGuild.streetRatReason = `Audacious wager "${wager.title}" collapsed! Plunged into the sewer gutter!`;
      proposingGuild.beggingPleaCount = 0;
      proposingGuild.wagerWinStreak = 0;
      wager.streetRatTriggered = true;

      targetGuild.campaignStats.totalPoints = parseFloat((targetGuild.campaignStats.totalPoints + wager.potentialRewardPoints).toFixed(1));
      targetGuild.gutterStatus = 'HIGH_ROLLER';

      narrative = `DISASTER! ${proposingGuild.name} plummet into the gutter like a street rat begging for mercy${shieldUsed ? ' (Valkyrie Aegis softened the blow!)' : ''}! ${targetGuild.name} soars to the skies with +${wager.potentialRewardPoints} PTS!`;
    }

    wager.outcomeNarrative = narrative;

    // Begging for mercy message
    const nagPlea: NaggingMessage = {
      id: `nag-${Date.now()}`,
      senderGuildId: outcome === 'WON' ? targetGuild.id : proposingGuild.id,
      senderGuildName: outcome === 'WON' ? targetGuild.name : proposingGuild.name,
      senderManagerName: outcome === 'WON' ? (targetGuild?.members?.[0]?.name || 'Fallen Manager') : (proposingGuild?.members?.[0]?.name || 'Fallen Manager'),
      targetGuildId: outcome === 'WON' ? proposingGuild.id : targetGuild.id,
      targetGuildName: outcome === 'WON' ? proposingGuild.name : targetGuild.name,
      text: outcome === 'WON'
        ? `🐭😭 "Spare us, Grand High Rollers! We wagered too boldly and the gutter is freezing! Toss us a crumb of mercy!"`
        : `🐭😭 "The dice crushed us! We are huddled in the street rat alley, begging for stale cheddar!"`,
      emoji: '🐀',
      isBeggingForMercy: true,
      mercyGranted: false,
      gifUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&auto=format&fit=crop&q=80',
      gifTitle: 'Street rat begging for mercy GIF',
      timestamp: 'Just now',
      reactions: [{ emoji: '🧀', count: 5 }, { emoji: '😂', count: 4 }]
    };
    naggingMessages.unshift(nagPlea);

    // Re-evaluate badges
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      {
        lastWagerWon: outcome === 'WON',
        lastWagerLost: outcome === 'LOST',
        lastWagerPoints: wager.wagerPoints
      }
    ).updatedBadges;

    res.json({
      success: true,
      wager,
      campaign: currentCampaign,
      badges: achievementBadges,
      narrative
    });
  });

  // 13. Friendly Nagging & Chat API
  app.get("/api/nagging", (req, res) => {
    res.json({ messages: naggingMessages });
  });

  app.post("/api/nagging/send", (req, res) => {
    const { senderGuildId, targetGuildId, text, emoji, gifUrl, gifTitle, isBeggingForMercy } = req.body;
    const sender = currentCampaign.guilds.find(g => g.id === senderGuildId) || currentCampaign.guilds[0];
    const target = currentCampaign.guilds.find(g => g.id === targetGuildId) || currentCampaign.guilds[1];

    const newMsg: NaggingMessage = {
      id: `nag-${Date.now()}`,
      senderGuildId: sender.id,
      senderGuildName: sender.name,
      senderManagerName: sender?.members?.[0]?.name || 'Guild Member',
      targetGuildId: target?.id,
      targetGuildName: target?.name,
      text: text || "Friendly smack talk in the sports realm!",
      emoji: emoji || '💬',
      gifUrl,
      gifTitle,
      isBeggingForMercy: !!isBeggingForMercy,
      mercyGranted: false,
      timestamp: 'Just now',
      reactions: [{ emoji: emoji || '🔥', count: 1 }]
    };

    naggingMessages.unshift(newMsg);

    // Re-evaluate badges for sending nag messages
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      { sentNagMessage: true }
    ).updatedBadges;

    res.json({ success: true, message: newMsg, messages: naggingMessages, badges: achievementBadges });
  });

  app.post("/api/nagging/react", (req, res) => {
    const { messageId, emoji } = req.body;
    const msg = naggingMessages.find(m => m.id === messageId);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    const existingReaction = msg.reactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      existingReaction.count += 1;
    } else {
      msg.reactions.push({ emoji, count: 1 });
    }

    res.json({ success: true, message: msg });
  });

  app.post("/api/nagging/grant-mercy", (req, res) => {
    const { messageId } = req.body;
    const msg = naggingMessages.find(m => m.id === messageId);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    msg.mercyGranted = true;
    const streetRatGuild = currentCampaign.guilds.find(g => g.id === msg.senderGuildId);
    if (streetRatGuild) {
      streetRatGuild.campaignStats.totalPoints = parseFloat((streetRatGuild.campaignStats.totalPoints + 10.0).toFixed(1));
      if (streetRatGuild.gutterStatus === 'STREET_RAT') {
        streetRatGuild.beggingPleaCount = (streetRatGuild.beggingPleaCount || 0) + 1;
        if (streetRatGuild.beggingPleaCount >= 2) {
          streetRatGuild.gutterStatus = 'NORMAL';
          streetRatGuild.streetRatReason = undefined;
        }
      }
    }

    const mercyReaction = msg.reactions.find(r => r.emoji === '🧀');
    if (mercyReaction) mercyReaction.count += 5;
    else msg.reactions.push({ emoji: '🧀', count: 5 });

    res.json({ success: true, message: msg, campaign: currentCampaign });
  });

  // 14. Foster Women's Sports Perks API
  app.post("/api/campaigns/foster-womens-sports", (req, res) => {
    const { guildId, playerId } = req.body;
    const guild = currentCampaign.guilds.find(g => g.id === guildId) || currentCampaign.guilds[0];
    const player = sportsPlayers.find(p => p.id === playerId);

    if (player && !guild.roster.some(p => p.id === player.id)) {
      guild.roster.push(player);
    }

    // Activate secret perks
    guild.womensSportsPerks = {
      active: true,
      secretMultiplier: 1.20,
      secretBonusPoints: (guild.womensSportsPerks?.secretBonusPoints || 0) + 25,
      matriarchShieldAvailable: true
    };
    guild.campaignStats.totalPoints = parseFloat((guild.campaignStats.totalPoints + 25.0).toFixed(1));

    // Evaluate badges
    achievementBadges = evaluateBadges(
      achievementBadges,
      currentCampaign,
      liveGames,
      sportsPlayers,
      { hasFosteredWomensPlayer: true }
    ).updatedBadges;

    res.json({
      success: true,
      guild,
      badges: achievementBadges,
      message: `👑 Secret Valkyrie Sovereign Ward Activated! +25 bonus secret points awarded, +20% fantasy point multiplier unlocked, and Matriarch Shield armed!`
    });
  });

  // 15. Draft Session API
  app.get("/api/draft/session", (req, res) => {
    res.json({ draftSession: currentDraftSession, availablePlayers: sportsPlayers.filter(p => !currentDraftSession.picks.some(pk => pk.player.id === p.id)) });
  });

  app.post("/api/draft/pick", (req, res) => {
    const { playerId, guildId, managerId } = req.body;
    const player = sportsPlayers.find(p => p.id === playerId);
    const guild = currentCampaign.guilds.find(g => g.id === guildId);

    if (!player || !guild) {
      return res.status(400).json({ error: "Invalid player or guild" });
    }

    const overallPick = currentDraftSession.picks.length + 1;
    const round = Math.floor((overallPick - 1) / currentDraftSession.draftOrder.length) + 1;
    const pickNumber = ((overallPick - 1) % currentDraftSession.draftOrder.length) + 1;

    const manager = guild.members.find(m => m.id === managerId) || guild?.members?.[0];

    const draftPick: DraftPick = {
      round,
      pickNumber,
      overallPick,
      guildId: guild.id,
      guildName: guild.name,
      managerId: manager?.id,
      managerName: manager?.name,
      player,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      commissionerGrade: player.fantasyTier === 1 ? 'A+' : (player.fantasyTier === 2 ? 'A' : 'B+')
    };

    currentDraftSession.picks.push(draftPick);

    // Add to guild roster if not already present
    if (!guild.roster.some(p => p.id === player.id)) {
      guild.roster.push(player);
    }
    if (manager && !manager.assignedPlayerIds.includes(player.id)) {
      manager.assignedPlayerIds.push(player.id);
      manager.tacticalXP += 100;
    }

    currentDraftSession.currentPickIndex = (currentDraftSession.currentPickIndex + 1) % currentDraftSession.draftOrder.length;
    currentDraftSession.currentRound = round;

    res.json({ success: true, draftPick, draftSession: currentDraftSession, guild });
  });

  // 16. Update Guild / Club Profile
  app.post("/api/campaigns/update-guild", (req, res) => {
    const { guild } = req.body;
    if (!guild || !guild.id) return res.status(400).json({ error: "Invalid guild payload" });

    const idx = currentCampaign.guilds.findIndex(g => g.id === guild.id);
    if (idx !== -1) {
      currentCampaign.guilds[idx] = { ...currentCampaign.guilds[idx], ...guild };
    } else {
      currentCampaign.guilds.push(guild);
    }
    res.json({ success: true, guild: currentCampaign.guilds[idx !== -1 ? idx : currentCampaign.guilds.length - 1], campaign: currentCampaign });
  });

  // 17. Import Campaign State
  app.post("/api/campaigns/import", (req, res) => {
    const { campaign } = req.body;
    if (!campaign || !campaign.id || !Array.isArray(campaign.guilds)) {
      return res.status(400).json({ error: "Invalid campaign schema" });
    }
    currentCampaign = campaign;
    res.json({ success: true, campaign: currentCampaign });
  });

  // 18. Arena Record Match & Award Renown
  app.post("/api/arena/record-match", (req, res) => {
    const { mode, winnerGuildId, summary, pointsAwarded = 15 } = req.body;
    const winner = currentCampaign.guilds.find(g => g.id === winnerGuildId);

    if (winner) {
      winner.campaignStats.totalPoints = parseFloat((winner.campaignStats.totalPoints + pointsAwarded).toFixed(1));
      winner.campaignStats.wins += 1;
      
      // Upgrade prestige rank if points threshold reached
      if (winner.campaignStats.totalPoints >= 300) {
        winner.members?.forEach(m => m.prestigeRank = 'Legendary Champion');
      } else if (winner.campaignStats.totalPoints >= 150) {
        winner.members?.forEach(m => m.prestigeRank = 'Colosseum Veteran');
      }
    }

    res.json({ success: true, winner, campaign: currentCampaign });
  });

  // 11. Commissioner AI Intelligence (Gemini API server-side integration)
  app.post("/api/commissioner/commentary", async (req, res) => {
    const { prompt, contextType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality contextual fallback if API key is not yet set
      const fallbacks = [
        "By the sacred decree of the Grand Sports Realm, the Vanguard's tactical execution in the 4th quarter has ruptured the defensive wards of the Colosseum! Mahomes wields the pigskin with surgical precision.",
        "A tactical triumph! With the ground attack supercharged by the blizzard, managing your running backs under the Offensive Coordinator role grants your guild massive leverage.",
        "The celestial alignment favors perimeter snipers this game-week. Observe Tatum's lethal step-back arc—warlock strike mechanics in full effect!"
      ];
      const selected = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({
        commentary: selected,
        poweredBy: "Realm Campaign Engine"
      });
    }

    try {
      const systemInstruction = `You are Arch-Commissioner Vorath, an epic and witty Dungeon Master for 'Realm of Champions', a D&D-style fantasy sports campaign.
You blend genuine sports expertise across NFL, NBA, EPL, and MLB with D&D tabletop terminology (spell slots, critical hits, saving throws, dungeon modifiers, party roles).
Keep responses energetic, witty, tactical, and concise (under 120 words).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt || "Provide a tactical assessment of the current sports campaign week and advice for the co-managing guildmasters.",
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });

      res.json({
        commentary: response.text || "The dice of destiny roll silent for now.",
        poweredBy: "Gemini 3.8 Flash (AI Dungeon Master)"
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.json({
        commentary: "Arch-Commissioner Vorath observes from the Astral Citadel: 'Maintain party coordination across positions and guard the perimeter!'",
        poweredBy: "Realm Campaign Engine (Fallback)"
      });
    }
  });

  // 12. Commissioner AI Draft Scouting Advice
  app.post("/api/commissioner/scout", async (req, res) => {
    const { currentRoster, availablePlayers, guildName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        scoutReport: {
          targetPlayer: availablePlayers?.[0]?.name || "Patrick Mahomes",
          analysis: "Strong synergy with your Offensive Coordinator role. High floor fantasy production with elite clutch traits.",
          tacticalRecommendation: "Draft an elite playmaker early to anchor your weekly mana/points pool."
        }
      });
    }

    try {
      const prompt = `Analyze this fantasy sports draft situation for Guild '${guildName || 'Vanguard'}':
Current roster size: ${currentRoster?.length || 0}.
Top available prospects: ${availablePlayers?.slice(0, 5).map((p: any) => `${p.name} (${p.league} ${p.position} - Tier ${p.fantasyTier})`).join(', ')}.
Provide a recommendation for which player to draft next, why they fit the guild's party synergy, and their tactical D&D value.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite fantasy sports scout and D&D Campaign Master. Be concise, insightful, and strategic (under 100 words).",
          temperature: 0.7
        }
      });

      res.json({
        scoutReport: {
          targetPlayer: availablePlayers?.[0]?.name || "Top Prospect",
          analysis: response.text || "Draft highest fantasy floor available.",
          tacticalRecommendation: "Execute selection before the timer ticks down."
        }
      });
    } catch (err: any) {
      console.error("Gemini scout error:", err);
      res.json({
        scoutReport: {
          targetPlayer: availablePlayers?.[0]?.name || "Shohei Ohtani",
          analysis: "Two-way legendary trait yields multi-sport tactical versatility.",
          tacticalRecommendation: "Draft for high ceiling."
        }
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
