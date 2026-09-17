import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import confetti from 'canvas-confetti';
import { 
  FantasyCampaign, PlayoffGuildSeed, PlayoffMatchupNode, TournamentBracketState 
} from '../types';
import { 
  Trophy, Crown, Swords, Sparkles, Play, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Shield, Flame, Anchor, 
  Users, Award, Zap, Info, CheckCircle2, X, ChevronRight,
  TrendingUp, Dices
} from 'lucide-react';

interface Props {
  campaign: FantasyCampaign;
  onOpenWagers?: () => void;
  onOpenNagging?: () => void;
}

export const TournamentBracketVisualizer: React.FC<Props> = ({
  campaign,
  onOpenWagers,
  onOpenNagging
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMatchup, setSelectedMatchup] = useState<PlayoffMatchupNode | null>(null);
  const [viewStage, setViewStage] = useState<'ALL' | 'SEMIFINALS' | 'FINALS'>('ALL');
  const [showConsolation, setShowConsolation] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Generate initial playoff seeds based on campaign guilds sorted by points/wins
  const initialSeeds: PlayoffGuildSeed[] = useMemo(() => {
    const guilds = [...(campaign?.guilds || [])];
    guilds.sort((a, b) => {
      const aWinPct = a.campaignStats.wins / Math.max(1, a.campaignStats.wins + a.campaignStats.losses);
      const bWinPct = b.campaignStats.wins / Math.max(1, b.campaignStats.wins + b.campaignStats.losses);
      if (bWinPct !== aWinPct) return bWinPct - aWinPct;
      return b.campaignStats.totalPoints - a.campaignStats.totalPoints;
    });

    const defaultGuilds: { name: string; color: string; crest: string }[] = [
      { name: 'Vanguard of Thunder', color: '#3B82F6', crest: 'Shield' },
      { name: 'Shadow Syndicate FC', color: '#EC4899', crest: 'Flame' },
      { name: 'Titanium Kraken', color: '#10B981', crest: 'Anchor' },
      { name: 'Frostpeak Valkyries', color: '#8B5CF6', crest: 'Crown' },
    ];

    return [0, 1, 2, 3].map((i) => {
      const g = guilds[i];
      const fallback = defaultGuilds[i];
      return {
        seed: i + 1,
        guildId: g ? g.id : `seed-guild-${i + 1}`,
        guildName: g ? g.name : fallback.name,
        bannerColor: g ? g.bannerColor : fallback.color,
        crestIcon: g ? g.crestIcon : fallback.crest,
        regularSeasonRecord: g ? `${g.campaignStats.wins}-${g.campaignStats.losses}` : `${3 - i}-${i}`,
        totalPoints: g ? g.campaignStats.totalPoints : parseFloat((530 - i * 35).toFixed(1)),
        gutterStatus: g?.gutterStatus || 'NORMAL',
        starPlayerName: g?.roster?.[0]?.name || (i === 0 ? 'Patrick Mahomes' : i === 1 ? 'Erling Haaland' : i === 2 ? 'Nikola Jokić' : "A'ja Wilson"),
        synergyBuff: i === 0 ? 'Astral Lightning Strike (+15% Q4)' : i === 1 ? 'Shadow Veil Infiltration (+20% Counter)' : i === 2 ? 'Abyssal Tidal Surge (+18% Rebounds)' : 'Valkyrie Sovereign Shield (+25 pts)'
      };
    });
  }, [campaign]);

  // Playoff Bracket State (Semifinals, Finals, Champion)
  const [bracket, setBracket] = useState<TournamentBracketState>(() => {
    const s1 = initialSeeds[0];
    const s4 = initialSeeds[3];
    const s2 = initialSeeds[1];
    const s3 = initialSeeds[2];

    const sf1: PlayoffMatchupNode = {
      id: 'match-sf-1',
      round: 1,
      roundTitle: 'Semifinal A: Thunder Bastion Duel',
      matchIndex: 0,
      homeSeed: s1,
      awaySeed: s4,
      homeScore: 138.4,
      awayScore: 129.2,
      winnerGuildId: s1.guildId,
      status: 'COMPLETED',
      activeModifierName: 'Sunbaked Arrowhead Caldera (88°F)',
      realmLocation: 'Arrowhead Colosseum, Sector 1',
      mvpPlayerName: 'Patrick Mahomes',
      mvpPlayerStat: '34.8 FPTS (3 TD, 312 YDS)',
      narrative: `${s1.guildName} surged ahead behind a fiery late-game passing clinic to punch their ticket to the Realm Grand Final.`
    };

    const sf2: PlayoffMatchupNode = {
      id: 'match-sf-2',
      round: 1,
      roundTitle: 'Semifinal B: Abyssal Shadow Gauntlet',
      matchIndex: 1,
      homeSeed: s2,
      awaySeed: s3,
      homeScore: 131.8,
      awayScore: 135.6,
      winnerGuildId: s3.guildId,
      status: 'COMPLETED',
      activeModifierName: 'Autumn Thames Mist (64°F)',
      realmLocation: 'Emirates Sanctum & Abyssal Rift',
      mvpPlayerName: 'Nikola Jokić',
      mvpPlayerStat: '38.2 FPTS (Triple-Double Masterclass)',
      narrative: `${s3.guildName} pulled off a thrilling upset behind Jokić's visionary passes, surging past the Shadow Syndicate.`
    };

    const finals: PlayoffMatchupNode = {
      id: 'match-final',
      round: 2,
      roundTitle: 'The Realm Championship Grand Final',
      matchIndex: 2,
      homeSeed: s1, // Winner of SF1
      awaySeed: s3, // Winner of SF2
      homeScore: 142.5,
      awayScore: 139.1,
      winnerGuildId: s1.guildId,
      status: 'COMPLETED',
      activeModifierName: 'Celestial Solstice Convergence (All Buffs 1.25x)',
      realmLocation: 'The Grand Citadel Dais (Imperial Coliseum)',
      mvpPlayerName: 'Caitlin Clark & Jayson Tatum',
      mvpPlayerStat: '56.4 Combined FPTS (Championship Duet)',
      narrative: `In a legendary showdown that went down to the final minute, ${s1.guildName} hoisted the Crown of Champions!`
    };

    const consolation: PlayoffMatchupNode = {
      id: 'match-bronze',
      round: 2,
      roundTitle: 'Bronze Dais Consolation Match',
      matchIndex: 3,
      homeSeed: s4,
      awaySeed: s2,
      homeScore: 122.4,
      awayScore: 128.9,
      winnerGuildId: s2.guildId,
      status: 'COMPLETED',
      activeModifierName: 'Desert Oasis Climatron (72°F)',
      realmLocation: 'Michelob Sand Crypt',
      mvpPlayerName: 'Erling Haaland',
      mvpPlayerStat: '28.0 FPTS (Hat Trick Display)',
      narrative: `${s2.guildName} claimed 3rd Place Bronze laurels in a fast-paced shootout.`
    };

    return {
      currentStage: 'CHAMPION_CROWNED',
      semifinals: [sf1, sf2],
      finals,
      consolation,
      championGuildId: s1.guildId,
      championGuild: s1
    };
  });

  // Re-seed bracket if needed
  const resetBracket = () => {
    const s1 = initialSeeds[0];
    const s4 = initialSeeds[3];
    const s2 = initialSeeds[1];
    const s3 = initialSeeds[2];

    const sf1: PlayoffMatchupNode = {
      id: 'match-sf-1',
      round: 1,
      roundTitle: 'Semifinal A: Thunder Bastion Duel',
      matchIndex: 0,
      homeSeed: s1,
      awaySeed: s4,
      homeScore: 0,
      awayScore: 0,
      winnerGuildId: undefined,
      status: 'UPCOMING',
      activeModifierName: 'Sunbaked Arrowhead Caldera (88°F)',
      realmLocation: 'Arrowhead Colosseum, Sector 1',
      narrative: 'Awaiting opening kickoff in the playoff crucible.'
    };

    const sf2: PlayoffMatchupNode = {
      id: 'match-sf-2',
      round: 1,
      roundTitle: 'Semifinal B: Abyssal Shadow Gauntlet',
      matchIndex: 1,
      homeSeed: s2,
      awaySeed: s3,
      homeScore: 0,
      awayScore: 0,
      winnerGuildId: undefined,
      status: 'UPCOMING',
      activeModifierName: 'Autumn Thames Mist (64°F)',
      realmLocation: 'Emirates Sanctum & Abyssal Rift',
      narrative: 'Awaiting opening whistle in the playoff crucible.'
    };

    const finals: PlayoffMatchupNode = {
      id: 'match-final',
      round: 2,
      roundTitle: 'The Realm Championship Grand Final',
      matchIndex: 2,
      homeSeed: s1,
      awaySeed: s2,
      homeScore: 0,
      awayScore: 0,
      winnerGuildId: undefined,
      status: 'UPCOMING',
      activeModifierName: 'Celestial Solstice Convergence',
      realmLocation: 'The Grand Citadel Dais',
      narrative: 'Winner of Semifinal A advances to duel the winner of Semifinal B.'
    };

    setBracket({
      currentStage: 'SEMIFINALS',
      semifinals: [sf1, sf2],
      finals,
      championGuildId: undefined,
      championGuild: undefined
    });
    setSelectedMatchup(null);
  };

  // Simulate Next Round
  const simulateNextRound = () => {
    setIsSimulating(true);

    setTimeout(() => {
      setBracket((prev) => {
        // If semifinals not completed, complete them
        if (prev.semifinals[0].status !== 'COMPLETED' || prev.semifinals[1].status !== 'COMPLETED') {
          const sf1HomeScore = parseFloat((125 + Math.random() * 25).toFixed(1));
          const sf1AwayScore = parseFloat((120 + Math.random() * 25).toFixed(1));
          const sf1Winner = sf1HomeScore >= sf1AwayScore ? prev.semifinals[0].homeSeed : prev.semifinals[0].awaySeed;

          const sf2HomeScore = parseFloat((122 + Math.random() * 26).toFixed(1));
          const sf2AwayScore = parseFloat((122 + Math.random() * 26).toFixed(1));
          const sf2Winner = sf2HomeScore >= sf2AwayScore ? prev.semifinals[1].homeSeed : prev.semifinals[1].awaySeed;

          const sf1Loser = sf1Winner.guildId === prev.semifinals[0].homeSeed.guildId ? prev.semifinals[0].awaySeed : prev.semifinals[0].homeSeed;
          const sf2Loser = sf2Winner.guildId === prev.semifinals[1].homeSeed.guildId ? prev.semifinals[1].awaySeed : prev.semifinals[1].homeSeed;

          const updatedSf1: PlayoffMatchupNode = {
            ...prev.semifinals[0],
            homeScore: sf1HomeScore,
            awayScore: sf1AwayScore,
            winnerGuildId: sf1Winner.guildId,
            status: 'COMPLETED',
            mvpPlayerName: sf1Winner.starPlayerName || 'Guild Ace',
            mvpPlayerStat: '32.4 FPTS (Critical Playoff Performance)',
            narrative: `${sf1Winner.guildName} executed their master tactical plan to overcome ${sf1Loser.guildName}.`
          };

          const updatedSf2: PlayoffMatchupNode = {
            ...prev.semifinals[1],
            homeScore: sf2HomeScore,
            awayScore: sf2AwayScore,
            winnerGuildId: sf2Winner.guildId,
            status: 'COMPLETED',
            mvpPlayerName: sf2Winner.starPlayerName || 'Guild Ace',
            mvpPlayerStat: '35.1 FPTS (Clutch Elimination Feat)',
            narrative: `${sf2Winner.guildName} triumphed through heavy pressure against ${sf2Loser.guildName}.`
          };

          const updatedFinals: PlayoffMatchupNode = {
            ...prev.finals,
            homeSeed: sf1Winner,
            awaySeed: sf2Winner,
            status: 'IN_PROGRESS',
            homeScore: 0,
            awayScore: 0,
            winnerGuildId: undefined,
            narrative: `The Championship match is set: ${sf1Winner.guildName} vs ${sf2Winner.guildName}!`
          };

          const updatedConsolation: PlayoffMatchupNode = {
            id: 'match-bronze',
            round: 2,
            roundTitle: 'Bronze Dais Consolation Match',
            matchIndex: 3,
            homeSeed: sf1Loser,
            awaySeed: sf2Loser,
            homeScore: 0,
            awayScore: 0,
            status: 'IN_PROGRESS',
            activeModifierName: 'Desert Oasis Climatron (72°F)',
            realmLocation: 'Michelob Sand Crypt',
            narrative: `Battle for 3rd Place honors between ${sf1Loser.guildName} and ${sf2Loser.guildName}.`
          };

          return {
            ...prev,
            currentStage: 'FINALS',
            semifinals: [updatedSf1, updatedSf2],
            finals: updatedFinals,
            consolation: updatedConsolation
          };
        }

        // If Finals are next to simulate
        if (prev.finals.status !== 'COMPLETED') {
          const finalHomeScore = parseFloat((135 + Math.random() * 20).toFixed(1));
          const finalAwayScore = parseFloat((133 + Math.random() * 20).toFixed(1));
          const champion = finalHomeScore >= finalAwayScore ? prev.finals.homeSeed : prev.finals.awaySeed;
          const runnerUp = champion.guildId === prev.finals.homeSeed.guildId ? prev.finals.awaySeed : prev.finals.homeSeed;

          const updatedFinals: PlayoffMatchupNode = {
            ...prev.finals,
            homeScore: finalHomeScore,
            awayScore: finalAwayScore,
            winnerGuildId: champion.guildId,
            status: 'COMPLETED',
            mvpPlayerName: champion.starPlayerName || 'Championship Sovereign',
            mvpPlayerStat: '41.5 FPTS (Historic MVP Performance)',
            narrative: `Hail the conqueror! ${champion.guildName} defeated ${runnerUp.guildName} in an unforgettable grand final!`
          };

          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6']
          });

          return {
            ...prev,
            currentStage: 'CHAMPION_CROWNED',
            finals: updatedFinals,
            championGuildId: champion.guildId,
            championGuild: champion
          };
        }

        return prev;
      });
      setIsSimulating(false);
    }, 400);
  };

  // Allow direct manual toggle of matchup winner
  const handleSelectWinner = (matchupId: string, winnerSeed: PlayoffGuildSeed) => {
    setBracket((prev) => {
      if (matchupId === 'match-sf-1' || matchupId === 'match-sf-2') {
        const isSf1 = matchupId === 'match-sf-1';
        const targetSf = isSf1 ? prev.semifinals[0] : prev.semifinals[1];
        const isHomeWinner = winnerSeed.guildId === targetSf.homeSeed.guildId;

        const updatedSf: PlayoffMatchupNode = {
          ...targetSf,
          winnerGuildId: winnerSeed.guildId,
          homeScore: isHomeWinner ? Math.max(targetSf.homeScore || 130, (targetSf.awayScore || 120) + 5) : Math.min(targetSf.homeScore || 120, (targetSf.awayScore || 130) - 5),
          awayScore: !isHomeWinner ? Math.max(targetSf.awayScore || 130, (targetSf.homeScore || 120) + 5) : Math.min(targetSf.awayScore || 120, (targetSf.homeScore || 130) - 5),
          status: 'COMPLETED'
        };

        const otherSf = isSf1 ? prev.semifinals[1] : prev.semifinals[0];
        const updatedSf1 = isSf1 ? updatedSf : prev.semifinals[0];
        const updatedSf2 = !isSf1 ? updatedSf : prev.semifinals[1];

        // Update finals seeds based on semifinal winners
        const finalist1 = updatedSf1.winnerGuildId 
          ? (updatedSf1.winnerGuildId === updatedSf1.homeSeed.guildId ? updatedSf1.homeSeed : updatedSf1.awaySeed)
          : prev.finals.homeSeed;

        const finalist2 = updatedSf2.winnerGuildId 
          ? (updatedSf2.winnerGuildId === updatedSf2.homeSeed.guildId ? updatedSf2.homeSeed : updatedSf2.awaySeed)
          : prev.finals.awaySeed;

        return {
          ...prev,
          semifinals: [updatedSf1, updatedSf2],
          finals: {
            ...prev.finals,
            homeSeed: finalist1,
            awaySeed: finalist2,
            winnerGuildId: prev.finals.winnerGuildId === winnerSeed.guildId ? winnerSeed.guildId : undefined
          },
          championGuildId: prev.championGuildId === winnerSeed.guildId ? winnerSeed.guildId : undefined,
          championGuild: prev.championGuildId === winnerSeed.guildId ? winnerSeed : undefined
        };
      }

      if (matchupId === 'match-final') {
        const isHome = winnerSeed.guildId === prev.finals.homeSeed.guildId;
        const updatedFinals: PlayoffMatchupNode = {
          ...prev.finals,
          winnerGuildId: winnerSeed.guildId,
          homeScore: isHome ? Math.max(prev.finals.homeScore || 140, (prev.finals.awayScore || 130) + 4) : Math.min(prev.finals.homeScore || 130, (prev.finals.awayScore || 140) - 4),
          awayScore: !isHome ? Math.max(prev.finals.awayScore || 140, (prev.finals.homeScore || 130) + 4) : Math.min(prev.finals.awayScore || 130, (prev.finals.homeScore || 140) - 4),
          status: 'COMPLETED'
        };

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });

        return {
          ...prev,
          currentStage: 'CHAMPION_CROWNED',
          finals: updatedFinals,
          championGuildId: winnerSeed.guildId,
          championGuild: winnerSeed
        };
      }

      return prev;
    });
  };

  // D3 DRAWING LOGIC
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 980;
    const width = Math.max(containerWidth, 900);
    const height = 540;

    // Defs: Gradients, Drop Shadows, and Animated Glow Filters
    const defs = svg.append('defs');

    // Winner Glow Filter
    const filter = defs.append('filter')
      .attr('id', 'winner-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    // Gold Champion Glow
    const goldFilter = defs.append('filter')
      .attr('id', 'gold-aura')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');
    goldFilter.append('feGaussianBlur')
      .attr('stdDeviation', '8')
      .attr('result', 'glow');
    goldFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['glow', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    // Dynamic Gradients for active branches
    const branchGrad = defs.append('linearGradient')
      .attr('id', 'active-branch-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    branchGrad.append('stop').attr('offset', '0%').attr('stop-color', '#3B82F6').attr('stop-opacity', 0.9);
    branchGrad.append('stop').attr('offset', '100%').attr('stop-color', '#F59E0B').attr('stop-opacity', 1);

    const goldGrad = defs.append('linearGradient')
      .attr('id', 'gold-branch-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    goldGrad.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0.9);
    goldGrad.append('stop').attr('offset', '100%').attr('stop-color', '#EAB308').attr('stop-opacity', 1);

    // Main Zoom Group
    const g = svg.append('g').attr('class', 'bracket-main-group');

    // Configure D3 Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.65, 1.8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });
    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Coordinates mapping for our 3-column bracket layout:
    // Col 0: Semifinals (Round 1) - x: 40
    // Col 1: Grand Final (Round 2) - x: 380
    // Col 2: Championship Dais - x: 720
    const col0X = 50;
    const col1X = 390;
    const col2X = 730;

    const sf1Y = 80;
    const sf2Y = 320;
    const finalY = 200;
    const champY = 200;

    const cardWidth = 260;
    const cardHeight = 130;

    // Helper to generate smooth horizontal cubic bezier links
    const createBezierLink = (x0: number, y0: number, x1: number, y1: number) => {
      const midX = (x0 + x1) / 2;
      return `M ${x0} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;
    };

    // 1. DRAW D3 LINK PROGRESSION PATHS
    const linksLayer = g.append('g').attr('class', 'links-layer');

    // Link 1: SF1 to Finals (Home Seed Slot)
    const sf1WinnerExists = !!bracket.semifinals[0].winnerGuildId;
    const sf1Active = bracket.semifinals[0].status === 'COMPLETED';
    const link1Path = createBezierLink(col0X + cardWidth, sf1Y + cardHeight / 2, col1X, finalY + cardHeight / 3);

    linksLayer.append('path')
      .attr('d', link1Path)
      .attr('fill', 'none')
      .attr('stroke', sf1Active ? 'url(#active-branch-grad)' : '#334155')
      .attr('stroke-width', sf1Active ? 3.5 : 2)
      .attr('stroke-dasharray', sf1Active ? 'none' : '4 4')
      .attr('filter', sf1Active ? 'url(#winner-glow)' : 'none')
      .attr('opacity', sf1Active ? 1 : 0.45);

    // Link 2: SF2 to Finals (Away Seed Slot)
    const sf2Active = bracket.semifinals[1].status === 'COMPLETED';
    const link2Path = createBezierLink(col0X + cardWidth, sf2Y + cardHeight / 2, col1X, finalY + (cardHeight * 2) / 3);

    linksLayer.append('path')
      .attr('d', link2Path)
      .attr('fill', 'none')
      .attr('stroke', sf2Active ? 'url(#active-branch-grad)' : '#334155')
      .attr('stroke-width', sf2Active ? 3.5 : 2)
      .attr('stroke-dasharray', sf2Active ? 'none' : '4 4')
      .attr('filter', sf2Active ? 'url(#winner-glow)' : 'none')
      .attr('opacity', sf2Active ? 1 : 0.45);

    // Link 3: Finals to Champion Dais
    const finalsActive = bracket.finals.status === 'COMPLETED' && !!bracket.championGuild;
    const link3Path = createBezierLink(col1X + cardWidth, finalY + cardHeight / 2, col2X, champY + cardHeight / 2);

    linksLayer.append('path')
      .attr('d', link3Path)
      .attr('fill', 'none')
      .attr('stroke', finalsActive ? 'url(#gold-branch-grad)' : '#334155')
      .attr('stroke-width', finalsActive ? 4.5 : 2)
      .attr('stroke-dasharray', finalsActive ? 'none' : '4 4')
      .attr('filter', finalsActive ? 'url(#gold-aura)' : 'none')
      .attr('opacity', finalsActive ? 1 : 0.4);

    // Marching Dash Animated Flow Effect along winning path
    if (finalsActive) {
      linksLayer.append('path')
        .attr('d', link3Path)
        .attr('fill', 'none')
        .attr('stroke', '#FEF08A')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8 8')
        .attr('class', 'animate-pulse');
    }

    // 2. COLUMN ROUND HEADERS (D3 Text)
    const headersLayer = g.append('g').attr('class', 'headers-layer');

    const headersData = [
      { label: 'PLAYOFF SEMIFINALS', sub: 'Knockout Round 1', x: col0X, y: 38 },
      { label: 'REALM CHAMPIONSHIP', sub: 'Grand Final Match', x: col1X, y: 38 },
      { label: 'CHAMPION OF THE REALM', sub: 'Imperial Dais & Crown', x: col2X, y: 38 },
    ];

    headersData.forEach((h) => {
      const hg = headersLayer.append('g').attr('transform', `translate(${h.x}, ${h.y})`);
      hg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', '#94A3B8')
        .attr('font-size', '11px')
        .attr('font-weight', '800')
        .attr('letter-spacing', '0.08em')
        .text(h.label);
      hg.append('text')
        .attr('x', 0)
        .attr('y', 14)
        .attr('fill', '#64748B')
        .attr('font-size', '10px')
        .text(h.sub);
    });

    // 3. RENDER MATCHUP NODES
    const matchupsLayer = g.append('g').attr('class', 'matchups-layer');

    const renderMatchupNode = (
      node: PlayoffMatchupNode,
      posX: number,
      posY: number,
      isFinalMatch: boolean = false
    ) => {
      const matchG = matchupsLayer.append('g')
        .attr('class', `matchup-node-${node.id} cursor-pointer`)
        .attr('transform', `translate(${posX}, ${posY})`)
        .on('click', () => setSelectedMatchup(node));

      // Container Card Rect
      const isCompleted = node.status === 'COMPLETED';
      const isSelected = selectedMatchup?.id === node.id;

      matchG.append('rect')
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('rx', 14)
        .attr('fill', '#0F172A')
        .attr('stroke', isSelected ? '#F59E0B' : isFinalMatch && isCompleted ? '#F59E0B80' : isCompleted ? '#334155' : '#1E293B')
        .attr('stroke-width', isSelected ? 2.5 : isFinalMatch && isCompleted ? 2 : 1.2)
        .attr('filter', isSelected ? 'url(#winner-glow)' : 'none');

      // Top mini header inside card
      matchG.append('rect')
        .attr('width', cardWidth)
        .attr('height', 26)
        .attr('rx', 14)
        .attr('fill', '#1E293B');

      // Flat patch for bottom of mini header
      matchG.append('rect')
        .attr('y', 16)
        .attr('width', cardWidth)
        .attr('height', 10)
        .attr('fill', '#1E293B');

      matchG.append('text')
        .attr('x', 10)
        .attr('y', 17)
        .attr('fill', isFinalMatch ? '#F59E0B' : '#94A3B8')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.04em')
        .text(isFinalMatch ? '👑 GRAND CHAMPIONSHIP' : node.roundTitle.split(':')[0]);

      // Status pill in mini header
      const statusColor = isCompleted ? '#10B981' : node.status === 'IN_PROGRESS' ? '#F59E0B' : '#64748B';
      const statusText = isCompleted ? 'FINAL' : node.status === 'IN_PROGRESS' ? 'LIVE' : 'UPCOMING';
      
      matchG.append('text')
        .attr('x', cardWidth - 10)
        .attr('y', 17)
        .attr('text-anchor', 'end')
        .attr('fill', statusColor)
        .attr('font-size', '9px')
        .attr('font-weight', '800')
        .text(statusText);

      // TEAM 1 ROW (Home Seed)
      const renderTeamRow = (
        seed: PlayoffGuildSeed,
        score: number | undefined,
        isWinner: boolean,
        rowY: number
      ) => {
        const rowG = matchG.append('g')
          .attr('transform', `translate(10, ${rowY})`)
          .attr('class', 'team-row transition-opacity')
          .attr('opacity', isCompleted && !isWinner ? 0.45 : 1);

        // Highlight bg if winner
        if (isWinner) {
          rowG.append('rect')
            .attr('x', -4)
            .attr('y', -3)
            .attr('width', cardWidth - 12)
            .attr('height', 38)
            .attr('rx', 8)
            .attr('fill', '#1E293B80')
            .attr('stroke', `${seed.bannerColor}40`)
            .attr('stroke-width', 1);
        }

        // Seed Badge
        rowG.append('rect')
          .attr('x', 0)
          .attr('y', 6)
          .attr('width', 18)
          .attr('height', 18)
          .attr('rx', 5)
          .attr('fill', seed.bannerColor)
          .attr('opacity', 0.25);

        rowG.append('text')
          .attr('x', 9)
          .attr('y', 19)
          .attr('text-anchor', 'middle')
          .attr('fill', seed.bannerColor)
          .attr('font-size', '9px')
          .attr('font-weight', '800')
          .text(seed.seed);

        // Team Name & star
        const nameText = seed.guildName.length > 18 ? `${seed.guildName.slice(0, 16)}…` : seed.guildName;
        rowG.append('text')
          .attr('x', 26)
          .attr('y', 18)
          .attr('fill', isWinner ? '#F8FAFC' : '#CBD5E1')
          .attr('font-size', '11px')
          .attr('font-weight', isWinner ? '800' : '600')
          .text(nameText);

        // Winner Trophy Icon indicator
        if (isWinner) {
          rowG.append('text')
            .attr('x', 26 + (nameText.length * 6.6))
            .attr('y', 18)
            .attr('fill', '#F59E0B')
            .attr('font-size', '10px')
            .text('👑');
        }

        // Star player subline
        if (seed.starPlayerName) {
          rowG.append('text')
            .attr('x', 26)
            .attr('y', 30)
            .attr('fill', '#64748B')
            .attr('font-size', '9px')
            .text(`Star: ${seed.starPlayerName}`);
        }

        // Score
        rowG.append('text')
          .attr('x', cardWidth - 22)
          .attr('y', 20)
          .attr('text-anchor', 'end')
          .attr('fill', isWinner ? '#F59E0B' : '#E2E8F0')
          .attr('font-size', '14px')
          .attr('font-weight', '800')
          .attr('font-family', 'monospace')
          .text(score !== undefined && score > 0 ? score.toFixed(1) : '—');
      };

      const isHomeWinner = node.winnerGuildId === node.homeSeed.guildId;
      const isAwayWinner = node.winnerGuildId === node.awaySeed.guildId;

      renderTeamRow(node.homeSeed, node.homeScore, isHomeWinner, 36);

      // Subtle Divider
      matchG.append('line')
        .attr('x1', 10)
        .attr('y1', 80)
        .attr('x2', cardWidth - 10)
        .attr('y2', 80)
        .attr('stroke', '#1E293B')
        .attr('stroke-width', 1);

      renderTeamRow(node.awaySeed, node.awayScore, isAwayWinner, 84);
    };

    // Render SF1 & SF2
    renderMatchupNode(bracket.semifinals[0], col0X, sf1Y, false);
    renderMatchupNode(bracket.semifinals[1], col0X, sf2Y, false);

    // Render Grand Final
    renderMatchupNode(bracket.finals, col1X, finalY, true);

    // 4. RENDER CHAMPION'S DAIS (PODIUM CARD)
    const champG = matchupsLayer.append('g')
      .attr('class', 'champion-dais cursor-pointer')
      .attr('transform', `translate(${col2X}, ${champY})`);

    const hasChampion = !!bracket.championGuild;
    const champion = bracket.championGuild;

    // Outer Podium Card
    champG.append('rect')
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('rx', 16)
      .attr('fill', hasChampion ? '#1E1B4B' : '#0F172A')
      .attr('stroke', hasChampion ? '#F59E0B' : '#334155')
      .attr('stroke-width', hasChampion ? 2.5 : 1.5)
      .attr('filter', hasChampion ? 'url(#gold-aura)' : 'none');

    if (hasChampion && champion) {
      // Golden crown header banner
      champG.append('rect')
        .attr('width', cardWidth)
        .attr('height', 32)
        .attr('rx', 16)
        .attr('fill', '#F59E0B');

      champG.append('rect')
        .attr('y', 16)
        .attr('width', cardWidth)
        .attr('height', 16)
        .attr('fill', '#F59E0B');

      champG.append('text')
        .attr('x', cardWidth / 2)
        .attr('y', 21)
        .attr('text-anchor', 'middle')
        .attr('fill', '#020617')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .attr('letter-spacing', '0.08em')
        .text('🏆 REIGNING REALM CHAMPION 🏆');

      // Champion Guild Banner Orb
      champG.append('circle')
        .attr('cx', 34)
        .attr('cy', 68)
        .attr('r', 16)
        .attr('fill', champion.bannerColor)
        .attr('stroke', '#FEF08A')
        .attr('stroke-width', 2);

      champG.append('text')
        .attr('x', 34)
        .attr('y', 73)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '13px')
        .attr('font-weight', '900')
        .text(champion.crestIcon === 'Shield' ? '🛡️' : champion.crestIcon === 'Flame' ? '🔥' : champion.crestIcon === 'Crown' ? '👑' : '⚓');

      // Guild Name
      champG.append('text')
        .attr('x', 58)
        .attr('y', 64)
        .attr('fill', '#FEF08A')
        .attr('font-size', '13px')
        .attr('font-weight', '900')
        .text(champion.guildName);

      // Subline
      champG.append('text')
        .attr('x', 58)
        .attr('y', 78)
        .attr('fill', '#CBD5E1')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text(`Seed #${champion.seed} • ${champion.totalPoints} Regular PTS`);

      // MVP / Lore badge
      champG.append('rect')
        .attr('x', 12)
        .attr('y', 92)
        .attr('width', cardWidth - 24)
        .attr('height', 26)
        .attr('rx', 6)
        .attr('fill', '#02061780')
        .attr('stroke', '#F59E0B40');

      champG.append('text')
        .attr('x', cardWidth / 2)
        .attr('y', 109)
        .attr('text-anchor', 'middle')
        .attr('fill', '#E2E8F0')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text(`MVP: ${bracket.finals.mvpPlayerName?.split('&')[0] || champion.starPlayerName || 'Guildmaster'}`);
    } else {
      // Empty / Awaiting Champion State
      champG.append('text')
        .attr('x', cardWidth / 2)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748B')
        .attr('font-size', '28px')
        .text('👑');

      champG.append('text')
        .attr('x', cardWidth / 2)
        .attr('y', 85)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94A3B8')
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .text('Crown Awaiting Champion');

      champG.append('text')
        .attr('x', cardWidth / 2)
        .attr('y', 104)
        .attr('text-anchor', 'middle')
        .attr('fill', '#475569')
        .attr('font-size', '10px')
        .text('Simulate or select finals winner');
    }

  }, [bracket, selectedMatchup]);

  // Zoom Controls
  const handleZoom = (delta: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy, delta);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div id="tournament-bracket-container" className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide uppercase font-['Rajdhani']">
                  Playoff Tournament Bracket
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  D3 Playoff Gauntlet
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic D3 tree mapping the progression of winning fantasy guilds toward the Realm Championship Crown.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step Simulation Button */}
          <button
            id="simulate-playoff-btn"
            onClick={simulateNextRound}
            disabled={isSimulating}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition ${
              bracket.currentStage === 'CHAMPION_CROWNED'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>
              {bracket.currentStage === 'SEMIFINALS' 
                ? 'Simulate Semifinals' 
                : bracket.currentStage === 'FINALS' 
                ? 'Simulate Grand Final' 
                : 'Re-Simulate Crown'}
            </span>
          </button>

          {/* Reset Bracket Button */}
          <button
            id="reset-bracket-btn"
            onClick={resetBracket}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700/80 flex items-center gap-1.5 transition"
            title="Reset to default regular season standings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl bg-slate-950/80 border border-slate-800 p-0.5">
            <button
              onClick={() => handleZoom(1.2)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Playoff Progression Tracker Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl border transition ${
          bracket.semifinals.every(s => s.status === 'COMPLETED')
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-slate-950/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>ROUND 1: SEMIFINALS</span>
            <span className="text-[10px] uppercase font-mono">
              {bracket.semifinals.every(s => s.status === 'COMPLETED') ? 'Completed' : 'Active'}
            </span>
          </div>
          <div className="text-xs text-slate-200">
            2 Matchups • 4 Guilds Clashing
          </div>
        </div>

        <div className={`p-3 rounded-xl border transition ${
          bracket.finals.status === 'COMPLETED'
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : bracket.currentStage === 'FINALS'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            : 'bg-slate-950/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>ROUND 2: CHAMPIONSHIP FINAL</span>
            <span className="text-[10px] uppercase font-mono">
              {bracket.finals.status === 'COMPLETED' ? 'Winner Decided' : bracket.currentStage === 'FINALS' ? 'In Battle' : 'Pending Semis'}
            </span>
          </div>
          <div className="text-xs text-slate-200">
            {bracket.finals.homeSeed.guildName} vs {bracket.finals.awaySeed.guildName}
          </div>
        </div>

        <div className={`p-3 rounded-xl border transition ${
          bracket.championGuild
            ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-lg shadow-amber-900/20'
            : 'bg-slate-950/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>IMPERIAL DAIS</span>
            <span className="text-[10px] uppercase font-mono">
              {bracket.championGuild ? '👑 Crowned' : 'Awaiting'}
            </span>
          </div>
          <div className="text-xs text-slate-200 font-bold truncate">
            {bracket.championGuild ? `Champion: ${bracket.championGuild.guildName}` : 'Trophy Unclaimed'}
          </div>
        </div>
      </div>

      {/* Main D3 Visualizer Canvas Area */}
      <div 
        ref={containerRef}
        className="w-full h-[540px] rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden flex items-center justify-center select-none"
      >
        <svg 
          ref={svgRef} 
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        />

        {/* Legend / Guidance Watermark */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none backdrop-blur-sm">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Click any match card to inspect or override advancing winners • Drag or scroll to pan</span>
        </div>
      </div>

      {/* Consolation Match Banner (if toggled) */}
      {showConsolation && bracket.consolation && (
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-slate-300">
              Bronze Dais 3rd Place Battle:
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {bracket.consolation.homeSeed.guildName} ({bracket.consolation.homeScore?.toFixed(1) || '—'}) vs {bracket.consolation.awaySeed.guildName} ({bracket.consolation.awayScore?.toFixed(1) || '—'})
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {bracket.consolation.winnerGuildId && (
              <span className="text-amber-500/90 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                3rd Place: {bracket.consolation.winnerGuildId === bracket.consolation.homeSeed.guildId ? bracket.consolation.homeSeed.guildName : bracket.consolation.awaySeed.guildName}
              </span>
            )}
            <button
              onClick={() => setSelectedMatchup(bracket.consolation!)}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition text-xs flex items-center gap-1"
            >
              Inspect Matchup <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Matchup Inspector Modal / Slide-Over */}
      {selectedMatchup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedMatchup(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedMatchup.roundTitle}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Status: {selectedMatchup.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Playoff Clash Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Arena: {selectedMatchup.realmLocation || 'The Imperial Playoff Crucible'}
              </p>
            </div>

            {/* Clashing Guilds Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Home Guild */}
              <div className={`p-4 rounded-xl border transition ${
                selectedMatchup.winnerGuildId === selectedMatchup.homeSeed.guildId
                  ? 'bg-slate-800/80 border-amber-500/60 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">Seed #{selectedMatchup.homeSeed.seed}</span>
                  {selectedMatchup.winnerGuildId === selectedMatchup.homeSeed.guildId && (
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> ADVANCED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedMatchup.homeSeed.bannerColor }} />
                  <span className="font-bold text-white text-sm truncate">{selectedMatchup.homeSeed.guildName}</span>
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono my-2">
                  {selectedMatchup.homeScore?.toFixed(1) || '0.0'} <span className="text-xs text-slate-400 font-normal">pts</span>
                </div>
                <div className="text-xs text-slate-400">
                  Star: {selectedMatchup.homeSeed.starPlayerName || 'Syndicate Core'}
                </div>
                <div className="text-[11px] text-slate-400 italic mt-0.5">
                  Buff: {selectedMatchup.homeSeed.synergyBuff}
                </div>

                <button
                  onClick={() => handleSelectWinner(selectedMatchup.id, selectedMatchup.homeSeed)}
                  className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Pick as Winner</span>
                </button>
              </div>

              {/* Away Guild */}
              <div className={`p-4 rounded-xl border transition ${
                selectedMatchup.winnerGuildId === selectedMatchup.awaySeed.guildId
                  ? 'bg-slate-800/80 border-amber-500/60 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">Seed #{selectedMatchup.awaySeed.seed}</span>
                  {selectedMatchup.winnerGuildId === selectedMatchup.awaySeed.guildId && (
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> ADVANCED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedMatchup.awaySeed.bannerColor }} />
                  <span className="font-bold text-white text-sm truncate">{selectedMatchup.awaySeed.guildName}</span>
                </div>
                <div className="text-2xl font-black text-slate-200 font-mono my-2">
                  {selectedMatchup.awayScore?.toFixed(1) || '0.0'} <span className="text-xs text-slate-400 font-normal">pts</span>
                </div>
                <div className="text-xs text-slate-400">
                  Star: {selectedMatchup.awaySeed.starPlayerName || 'Syndicate Core'}
                </div>
                <div className="text-[11px] text-slate-400 italic mt-0.5">
                  Buff: {selectedMatchup.awaySeed.synergyBuff}
                </div>

                <button
                  onClick={() => handleSelectWinner(selectedMatchup.id, selectedMatchup.awaySeed)}
                  className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Pick as Winner</span>
                </button>
              </div>
            </div>

            {/* Matchup Lore & Narrative */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commissioner's Postseason Chronicle</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedMatchup.narrative || 'A high-stakes clash in the championship gauntlet where tactical rosters push fantasy limits.'}
              </p>
              {selectedMatchup.mvpPlayerStat && (
                <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
                  ⭐ Round MVP Feat: {selectedMatchup.mvpPlayerName} — {selectedMatchup.mvpPlayerStat}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedMatchup(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
