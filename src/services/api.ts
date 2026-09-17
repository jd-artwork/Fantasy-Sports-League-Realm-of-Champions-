import { SportsTeam, SportsPlayer, LiveGame, FantasyCampaign, DraftSession } from '../types';

export const api = {
  async getTeams(league?: string, search?: string): Promise<SportsTeam[]> {
    try {
      const params = new URLSearchParams();
      if (league && league !== 'ALL') params.append('league', league);
      if (search) params.append('search', search);
      const res = await fetch(`/api/sports/teams?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch teams');
      const data = await res.json();
      return data.teams || [];
    } catch (err) {
      console.warn('API getTeams fallback:', err);
      return [];
    }
  },

  async getPlayers(league?: string, teamId?: string, position?: string, search?: string): Promise<SportsPlayer[]> {
    try {
      const params = new URLSearchParams();
      if (league && league !== 'ALL') params.append('league', league);
      if (teamId) params.append('teamId', teamId);
      if (position && position !== 'ALL') params.append('position', position);
      if (search) params.append('search', search);
      const res = await fetch(`/api/sports/players?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      const data = await res.json();
      return data.players || [];
    } catch (err) {
      console.warn('API getPlayers fallback:', err);
      return [];
    }
  },

  async getLiveGames(): Promise<LiveGame[]> {
    try {
      const res = await fetch('/api/sports/live-games');
      if (!res.ok) throw new Error('Failed to fetch live games');
      const data = await res.json();
      return data.games || [];
    } catch (err) {
      console.warn('API getLiveGames fallback:', err);
      return [];
    }
  },

  async simulateTick(gameId?: string) {
    try {
      const res = await fetch('/api/sports/simulate-tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId })
      });
      if (!res.ok) throw new Error('Failed to simulate tick');
      return await res.json();
    } catch (err) {
      console.warn('API simulateTick fallback:', err);
      return null;
    }
  },

  async getActiveCampaign(): Promise<FantasyCampaign | null> {
    try {
      const res = await fetch('/api/campaigns/active');
      if (!res.ok) throw new Error('Failed to fetch active campaign');
      const data = await res.json();
      return data.campaign || null;
    } catch (err) {
      console.warn('API getActiveCampaign fallback:', err);
      return null;
    }
  },

  async inviteMember(guildId: string, newMemberName: string, newMemberEmail: string, role: string) {
    const res = await fetch('/api/campaigns/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId, newMemberName, newMemberEmail, role })
    });
    return await res.json();
  },

  async assignManagerPlayer(guildId: string, memberId: string, playerId: string) {
    const res = await fetch('/api/campaigns/assign-manager-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId, memberId, playerId })
    });
    return await res.json();
  },

  async rollDice(matchupId: string, modifierId: string) {
    const res = await fetch('/api/campaigns/roll-dice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchupId, modifierId })
    });
    return await res.json();
  },

  async getAchievements(): Promise<{ badges: any[]; northernSweepActive: boolean }> {
    try {
      const res = await fetch('/api/achievements');
      return await res.json();
    } catch (err) {
      return { badges: [], northernSweepActive: false };
    }
  },

  async triggerNorthernSweep(): Promise<{ success: boolean; northernSweepActive: boolean; campaign: any; liveGames: any[]; badges: any[]; message: string }> {
    const res = await fetch('/api/campaigns/trigger-northern-sweep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  },

  async getDraftSession(): Promise<{ draftSession: DraftSession; availablePlayers: SportsPlayer[] }> {
    const res = await fetch('/api/draft/session');
    return await res.json();
  },

  async makeDraftPick(playerId: string, guildId: string, managerId?: string) {
    const res = await fetch('/api/draft/pick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, guildId, managerId })
    });
    return await res.json();
  },

  async getCommissionerCommentary(prompt?: string, contextType?: string) {
    try {
      const res = await fetch('/api/commissioner/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, contextType })
      });
      return await res.json();
    } catch (err) {
      return { commentary: "Arch-Commissioner Vorath: 'The battle lines are drawn across the stadium!'", poweredBy: "Realm Engine" };
    }
  },

  async getCommissionerScout(currentRoster: SportsPlayer[], availablePlayers: SportsPlayer[], guildName?: string) {
    try {
      const res = await fetch('/api/commissioner/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRoster, availablePlayers, guildName })
      });
      return await res.json();
    } catch (err) {
      return {
        scoutReport: {
          targetPlayer: availablePlayers?.[0]?.name || "Mahomes",
          analysis: "Strong fantasy floor with elite clutch synergy.",
          tacticalRecommendation: "Anchor your roster with an MVP-caliber producer."
        }
      };
    }
  },

  // Friendly Wagers
  async getWagers() {
    try {
      const res = await fetch('/api/wagers');
      if (!res.ok) throw new Error('Failed to fetch wagers');
      const data = await res.json();
      return data.wagers || [];
    } catch (err) {
      console.warn('API getWagers fallback:', err);
      return [];
    }
  },

  async createWager(payload: {
    challengerGuildId: string;
    challengerGuildName: string;
    targetGuildId: string;
    targetGuildName: string;
    matchupId: string;
    wagerType: string;
    pointsStaked: number;
    description: string;
    consequenceDescription: string;
    targetMetric: string;
    targetThreshold: number;
  }) {
    const res = await fetch('/api/wagers/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async resolveWager(wagerId: string, winnerGuildId: string) {
    const res = await fetch('/api/wagers/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wagerId, winnerGuildId })
    });
    return await res.json();
  },

  // Friendly Nagging & Smack Talk
  async getNagging() {
    try {
      const res = await fetch('/api/nagging');
      if (!res.ok) throw new Error('Failed to fetch nagging messages');
      const data = await res.json();
      return data.messages || [];
    } catch (err) {
      console.warn('API getNagging fallback:', err);
      return [];
    }
  },

  async sendNagging(payload: {
    senderGuildId: string;
    senderGuildName: string;
    senderManagerName: string;
    targetGuildId?: string;
    text: string;
    emoji: string;
    gifUrl?: string;
    gifTitle?: string;
    isBeggingForMercy?: boolean;
  }) {
    const res = await fetch('/api/nagging/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async reactNagging(messageId: string, emoji: string) {
    const res = await fetch('/api/nagging/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, emoji })
    });
    return await res.json();
  },

  async grantMercy(messageId: string) {
    const res = await fetch('/api/nagging/grant-mercy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId })
    });
    return await res.json();
  },

  // Foster Women's Sports Superstar
  async fosterWomensSports(guildId: string, playerId: string) {
    const res = await fetch('/api/campaigns/foster-womens-sports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId, playerId })
    });
    return await res.json();
  },

  // Real-Time ESPN Scoreboard Sync
  async syncRealESPNScores(): Promise<{ success: boolean; games: LiveGame[]; teams: SportsTeam[]; source: string }> {
    try {
      const res = await fetch('/api/sports/real-sync');
      if (!res.ok) throw new Error('Failed to sync ESPN scoreboards');
      return await res.json();
    } catch (err) {
      console.warn('Real ESPN sync fallback:', err);
      return { success: false, games: [], teams: [], source: 'FALLBACK' };
    }
  },

  // Club / Guild Management
  async updateGuild(guild: any) {
    const res = await fetch('/api/campaigns/update-guild', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guild })
    });
    return await res.json();
  },

  // Campaign Import
  async importCampaign(campaign: any) {
    const res = await fetch('/api/campaigns/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign })
    });
    return await res.json();
  },

  // Arena Record Match
  async recordArenaMatch(payload: { mode: string; winnerGuildId: string; summary: string; pointsAwarded?: number }) {
    const res = await fetch('/api/arena/record-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
};
