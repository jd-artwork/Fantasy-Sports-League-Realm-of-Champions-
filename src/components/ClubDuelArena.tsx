import React, { useState } from 'react';
import { 
  Swords, Shield, Dices, Flame, Sparkles, Trophy, Heart, Zap, 
  RotateCcw, Play, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, User
} from 'lucide-react';
import { ClubFighter, FighterAbility, BattleCombatLogEntry, SportsPlayer, TournamentSeason } from '../types';
import { createClubFighter } from '../data/battleArenaDatabase';
import { playCombatStrikeSound, playCriticalFanfare, playDiceRollSound, playUiClick } from '../utils/audioSynth';

interface Props {
  guilds: Array<{ id: string; name: string; bannerColor?: string; crestIcon?: string; roster?: string[] }>;
  players: SportsPlayer[];
  activeSeason: TournamentSeason;
  onRecordMatch?: (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => void;
}

export const ClubDuelArena: React.FC<Props> = ({ guilds, players, activeSeason, onRecordMatch }) => {
  // Select Home & Away Clubs
  const [homeGuildId, setHomeGuildId] = useState<string>(guilds[0]?.id || 'guild-1');
  const [awayGuildId, setAwayGuildId] = useState<string>(guilds[1]?.id || 'guild-2');

  const homeGuild = guilds.find(g => g.id === homeGuildId) || guilds[0];
  const awayGuild = guilds.find(g => g.id === awayGuildId) || guilds[1] || guilds[0];

  // Derive roster players for each guild or assign default multi-sport superstars
  const getGuildPlayers = (guildId: string, defaultOffset: number): SportsPlayer[] => {
    const guildObj = guilds.find(g => g.id === guildId);
    if (guildObj?.roster && guildObj.roster.length > 0) {
      const matched = players.filter(p => guildObj.roster!.includes(p.id));
      if (matched.length > 0) return matched;
    }
    // Fallback selection of diverse multi-sport superstars
    const sliceStart = (defaultOffset * 3) % players.length;
    return players.slice(sliceStart, sliceStart + 5).concat(players.slice(0, 2));
  };

  const homeRoster = getGuildPlayers(homeGuildId, 0);
  const awayRoster = getGuildPlayers(awayGuildId, 1);

  // Active Champions
  const [selectedHomePlayerId, setSelectedHomePlayerId] = useState<string>(homeRoster[0]?.id || players[0]?.id);
  const [selectedAwayPlayerId, setSelectedAwayPlayerId] = useState<string>(awayRoster[0]?.id || players[1]?.id);

  const homePlayer = homeRoster.find(p => p.id === selectedHomePlayerId) || homeRoster[0] || players[0];
  const awayPlayer = awayRoster.find(p => p.id === selectedAwayPlayerId) || awayRoster[0] || players[1];

  // Create or retrieve active fighter states
  const [homeFighter, setHomeFighter] = useState<ClubFighter>(() => createClubFighter(homePlayer, homeGuild));
  const [awayFighter, setAwayFighter] = useState<ClubFighter>(() => createClubFighter(awayPlayer, awayGuild));

  // Turn management
  const [currentTurn, setCurrentTurn] = useState<'HOME' | 'AWAY'>('HOME');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [combatLogs, setCombatLogs] = useState<BattleCombatLogEntry[]>([
    {
      id: 'log-init',
      turn: 1,
      timestamp: '00:00',
      actorName: 'Arena Herald',
      actorGuildName: 'Imperial Stadium',
      actionType: 'SPECIAL',
      narrative: `Duel commenced under the ${activeSeason.name}! ${homeFighter.name} (${homeFighter.guildName}) squares off against ${awayFighter.name} (${awayFighter.guildName})!`,
      sportContext: `${homeFighter.league} vs ${awayFighter.league}`
    }
  ]);

  const [lastActionAnimation, setLastActionAnimation] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Check if active season provides a buff to either fighter's sport
  const homeBuff = activeSeason.sportBuffs.find(b => b.sport === homeFighter.league);
  const awayBuff = activeSeason.sportBuffs.find(b => b.sport === awayFighter.league);

  // Switch Fighter handler
  const handleSelectHomeFighter = (player: SportsPlayer) => {
    setSelectedHomePlayerId(player.id);
    const newFighter = createClubFighter(player, homeGuild);
    setHomeFighter(newFighter);
  };

  const handleSelectAwayFighter = (player: SportsPlayer) => {
    setSelectedAwayPlayerId(player.id);
    const newFighter = createClubFighter(player, awayGuild);
    setAwayFighter(newFighter);
  };

  // Reset Duel
  const handleResetDuel = () => {
    const freshHome = createClubFighter(homePlayer, homeGuild);
    const freshAway = createClubFighter(awayPlayer, awayGuild);
    setHomeFighter(freshHome);
    setAwayFighter(freshAway);
    setCurrentTurn('HOME');
    setRoundNumber(1);
    setCombatLogs([
      {
        id: `reset-${Date.now()}`,
        turn: 1,
        timestamp: '00:00',
        actorName: 'Arena Herald',
        actorGuildName: 'Imperial Stadium',
        actionType: 'SPECIAL',
        narrative: `Duel arena reset. Both sports champions return to full stamina and action points.`,
        sportContext: 'Arena Reset'
      }
    ]);
  };

  // Execute Ability
  const handleExecuteAbility = (ability: FighterAbility, isAuto = false) => {
    const isHome = currentTurn === 'HOME';
    const attacker = isHome ? homeFighter : awayFighter;
    const defender = isHome ? awayFighter : homeFighter;

    if (attacker.currentHp <= 0 || defender.currentHp <= 0) return;
    if (attacker.ap < ability.apCost) {
      if (!isAuto) {
        alert(`Not enough Action Points (AP). Requires ${ability.apCost} AP.`);
      }
      return;
    }

    // Roll d20
    const rawD20 = Math.floor(Math.random() * 20) + 1;
    const totalRoll = rawD20 + ability.d20Bonus;
    const isCrit = rawD20 === 20;
    const isFail = rawD20 === 1;

    // Check season sport buff
    const activeBuff = isHome ? homeBuff : awayBuff;
    const buffMultiplier = activeBuff ? activeBuff.bonusMultiplier : 1.0;

    // Calculate damage
    let damage = 0;
    let narrative = '';

    if (ability.category === 'DEFENSIVE') {
      // Shield buff
      damage = 0;
      narrative = `${attacker.name} assumes ${ability.name}! Defensive ward raised, absorbing 50% of the next attack.`;
      const updatedAttacker: ClubFighter = {
        ...attacker,
        ap: attacker.ap - ability.apCost,
        statusEffects: [...attacker.statusEffects, { type: 'DEFENDING', turnsRemaining: 1, description: 'Shield raised (-50% dmg)' }]
      };
      if (isHome) setHomeFighter(updatedAttacker);
      else setAwayFighter(updatedAttacker);
    } else {
      // Offensive strike or tactical play
      const baseDmg = Math.floor(Math.random() * (ability.damageRange[1] - ability.damageRange[0] + 1)) + ability.damageRange[0];
      let finalDmg = Math.round(baseDmg * buffMultiplier);
      if (isCrit) finalDmg = Math.round(finalDmg * 1.5);
      if (isFail) finalDmg = Math.round(finalDmg * 0.4);

      // Check defender defensive buffs
      const isDefending = defender.statusEffects.some(e => e.type === 'DEFENDING');
      if (isDefending) {
        finalDmg = Math.round(finalDmg * 0.5);
      }

      damage = finalDmg;
      const targetHp = Math.max(0, defender.currentHp - damage);

      narrative = `${attacker.name} rolled a ${rawD20} (+${ability.d20Bonus} = ${totalRoll})! Unleashes ${ability.name} (${attacker.league} strike) dealing ${damage} damage to ${defender.name}! ${
        isCrit ? '💥 CRITICAL HIT!' : isFail ? '⚡ Scuffed execution!' : ''
      } ${activeBuff ? `[${activeBuff.buffName} applied!]` : ''}`;

      if (isCrit) {
        playCriticalFanfare();
      } else {
        playCombatStrikeSound();
      }

      if (targetHp === 0) {
        narrative += ` 🏆 KNOCKOUT! ${defender.name} falls in the arena! ${attacker.name} and ${attacker.guildName} prevail!`;
        playCriticalFanfare();
        if (onRecordMatch) {
          onRecordMatch({
            mode: 'DUEL',
            winnerGuildId: attacker.guildId,
            summary: `${attacker.name} defeated ${defender.name} in a 1v1 duel`,
            pointsAwarded: 15
          });
        }
      }

      // Update state
      const updatedAttacker: ClubFighter = {
        ...attacker,
        ap: attacker.ap - ability.apCost
      };

      const updatedDefender: ClubFighter = {
        ...defender,
        currentHp: targetHp,
        statusEffects: defender.statusEffects.filter(e => e.type !== 'DEFENDING')
      };

      if (isHome) {
        setHomeFighter(updatedAttacker);
        setAwayFighter(updatedDefender);
      } else {
        setAwayFighter(updatedAttacker);
        setHomeFighter(updatedDefender);
      }
    }

    setLastActionAnimation(narrative);

    // Add to combat log
    const newLog: BattleCombatLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      turn: roundNumber,
      timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      actorName: attacker.name,
      actorGuildName: attacker.guildName,
      targetName: defender.name,
      actionType: ability.category === 'ULTIMATE' ? 'SPECIAL' : 'ATTACK',
      d20Roll: rawD20,
      rollSuccess: totalRoll >= 10,
      damage,
      narrative,
      sportContext: `${ability.sportSource} Ability`
    };

    setCombatLogs(prev => [newLog, ...prev]);
  };

  // Pass Turn
  const handleEndTurn = () => {
    if (currentTurn === 'HOME') {
      setCurrentTurn('AWAY');
      // Replenish Away AP
      setAwayFighter(prev => ({
        ...prev,
        ap: Math.min(prev.maxAp, prev.ap + 2)
      }));
    } else {
      setCurrentTurn('HOME');
      setRoundNumber(r => r + 1);
      // Replenish Home AP
      setHomeFighter(prev => ({
        ...prev,
        ap: Math.min(prev.maxAp, prev.ap + 2)
      }));
    }
  };

  // AI Opponent Step
  const handleAiTurn = () => {
    if (awayFighter.currentHp <= 0 || homeFighter.currentHp <= 0) return;
    setIsSimulating(true);

    setTimeout(() => {
      // Pick best affordable ability
      const affordable = awayFighter.abilities.filter(a => a.apCost <= awayFighter.ap);
      const chosen = affordable[Math.floor(Math.random() * affordable.length)] || awayFighter.abilities[0];
      
      if (chosen && awayFighter.ap >= chosen.apCost) {
        handleExecuteAbility(chosen, true);
      }
      
      // Pass turn back to player
      setTimeout(() => {
        handleEndTurn();
        setIsSimulating(false);
      }, 600);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Arena Overview Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" />
              1v1 Multi-Sport Club Duel
            </span>
            <span className="text-xs text-slate-400 font-mono">Round {roundNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-['Rajdhani'] mt-1">
            {homeGuild.name} <span className="text-amber-400">VS</span> {awayGuild.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-world sports stats converted into D&D martial strength, agility, and supernatural sports abilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-reset-duel"
            onClick={handleResetDuel}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Duel</span>
          </button>

          {currentTurn === 'AWAY' && (
            <button
              id="btn-ai-play"
              onClick={handleAiTurn}
              disabled={isSimulating || awayFighter.currentHp <= 0}
              className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Opponent Turn</span>
            </button>
          )}

          {currentTurn === 'HOME' && (
            <button
              id="btn-end-turn"
              onClick={handleEndTurn}
              disabled={homeFighter.currentHp <= 0}
              className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition"
            >
              <span>End My Turn</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Roster Champion Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Club Selector */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>🛡️ {homeGuild.name} (Your Club)</span>
            <span className="text-slate-400 font-normal">Swap Champion:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {homeRoster.map(p => (
              <button
                key={`home-pick-${p.id}`}
                onClick={() => handleSelectHomeFighter(p)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                  p.id === selectedHomePlayerId
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span className="px-1 py-0.2 bg-slate-950/40 rounded text-[10px] font-mono">{p.league}</span>
                <span>{p.name.split(' ').pop()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Away Club Selector */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
            <span>⚔️ {awayGuild.name} (Rival Club)</span>
            <span className="text-slate-400 font-normal">Swap Rival:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {awayRoster.map(p => (
              <button
                key={`away-pick-${p.id}`}
                onClick={() => handleSelectAwayFighter(p)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                  p.id === selectedAwayPlayerId
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span className="px-1 py-0.2 bg-slate-950/40 rounded text-[10px] font-mono">{p.league}</span>
                <span>{p.name.split(' ').pop()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arena Combat Floor: Side-by-Side Fighters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Fighter Card */}
        <div className={`p-6 rounded-2xl bg-slate-900 border transition-all duration-300 relative overflow-hidden ${
          currentTurn === 'HOME' ? 'border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30' : 'border-slate-800'
        }`}>
          {currentTurn === 'HOME' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 animate-pulse">
              Active Turn
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono">
                  {homeFighter.league} #{homeFighter.jerseyNumber}
                </span>
                <span className="text-xs text-slate-400">{homeFighter.position} • {homeFighter.rpgClass}</span>
              </div>
              <h3 className="text-2xl font-black text-white font-['Rajdhani'] mt-1">{homeFighter.name}</h3>
              <p className="text-xs text-amber-400 font-medium">{homeFighter.guildName}</p>
            </div>

            {homeBuff && (
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {homeBuff.buffName}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">+{Math.round((homeBuff.bonusMultiplier - 1) * 100)}% Dmg</p>
              </div>
            )}
          </div>

          {/* Health & AP Bars */}
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  Health
                </span>
                <span className="font-mono text-slate-200">{homeFighter.currentHp} / {homeFighter.maxHp} HP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    homeFighter.currentHp > homeFighter.maxHp * 0.4 ? 'bg-gradient-to-r from-red-500 to-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(homeFighter.currentHp / homeFighter.maxHp) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  Action Points (AP)
                </span>
                <span className="font-mono text-slate-200">{homeFighter.ap} / {homeFighter.maxAp} AP</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: homeFighter.maxAp }).map((_, i) => (
                  <div
                    key={`home-ap-${i}`}
                    className={`h-2.5 flex-1 rounded-md transition-colors ${
                      i < homeFighter.ap ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Derived Martial Stats */}
          <div className="grid grid-cols-4 gap-2 text-center mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">STR</span>
              <span className="text-sm font-black text-amber-300 font-mono">{homeFighter.str}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">DEX</span>
              <span className="text-sm font-black text-emerald-300 font-mono">{homeFighter.dex}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">CON</span>
              <span className="text-sm font-black text-blue-300 font-mono">{homeFighter.con}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">IQ / VIS</span>
              <span className="text-sm font-black text-purple-300 font-mono">{homeFighter.iq}</span>
            </div>
          </div>

          {/* Action Abilities */}
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Execute Action (Your Turn):</h4>
            <div className="grid grid-cols-1 gap-2">
              {homeFighter.abilities.map(ab => {
                const canAfford = homeFighter.ap >= ab.apCost;
                return (
                  <button
                    key={ab.id}
                    onClick={() => handleExecuteAbility(ab)}
                    disabled={!canAfford || currentTurn !== 'HOME' || homeFighter.currentHp <= 0 || awayFighter.currentHp <= 0}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                      canAfford && currentTurn === 'HOME' && homeFighter.currentHp > 0
                        ? ab.category === 'ULTIMATE'
                          ? 'bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 border-amber-500/50 text-white'
                          : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{ab.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          ab.category === 'ULTIMATE' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          ab.category === 'TACTICAL' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {ab.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ab.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end font-mono text-xs font-bold text-amber-400">
                        <Zap className="w-3 h-3" />
                        <span>{ab.apCost} AP</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {ab.damageRange[0] > 0 ? `${ab.damageRange[0]}-${ab.damageRange[1]} Dmg` : 'Guard'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Away Fighter Card */}
        <div className={`p-6 rounded-2xl bg-slate-900 border transition-all duration-300 relative overflow-hidden ${
          currentTurn === 'AWAY' ? 'border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-400/30' : 'border-slate-800'
        }`}>
          {currentTurn === 'AWAY' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white animate-pulse">
              Opponent Turn
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 font-mono">
                  {awayFighter.league} #{awayFighter.jerseyNumber}
                </span>
                <span className="text-xs text-slate-400">{awayFighter.position} • {awayFighter.rpgClass}</span>
              </div>
              <h3 className="text-2xl font-black text-white font-['Rajdhani'] mt-1">{awayFighter.name}</h3>
              <p className="text-xs text-indigo-400 font-medium">{awayFighter.guildName}</p>
            </div>

            {awayBuff && (
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {awayBuff.buffName}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">+{Math.round((awayBuff.bonusMultiplier - 1) * 100)}% Dmg</p>
              </div>
            )}
          </div>

          {/* Health & AP Bars */}
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  Health
                </span>
                <span className="font-mono text-slate-200">{awayFighter.currentHp} / {awayFighter.maxHp} HP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    awayFighter.currentHp > awayFighter.maxHp * 0.4 ? 'bg-gradient-to-r from-red-500 to-indigo-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(awayFighter.currentHp / awayFighter.maxHp) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Zap className="w-3.5 h-3.5 fill-indigo-400" />
                  Action Points (AP)
                </span>
                <span className="font-mono text-slate-200">{awayFighter.ap} / {awayFighter.maxAp} AP</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: awayFighter.maxAp }).map((_, i) => (
                  <div
                    key={`away-ap-${i}`}
                    className={`h-2.5 flex-1 rounded-md transition-colors ${
                      i < awayFighter.ap ? 'bg-indigo-400 shadow-sm shadow-indigo-400/50' : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Derived Martial Stats */}
          <div className="grid grid-cols-4 gap-2 text-center mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">STR</span>
              <span className="text-sm font-black text-amber-300 font-mono">{awayFighter.str}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">DEX</span>
              <span className="text-sm font-black text-emerald-300 font-mono">{awayFighter.dex}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">CON</span>
              <span className="text-sm font-black text-blue-300 font-mono">{awayFighter.con}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">IQ / VIS</span>
              <span className="text-sm font-black text-purple-300 font-mono">{awayFighter.iq}</span>
            </div>
          </div>

          {/* Rival Arsenal Display */}
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rival Arsenal:</h4>
            <div className="grid grid-cols-1 gap-2">
              {awayFighter.abilities.map(ab => (
                <div
                  key={`away-ab-${ab.id}`}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between gap-3 text-slate-400"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{ab.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                        {ab.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ab.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono text-xs text-slate-400">
                    <span>{ab.apCost} AP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arena Combat Play-by-Play Log */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Arena Clash Play-by-Play Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{combatLogs.length} events recorded</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {combatLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 transition ${
                log.actionType === 'SPECIAL'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : log.damage && log.damage > 40
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 flex-shrink-0 mt-0.5">
                  T{log.turn}
                </span>
                <div>
                  <p className="font-medium leading-relaxed">{log.narrative}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{log.sportContext}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
