/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  SportsTeam, SportsPlayer, LiveGame, FantasyCampaign, DraftSession, AchievementBadge,
  FriendlyWager, NaggingMessage 
} from './types';
import { 
  INITIAL_TEAMS, INITIAL_PLAYERS, INITIAL_GAMES, INITIAL_CAMPAIGN,
  INITIAL_WAGERS, INITIAL_NAGGING_MESSAGES
} from './data/sportsDatabase';
import { INITIAL_ACHIEVEMENT_BADGES, evaluateBadges } from './data/achievementBadges';
import { api } from './services/api';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiveScoreTicker } from './components/LiveScoreTicker';
import { CampaignDashboard } from './components/CampaignDashboard';
import { RealWorldSportsView } from './components/RealWorldSportsView';
import { LiveDraftRoom } from './components/LiveDraftRoom';
import { CommissionerChat } from './components/CommissionerChat';
import { DualBattleArenaMaster } from './components/DualBattleArenaMaster';
import { TeamSyndicateModal } from './components/TeamSyndicateModal';
import { GameDetailsModal } from './components/GameDetailsModal';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { AchievementBadgesModal } from './components/AchievementBadgesModal';
import { VenueEnvironmentModal } from './components/VenueEnvironmentModal';
import { FriendlyWagersModal } from './components/FriendlyWagersModal';
import { FriendlyNaggingDrawer } from './components/FriendlyNaggingDrawer';
import { WomensSportsPerksModal } from './components/WomensSportsPerksModal';
import { MyClubManagerModal } from './components/MyClubManagerModal';
import { isSoundEnabled, toggleSoundEnabled, playUiClick, playDiceRollSound, playCriticalFanfare } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('campaign');

  // Core Data States
  const [teams, setTeams] = useState<SportsTeam[]>(INITIAL_TEAMS);
  const [players, setPlayers] = useState<SportsPlayer[]>(INITIAL_PLAYERS);
  const [games, setGames] = useState<LiveGame[]>(INITIAL_GAMES);
  const [campaign, setCampaign] = useState<FantasyCampaign>(INITIAL_CAMPAIGN);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENT_BADGES);
  const [northernSweepActive, setNorthernSweepActive] = useState<boolean>(false);

  // Draft States
  const [draftSession, setDraftSession] = useState<DraftSession>({
    campaignId: INITIAL_CAMPAIGN.id,
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
  });
  const [availableDraftPlayers, setAvailableDraftPlayers] = useState<SportsPlayer[]>(INITIAL_PLAYERS);

  // User Preferences
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('realm_favorite_teams');
      return saved ? JSON.parse(saved) : ['nfl-kc', 'nba-bos', 'epl-ars'];
    } catch {
      return ['nfl-kc', 'nba-bos', 'epl-ars'];
    }
  });

  // Wagers & Friendly Nagging States
  const [wagers, setWagers] = useState<FriendlyWager[]>(INITIAL_WAGERS);
  const [naggingMessages, setNaggingMessages] = useState<NaggingMessage[]>(INITIAL_NAGGING_MESSAGES);

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isWagersModalOpen, setIsWagersModalOpen] = useState(false);
  const [isNaggingDrawerOpen, setIsNaggingDrawerOpen] = useState(false);
  const [isWomensPerksModalOpen, setIsWomensPerksModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [selectedGameForModal, setSelectedGameForModal] = useState<LiveGame | null>(null);
  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<SportsPlayer | null>(null);

  // Sound & Live Real-Time Data Sync
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());
  const [isSyncingESPN, setIsSyncingESPN] = useState(false);
  const [espnBannerToast, setEspnBannerToast] = useState<string | null>(null);

  // Auto-Simulation Tick (Ticker)
  const [autoTick, setAutoTick] = useState<boolean>(true);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('realm_favorite_teams', JSON.stringify(favoriteTeamIds));
    } catch (err) {
      console.warn('Could not save favorites to localStorage', err);
    }
  }, [favoriteTeamIds]);

  // Initial Fetch from backend server
  useEffect(() => {
    const initData = async () => {
      try {
        const [
          fetchedTeams, fetchedPlayers, fetchedGames, fetchedCampaign,
          fetchedDraft, fetchedAchievements, fetchedWagers, fetchedNagging
        ] = await Promise.all([
          api.getTeams(),
          api.getPlayers(),
          api.getLiveGames(),
          api.getActiveCampaign(),
          api.getDraftSession(),
          api.getAchievements(),
          api.getWagers(),
          api.getNagging()
        ]);

        if (fetchedTeams.length > 0) setTeams(fetchedTeams);
        if (fetchedPlayers.length > 0) setPlayers(fetchedPlayers);
        if (fetchedGames.length > 0) setGames(fetchedGames);
        if (fetchedCampaign) setCampaign(fetchedCampaign);
        if (fetchedDraft?.draftSession) {
          setDraftSession(fetchedDraft.draftSession);
          setAvailableDraftPlayers(fetchedDraft.availablePlayers || fetchedPlayers);
        }
        if (fetchedAchievements?.badges && fetchedAchievements.badges.length > 0) {
          setBadges(fetchedAchievements.badges);
          setNorthernSweepActive(fetchedAchievements.northernSweepActive);
        }
        if (fetchedWagers && fetchedWagers.length > 0) setWagers(fetchedWagers);
        if (fetchedNagging && fetchedNagging.length > 0) setNaggingMessages(fetchedNagging);
      } catch (err) {
        console.warn('Using local sports database baseline', err);
      }
    };
    initData();
  }, []);

  // Live simulation tick handler
  const handleSimulateTick = useCallback(async (gameId?: string) => {
    const res = await api.simulateTick(gameId);
    if (res && res.game) {
      setGames(prev => prev.map(g => (g.id === res.game.id ? res.game : g)));
      if (selectedGameForModal && selectedGameForModal.id === res.game.id) {
        setSelectedGameForModal(res.game);
      }
      // Re-sync campaign matchup score
      if (res.matchup) {
        setCampaign(prev => ({
          ...prev,
          matchups: prev.matchups.map(m => (m.id === res.matchup.id ? res.matchup : m))
        }));
      }
      // Re-sync achievement badges
      if (res.badges) {
        setBadges(res.badges);
      } else {
        setBadges(prev => evaluateBadges(prev, campaign, games, players, { northernSweepActive }).updatedBadges);
      }
    }
  }, [selectedGameForModal, campaign, games, players, northernSweepActive]);

  // Periodic automated tick when autoTick is enabled
  useEffect(() => {
    if (!autoTick) return;
    const interval = setInterval(() => {
      handleSimulateTick();
    }, 7000);
    return () => clearInterval(interval);
  }, [autoTick, handleSimulateTick]);

  // Northern Sweep Toggle Handler
  const handleToggleNorthernSweep = async () => {
    const res = await api.triggerNorthernSweep();
    if (res && res.success) {
      setNorthernSweepActive(res.northernSweepActive);
      if (res.campaign) setCampaign(res.campaign);
      if (res.liveGames) setGames(res.liveGames);
      if (res.badges) setBadges(res.badges);
    }
  };

  // Favorite Team Toggle
  const handleToggleFavoriteTeam = (teamId: string) => {
    setFavoriteTeamIds(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  // Invite Co-Manager Handler
  const handleInviteMember = async (guildId: string, name: string, email: string, role: string) => {
    const res = await api.inviteMember(guildId, name, email, role);
    if (res?.guild) {
      setCampaign(prev => ({
        ...prev,
        guilds: prev.guilds.map(g => (g.id === res.guild.id ? res.guild : g))
      }));
    }
  };

  // Assign Player to Manager Handler
  const handleAssignPlayer = async (guildId: string, memberId: string, playerId: string) => {
    const res = await api.assignManagerPlayer(guildId, memberId, playerId);
    if (res?.guild) {
      setCampaign(prev => ({
        ...prev,
        guilds: prev.guilds.map(g => (g.id === res.guild.id ? res.guild : g))
      }));
    }
  };

  // D20 Dice Roll
  const handleRollDice = async (matchupId: string, modifierId: string) => {
    const res = await api.rollDice(matchupId, modifierId);
    if (res?.matchup) {
      setCampaign(prev => ({
        ...prev,
        matchups: prev.matchups.map(m => (m.id === res.matchup.id ? res.matchup : m))
      }));
    }
    if (res?.badges) {
      setBadges(res.badges);
    } else {
      setBadges(prev => evaluateBadges(prev, campaign, games, players, {
        lastDiceRoll: res?.d20,
        diceSuccess: res?.success,
        northernSweepActive
      }).updatedBadges);
    }
    return res;
  };

  // Draft Pick Handler
  const handleDraftPick = async (playerId: string, guildId: string, managerId?: string) => {
    const res = await api.makeDraftPick(playerId, guildId, managerId);
    if (res?.success) {
      setDraftSession(res.draftSession);
      if (res.guild) {
        setCampaign(prev => ({
          ...prev,
          guilds: prev.guilds.map(g => (g.id === res.guild.id ? res.guild : g))
        }));
      }
      setAvailableDraftPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  };

  // AI Scout Consultation
  const handleConsultScout = async (currentRoster: SportsPlayer[], available: SportsPlayer[], guildName: string) => {
    const res = await api.getCommissionerScout(currentRoster, available, guildName);
    return res.scoutReport;
  };

  // AI Commissioner Commentary
  const handleGetCommentary = async (prompt: string, contextType?: string) => {
    return await api.getCommissionerCommentary(prompt, contextType);
  };

  // Friendly Wagers Handlers
  const handleCreateWager = async (payload: {
    targetGuildId: string;
    targetGuildName: string;
    wagerType: any;
    pointsStaked: number;
    description: string;
    consequenceDescription: string;
    targetMetric: string;
    targetThreshold: number;
  }) => {
    const userGuild = campaign?.guilds?.[0] || INITIAL_CAMPAIGN.guilds[0];
    const res = await api.createWager({
      challengerGuildId: userGuild.id,
      challengerGuildName: userGuild.name,
      ...payload,
      matchupId: campaign?.matchups?.[0]?.id || 'matchup-1'
    });
    if (res?.wager) {
      setWagers(prev => [res.wager, ...prev]);
    }
  };

  const handleResolveWager = async (wagerId: string, winnerGuildId: string) => {
    const res = await api.resolveWager(wagerId, winnerGuildId);
    if (res?.success) {
      if (res.wager) {
        setWagers(prev => prev.map(w => w.id === wagerId ? res.wager : w));
      }
      if (res.campaign) {
        setCampaign(res.campaign);
      }
      if (res.badges) {
        setBadges(res.badges);
      }
      // Re-fetch nagging messages to display the automatic begging plea if generated
      const updatedNagging = await api.getNagging();
      if (updatedNagging?.length > 0) setNaggingMessages(updatedNagging);
    }
  };

  // Friendly Smack Talk / Nagging Handlers
  const handleSendNagging = async (payload: {
    targetGuildId?: string;
    text: string;
    emoji: string;
    gifUrl?: string;
    gifTitle?: string;
    isBeggingForMercy?: boolean;
  }) => {
    const userGuild = campaign?.guilds?.[0] || INITIAL_CAMPAIGN.guilds[0];
    const res = await api.sendNagging({
      senderGuildId: userGuild.id,
      senderGuildName: userGuild.name,
      senderManagerName: userGuild.members?.[0]?.name || 'Guildmaster J. Denton',
      ...payload
    });
    if (res?.message) {
      setNaggingMessages(prev => [...prev, res.message]);
    }
  };

  const handleReactNagging = async (messageId: string, emoji: string) => {
    const res = await api.reactNagging(messageId, emoji);
    if (res?.message) {
      setNaggingMessages(prev => prev.map(m => m.id === messageId ? res.message : m));
    }
  };

  const handleGrantMercy = async (messageId: string) => {
    const res = await api.grantMercy(messageId);
    if (res?.success) {
      if (res.message) {
        setNaggingMessages(prev => prev.map(m => m.id === messageId ? res.message : m));
      }
      if (res.campaign) {
        setCampaign(res.campaign);
      }
    }
  };

  // Foster Women's Sports Superstar
  const handleFosterWomensSports = async (playerId: string) => {
    const userGuild = campaign?.guilds?.[0] || INITIAL_CAMPAIGN.guilds[0];
    const res = await api.fosterWomensSports(userGuild.id, playerId);
    if (res?.success) {
      if (res.campaign) {
        setCampaign(res.campaign);
      }
      if (res.badges) {
        setBadges(res.badges);
      }
    }
  };

  // Sound Engine Toggle
  const handleToggleSound = () => {
    const next = toggleSoundEnabled();
    setSoundOn(next);
    if (next) playUiClick();
  };

  // Real ESPN Live Scoreboard Sync
  const handleSyncESPN = async () => {
    setIsSyncingESPN(true);
    try {
      const res = await api.syncRealESPNScores();
      if (res?.games && res.games.length > 0) {
        setGames(res.games);
      }
      if (res?.teams && res.teams.length > 0) {
        setTeams(res.teams);
      }
      playDiceRollSound();
      setEspnBannerToast(`Synced real scoreboards across NFL, NBA, MLB, NHL & EPL! (${res.games.length} games updated)`);
      setTimeout(() => setEspnBannerToast(null), 4000);
    } catch (err) {
      console.warn('ESPN live sync error:', err);
    } finally {
      setIsSyncingESPN(false);
    }
  };

  // Club Customization Update
  const handleUpdateGuild = async (updatedGuild: any) => {
    setCampaign(prev => ({
      ...prev,
      guilds: prev.guilds.map(g => g.id === updatedGuild.id ? { ...g, ...updatedGuild } : g)
    }));
    try {
      await api.updateGuild(updatedGuild);
    } catch (err) {
      console.warn('Failed to update guild on server:', err);
    }
  };

  // Campaign State Import (JSON restore)
  const handleImportCampaign = async (imported: FantasyCampaign) => {
    setCampaign(imported);
    try {
      await api.importCampaign(imported);
    } catch (err) {
      console.warn('Failed to import campaign to server:', err);
    }
  };

  // Record Duel / Deathball / Triathlon Arena Battle Results
  const handleRecordArenaMatch = async (payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded: number }) => {
    try {
      const res = await api.recordArenaMatch(payload);
      if (res?.campaign) {
        setCampaign(res.campaign);
      }
    } catch (err) {
      console.warn('Failed to record arena match:', err);
    }
  };

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;
  const userGuild = campaign?.guilds?.[0] || INITIAL_CAMPAIGN.guilds[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        onOpenVenueModal={() => setIsVenueModalOpen(true)}
        onOpenWagers={() => setIsWagersModalOpen(true)}
        onOpenNagging={() => setIsNaggingDrawerOpen(true)}
        onOpenWomensPerks={() => setIsWomensPerksModalOpen(true)}
        onOpenClubManager={() => setIsClubModalOpen(true)}
        isSoundOn={soundOn}
        onToggleSound={handleToggleSound}
        userGuildName={userGuild.name}
        userGuildCrest={userGuild.crestIcon}
        badgesUnlockedCount={unlockedBadgesCount}
        totalBadgesCount={badges.length}
        northernSweepActive={northernSweepActive}
        autoTick={autoTick}
        setAutoTick={setAutoTick}
        campaignWeek={campaign.currentWeek}
        gutterStatus={userGuild.gutterStatus}
        naggingCount={naggingMessages.length}
        womensPerkActive={userGuild.womensSportsPerks?.active}
      />

      {/* Real-Time Live Score Marquee Ticker with Real ESPN Connect */}
      <LiveScoreTicker
        games={games}
        onSelectGame={(game) => setSelectedGameForModal(game)}
        onSimulateTick={() => handleSimulateTick()}
        onSyncESPN={handleSyncESPN}
        isSyncingESPN={isSyncingESPN}
      />

      {/* Live ESPN Sync Notification Toast */}
      {espnBannerToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/50 text-emerald-200 text-xs px-4 py-2 flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Real ESPN Sync</span>
            <span>{espnBannerToast}</span>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'campaign' && (
          <CampaignDashboard
            campaign={campaign}
            liveGames={games}
            badges={badges}
            wagers={wagers}
            naggingMessages={naggingMessages}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
            onOpenVenueModal={() => setIsVenueModalOpen(true)}
            onOpenWagers={() => setIsWagersModalOpen(true)}
            onOpenNagging={() => setIsNaggingDrawerOpen(true)}
            onOpenWomensPerks={() => setIsWomensPerksModalOpen(true)}
            northernSweepActive={northernSweepActive}
            onToggleNorthernSweep={handleToggleNorthernSweep}
            onAssignPlayer={handleAssignPlayer}
            onRollDice={handleRollDice}
            onSelectPlayer={(player) => setSelectedPlayerForModal(player)}
            players={players}
            onRecordMatch={handleRecordArenaMatch}
          />
        )}

        {activeTab === 'arena' && (
          <DualBattleArenaMaster
            campaign={campaign}
            players={players}
            onRecordMatch={handleRecordArenaMatch}
          />
        )}

        {activeTab === 'sports' && (
          <RealWorldSportsView
            teams={teams}
            players={players}
            games={games}
            favoriteTeamIds={favoriteTeamIds}
            onToggleFavoriteTeam={handleToggleFavoriteTeam}
            onSelectGame={(game) => setSelectedGameForModal(game)}
            onSelectPlayer={(player) => setSelectedPlayerForModal(player)}
          />
        )}

        {activeTab === 'draft' && (
          <LiveDraftRoom
            draftSession={draftSession}
            availablePlayers={availableDraftPlayers}
            guilds={campaign.guilds}
            onDraftPick={handleDraftPick}
            onConsultScout={handleConsultScout}
            onSelectPlayer={(player) => setSelectedPlayerForModal(player)}
          />
        )}

        {activeTab === 'commissioner' && (
          <CommissionerChat
            campaign={campaign}
            onGetCommentary={handleGetCommentary}
          />
        )}
      </main>

      {/* Modals */}
      <TeamSyndicateModal
        campaign={campaign}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteMember={handleInviteMember}
      />

      <AchievementBadgesModal
        badges={badges}
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        northernSweepActive={northernSweepActive}
        onToggleNorthernSweep={handleToggleNorthernSweep}
      />

      <VenueEnvironmentModal
        games={games}
        liveGames={games}
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        northernSweepActive={northernSweepActive}
        onToggleNorthernSweep={handleToggleNorthernSweep}
      />

      <FriendlyWagersModal
        isOpen={isWagersModalOpen}
        onClose={() => setIsWagersModalOpen(false)}
        userGuild={userGuild}
        guilds={campaign?.guilds || []}
        rivalGuilds={(campaign?.guilds || []).filter(g => g.id !== userGuild?.id)}
        wagers={wagers}
        badges={badges}
        onCreateWager={handleCreateWager}
        onProposeWager={handleCreateWager}
        onResolveWager={handleResolveWager}
        onOpenNagging={() => {
          setIsWagersModalOpen(false);
          setIsNaggingDrawerOpen(true);
        }}
        onOpenWomensPerks={() => {
          setIsWagersModalOpen(false);
          setIsWomensPerksModalOpen(true);
        }}
      />

      <FriendlyNaggingDrawer
        isOpen={isNaggingDrawerOpen}
        onClose={() => setIsNaggingDrawerOpen(false)}
        messages={naggingMessages}
        userGuild={userGuild}
        guilds={campaign.guilds}
        onSendMessage={handleSendNagging}
        onReactMessage={handleReactNagging}
        onGrantMercy={handleGrantMercy}
        onOpenWagers={() => {
          setIsNaggingDrawerOpen(false);
          setIsWagersModalOpen(true);
        }}
      />

      <WomensSportsPerksModal
        isOpen={isWomensPerksModalOpen}
        onClose={() => setIsWomensPerksModalOpen(false)}
        userGuild={userGuild}
        players={players}
        badges={badges}
        onFosterPlayer={handleFosterWomensSports}
        onOpenWagers={() => {
          setIsWomensPerksModalOpen(false);
          setIsWagersModalOpen(true);
        }}
      />

      <GameDetailsModal
        game={selectedGameForModal}
        teams={teams}
        isOpen={!!selectedGameForModal}
        onClose={() => setSelectedGameForModal(null)}
        onSimulateTick={handleSimulateTick}
      />

      <PlayerDetailModal
        player={selectedPlayerForModal}
        isOpen={!!selectedPlayerForModal}
        onClose={() => setSelectedPlayerForModal(null)}
      />

      <MyClubManagerModal
        isOpen={isClubModalOpen}
        onClose={() => setIsClubModalOpen(false)}
        campaign={campaign}
        userGuild={userGuild}
        onUpdateGuild={handleUpdateGuild}
        onImportCampaign={handleImportCampaign}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Realm of Champions • Multi-League Fantasy Sports Campaign Platform</div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>NFL • NBA • EPL • MLB • NHL</span>
            <span>•</span>
            <span>September Weather & D&D Real-Time Environmental Wards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
