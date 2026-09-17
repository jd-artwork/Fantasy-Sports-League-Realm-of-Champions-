import React, { useState, useEffect } from 'react';
import { 
  Flame, Trophy, Zap, Play, Pause, RotateCcw, AlertTriangle, 
  Sparkles, Swords, Activity, Crown, Shield, Dices
} from 'lucide-react';
import { DeathballState, DeathballPlayLog, DeathballScore, SportsPlayer } from '../types';
import { createInitialDeathballState } from '../data/battleArenaDatabase';
import { playWhistleSound, playCriticalFanfare, playDiceRollSound, playUiClick } from '../utils/audioSynth';

interface Props {
  guilds: Array<{ id: string; name: string; bannerColor?: string; crestIcon?: string; roster?: string[] }>;
  players: SportsPlayer[];
  onRecordMatch?: (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => void;
}

export const DeathballBattleRoyale: React.FC<Props> = ({ guilds, players, onRecordMatch }) => {
  const [gameState, setGameState] = useState<DeathballState>(() => createInitialDeathballState(guilds));
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);
  const [multiballActive, setMultiballActive] = useState<boolean>(false);

  // Play generation options combining Football, Basketball, Baseball, and Soccer
  const generateRandomPlay = (state: DeathballState): { log: DeathballPlayLog; updatedState: DeathballState } => {
    const activeGuilds = guilds.slice(0, 4);
    const actorGuild = activeGuilds[Math.floor(Math.random() * activeGuilds.length)] || activeGuilds[0];
    
    // Pick superstar athlete from that guild or player pool
    const pool = players.filter(p => p.league === 'NFL' || p.league === 'NBA' || p.league === 'MLB' || p.league === 'EPL' || p.league === 'WNBA');
    const randomAthlete = pool[Math.floor(Math.random() * pool.length)] || players[0];

    const playTypes: Array<'FOOTBALL' | 'BASKETBALL' | 'BASEBALL' | 'SOCCER'> = ['FOOTBALL', 'BASKETBALL', 'BASEBALL', 'SOCCER'];
    const chosenType = playTypes[Math.floor(Math.random() * playTypes.length)];

    let playText = '';
    let points = 0;
    const scoreUpdate = { ...state.scores[actorGuild.id] };

    switch (chosenType) {
      case 'FOOTBALL': {
        const isTD = Math.random() > 0.4;
        if (isTD) {
          points = 6;
          scoreUpdate.touchdowns += 1;
          scoreUpdate.totalPoints += 6;
          playText = `🏈 TOUCHDOWN! ${randomAthlete.name} (${randomAthlete.league}) snatches the Deathball from midair, stiff-arms two rival defenders, and dives across the goal-line into the endzone! (+6 PTS)`;
        } else {
          points = 2;
          scoreUpdate.tacklesOrSacks += 1;
          scoreUpdate.totalPoints += 2;
          playText = `💥 BLINDSIDE SACK! ${randomAthlete.name} delivers an earth-shattering tackle at midfield, dislodging the Deathball and denying a score! (+2 PTS)`;
        }
        break;
      }
      case 'SOCCER': {
        const isGoal = Math.random() > 0.35;
        if (isGoal) {
          points = 5;
          scoreUpdate.goals += 1;
          scoreUpdate.totalPoints += 5;
          playText = `⚽ BICYCLE KICK STRIKE! ${randomAthlete.name} launches into an airborne scissor kick, curving the Deathball at 85mph past the arcane forcefield into the upper 90! (+5 PTS)`;
        } else {
          points = 2;
          scoreUpdate.tacklesOrSacks += 1;
          scoreUpdate.totalPoints += 2;
          playText = `🛡️ SLIDING SWEEP! ${randomAthlete.name} executes a pitch-perfect slide tackle on the wet grass, kicking the Deathball back into open play! (+2 PTS)`;
        }
        break;
      }
      case 'BASEBALL': {
        const isHR = Math.random() > 0.4;
        if (isHR) {
          points = 4;
          scoreUpdate.homeruns += 1;
          scoreUpdate.totalPoints += 4;
          playText = `⚾ GRAND SLAM MOONSHOT! ${randomAthlete.name} swings a club bat and blasts the Deathball 460ft out of the colosseum diamond over the high perimeter fence! (+4 PTS)`;
        } else {
          points = 2;
          scoreUpdate.totalPoints += 2;
          playText = `🎯 102MPH FASTBALL STRIKEOUT! ${randomAthlete.name} paints the corner of the strike zone, picking off the advancing runner at home plate! (+2 PTS)`;
        }
        break;
      }
      case 'BASKETBALL': {
        const isDunk = Math.random() > 0.5;
        if (isDunk) {
          points = 3;
          scoreUpdate.threePointers += 1;
          scoreUpdate.totalPoints += 3;
          playText = `🏀 LOGO 3-POINTER DRAIN! ${randomAthlete.name} pulls up from the midfield logo and splashes a rainbow 38-foot arcane bomb clean through the net! (+3 PTS)`;
        } else {
          points = 3;
          scoreUpdate.threePointers += 1;
          scoreUpdate.totalPoints += 3;
          playText = `🔥 BACKBOARD-SHATTERING DUNK! ${randomAthlete.name} catches an alley-oop in the key, throwing down a two-handed tomahawk slam that rocks the backboard! (+3 PTS)`;
        }
        break;
      }
    }

    if (multiballActive) {
      points *= 2;
      scoreUpdate.totalPoints += points / 2; // add bonus
      playText += ` [🔥 MULTIBALL 2X MULTIPLIER!]`;
    }

    scoreUpdate.mvpPlay = `${randomAthlete.name} (${chosenType})`;

    const newLog: DeathballPlayLog = {
      id: `db-play-${Date.now()}-${Math.random()}`,
      round: state.round,
      text: playText,
      sportType: chosenType,
      points,
      actorGuildId: actorGuild.id,
      actorGuildName: actorGuild.name,
      actorPlayerName: randomAthlete.name
    };

    const nextRound = state.round >= state.maxRounds ? state.round : state.round + 1;
    const isOver = state.round >= state.maxRounds;

    // Find current winning guild
    const allScores = { ...state.scores, [actorGuild.id]: scoreUpdate };
    let leaderId = actorGuild.id;
    let maxPts = -1;
    (Object.values(allScores) as DeathballScore[]).forEach(sc => {
      if (sc.totalPoints > maxPts) {
        maxPts = sc.totalPoints;
        leaderId = sc.guildId;
      }
    });

    const updatedState: DeathballState = {
      ...state,
      round: nextRound,
      ballCarrierGuildId: actorGuild.id,
      scores: allScores,
      playLog: [newLog, ...state.playLog],
      isGameOver: isOver,
      winningGuildId: isOver ? leaderId : undefined
    };

    if (points > 0) {
      playWhistleSound();
    }

    if (isOver && leaderId) {
      playCriticalFanfare();
      if (onRecordMatch) {
        onRecordMatch({
          mode: 'DEATHBALL',
          winnerGuildId: leaderId,
          summary: `Won the 4-team Deathball Colosseum Championship!`,
          pointsAwarded: 25
        });
      }
    }

    return { log: newLog, updatedState };
  };

  const handleSimulateNextPlay = () => {
    if (gameState.isGameOver) return;
    playDiceRollSound();
    const { updatedState } = generateRandomPlay(gameState);
    setGameState(updatedState);
  };

  // Reset Deathball
  const handleResetGame = () => {
    setAutoSimulate(false);
    setMultiballActive(false);
    setGameState(createInitialDeathballState(guilds));
  };

  // Auto-simulate ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoSimulate && !gameState.isGameOver) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.isGameOver) {
            setAutoSimulate(false);
            return prev;
          }
          const { updatedState } = generateRandomPlay(prev);
          return updatedState;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSimulate, gameState.isGameOver, multiballActive]);

  // Sorted leaderboard
  const leaderBoard = (Object.values(gameState.scores) as DeathballScore[]).sort((a, b) => b.totalPoints - a.totalPoints);
  const leadingClub = leaderBoard[0];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              Battle Royale: The Arcane Deathball
            </span>
            <span className="text-xs text-amber-300 font-mono">
              Round {gameState.round} of {gameState.maxRounds}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-['Rajdhani'] mt-1">
            Multi-Sport Chaos: Football • Basketball • Baseball • Soccer
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            4 Fantasy Clubs clash simultaneously in a single colosseum for possession of the legendary Arcane Deathball!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-deathball-multiball"
            onClick={() => setMultiballActive(!multiballActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              multiballActive
                ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{multiballActive ? 'Multiball 2X Active!' : 'Trigger Multiball'}</span>
          </button>

          <button
            id="btn-deathball-auto"
            onClick={() => setAutoSimulate(!autoSimulate)}
            disabled={gameState.isGameOver}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
              autoSimulate
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {autoSimulate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoSimulate ? 'Pause Ticker' : 'Auto-Play'}</span>
          </button>

          <button
            id="btn-deathball-next"
            onClick={handleSimulateNextPlay}
            disabled={gameState.isGameOver || autoSimulate}
            className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Drive</span>
          </button>

          <button
            id="btn-deathball-reset"
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Winner Banner if Game Over */}
      {gameState.isGameOver && leadingClub && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border border-amber-500/60 shadow-2xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                Deathball Champions
              </span>
              <h3 className="text-xl font-black text-white font-['Rajdhani'] uppercase">
                {leadingClub.guildName} takes the Crown with {leadingClub.totalPoints} Points!
              </h3>
            </div>
          </div>
          <button
            onClick={handleResetGame}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md"
          >
            Rematch Battle Royale
          </button>
        </div>
      )}

      {/* Central Interactive Pitch Map & Quad Zones */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 overflow-hidden min-h-[300px] flex flex-col items-center justify-center shadow-2xl">
        {/* Pitch Field Lines Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full border-2 border-emerald-400/40 rounded-xl m-4 flex items-center justify-center relative">
            <div className="w-44 h-44 rounded-full border-2 border-emerald-400/40" />
            <div className="absolute w-full h-[1px] bg-emerald-400/30" />
            <div className="absolute h-full w-[1px] bg-emerald-400/30" />
          </div>
        </div>

        {/* 4 Multi-Sport Scoring Zones */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 z-10 mb-6">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">🏈 North Zone</span>
            <h4 className="text-xs font-black text-white mt-0.5">Endzone Pylon</h4>
            <span className="text-[10px] text-slate-400">Touchdown (+6 PTS)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-500/30 text-center">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">⚽ East Zone</span>
            <h4 className="text-xs font-black text-white mt-0.5">The Goal Net</h4>
            <span className="text-[10px] text-slate-400">Bicycle Kick (+5 PTS)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">⚾ South Zone</span>
            <h4 className="text-xs font-black text-white mt-0.5">Diamond Outfield</h4>
            <span className="text-[10px] text-slate-400">Grand Slam (+4 PTS)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-center">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">🏀 West Zone</span>
            <h4 className="text-xs font-black text-white mt-0.5">The Key & Rim</h4>
            <span className="text-[10px] text-slate-400">3PT Bomb (+3 PTS)</span>
          </div>
        </div>

        {/* The Floating Arcane Deathball in Center */}
        <div className="relative my-4 z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/60 ring-4 ring-amber-300/40 animate-pulse">
              <Flame className="w-10 h-10 fill-slate-950" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-amber-400/50 animate-ping opacity-75" />
          </div>
          
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold">
            Carrier: {gameState.scores[gameState.ballCarrierGuildId || '']?.guildName || 'Loose Ball Scramble!'}
          </div>
        </div>

        {/* Hazard Note */}
        <div className="z-10 mt-3 text-center">
          <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {gameState.activeHazard}
          </span>
        </div>
      </div>

      {/* 4-Club Live Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaderBoard.map((club, idx) => (
          <div
            key={club.guildId}
            className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
              idx === 0
                ? 'border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-black text-white font-['Rajdhani'] uppercase truncate max-w-[130px]">
                    {club.guildName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">MVP: {club.mvpPlay}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 font-mono">{club.totalPoints}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">PTS</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-slate-800 text-center">
              <div>
                <span className="text-[9px] text-slate-400 block">TD</span>
                <span className="text-xs font-black text-slate-200 font-mono">{club.touchdowns}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">GL</span>
                <span className="text-xs font-black text-slate-200 font-mono">{club.goals}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">HR</span>
                <span className="text-xs font-black text-slate-200 font-mono">{club.homeruns}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">3PT</span>
                <span className="text-xs font-black text-slate-200 font-mono">{club.threePointers}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Sport Play-By-Play Live Ticker */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Deathball Play-By-Play Ticker
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{gameState.playLog.length} drives recorded</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {gameState.playLog.map((play) => (
            <div
              key={play.id}
              className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                play.points >= 5
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 ${
                  play.sportType === 'FOOTBALL' ? 'bg-amber-500/20 text-amber-300' :
                  play.sportType === 'SOCCER' ? 'bg-blue-500/20 text-blue-300' :
                  play.sportType === 'BASEBALL' ? 'bg-emerald-500/20 text-emerald-300' :
                  play.sportType === 'BASKETBALL' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  R{play.round} • {play.sportType}
                </span>
                <p className="font-medium leading-relaxed">{play.text}</p>
              </div>

              {play.points > 0 && (
                <span className="text-xs font-mono font-black text-amber-400 flex-shrink-0">
                  +{play.points} PTS
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
