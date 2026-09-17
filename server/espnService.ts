import { LiveGame, SportLeague, LiveGamePlay, SportsTeam } from '../src/types';
import { INITIAL_GAMES, INITIAL_TEAMS } from '../src/data/sportsDatabase';

interface ESPNCompetitor {
  id: string;
  homeAway: 'home' | 'away';
  score?: string;
  winner?: boolean;
  records?: Array<{ summary?: string; type?: string }>;
  team: {
    id: string;
    displayName: string;
    shortDisplayName?: string;
    abbreviation?: string;
    logo?: string;
    color?: string;
    alternateColor?: string;
    location?: string;
  };
  leaders?: Array<{
    name: string;
    displayName: string;
    leaders?: Array<{
      displayValue: string;
      value: number;
      athlete?: {
        displayName: string;
        headshot?: string;
        jersey?: string;
        position?: { abbreviation: string };
      };
    }>;
  }>;
}

interface ESPNEvent {
  id: string;
  name: string;
  shortName?: string;
  date: string;
  competitions: Array<{
    id: string;
    venue?: {
      fullName?: string;
      address?: {
        city?: string;
        state?: string;
        country?: string;
      };
      indoor?: boolean;
    };
    competitors: ESPNCompetitor[];
    broadcasts?: Array<{ names?: string[] }>;
  }>;
  status: {
    clock?: number;
    displayClock?: string;
    period?: number;
    type: {
      state: 'pre' | 'in' | 'post';
      completed: boolean;
      description: string;
      detail?: string;
      shortDetail?: string;
    };
  };
}

const LEAGUE_ENDPOINTS: Array<{ league: SportLeague; url: string }> = [
  { league: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
  { league: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
  { league: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
  { league: 'NHL', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
  { league: 'EPL', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard' },
  { league: 'WNBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard' },
  { league: 'NWSL', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.nwsl/scoreboard' },
];

// In-memory cache with 45-second TTL
let cachedGames: LiveGame[] = [];
let cachedTeams: SportsTeam[] = [];
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 45 * 1000;

function generateDndFlavorForVenue(stadiumName: string, city: string, league: SportLeague) {
  const isIndoor = stadiumName.toLowerCase().includes('dome') || stadiumName.toLowerCase().includes('center') || stadiumName.toLowerCase().includes('arena');
  const isNorthern = ['Buffalo', 'Green Bay', 'Detroit', 'Chicago', 'Cleveland', 'Minneapolis', 'Seattle', 'Toronto', 'Montreal', 'Boston'].some(c => city.toLowerCase().includes(c.toLowerCase()));

  const loreTemplates = [
    `The ancient battleground of ${stadiumName}. Runes of athletic valor are inscribed along the stadium perimeter.`,
    `A roaring colosseum in ${city}, where thousands of impassioned fans channel psychic fervor into their guild heroes.`,
    `Chilled mountain drafts sweep across ${stadiumName}, testing the fortitude and physical endurance of all contestants.`
  ];

  return {
    stadium: stadiumName || `${city} Colosseum`,
    city: city || 'Realm Core',
    stateOrCountry: 'USA',
    isIndoors: isIndoor,
    isNorthernRealm: isNorthern,
    temperatureF: isIndoor ? 72 : (isNorthern ? 34 : 68),
    weatherCondition: isIndoor ? "Climate-Controlled Arcane Shield" : (isNorthern ? "Sub-Zero Boreal Chill" : "Clear Skies & Mild Breeze"),
    seasonContext: "Active Regular Season / Playoff Gauntlet",
    environmentalBuff: isIndoor ? "+10% Precision on long passes and perimeter field goals" : "+15% Physical Stagger resistance in natural elements",
    environmentalDebuff: isNorthern && !isIndoor ? "-10% Sprint speed on frosted turf" : "None",
    dcSavingThrow: isNorthern ? 14 : 12,
    dndLoreFlavor: loreTemplates[Math.floor(Math.random() * loreTemplates.length)]
  };
}

export async function fetchRealESPNScoreboards(): Promise<{ games: LiveGame[]; teams: SportsTeam[]; source: 'ESPN_LIVE' | 'CACHE' | 'FALLBACK' }> {
  const now = Date.now();
  if (cachedGames.length > 0 && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return { games: cachedGames, teams: cachedTeams, source: 'CACHE' };
  }

  const allFetchedGames: LiveGame[] = [];
  const discoveredTeams: SportsTeam[] = [];

  try {
    const fetchPromises = LEAGUE_ENDPOINTS.map(async ({ league, url }) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) return [];
        const data = await res.json();
        const events: ESPNEvent[] = data.events || [];

        return events.map((ev): LiveGame | null => {
          const comp = ev.competitions?.[0];
          if (!comp) return null;

          const homeComp = comp.competitors.find(c => c.homeAway === 'home');
          const awayComp = comp.competitors.find(c => c.homeAway === 'away');
          if (!homeComp || !awayComp) return null;

          const homeScore = parseInt(homeComp.score || '0', 10);
          const awayScore = parseInt(awayComp.score || '0', 10);

          let status: 'UPCOMING' | 'LIVE' | 'FINAL' = 'UPCOMING';
          if (ev.status?.type?.state === 'in') status = 'LIVE';
          else if (ev.status?.type?.state === 'post' || ev.status?.type?.completed) status = 'FINAL';

          const clock = ev.status?.type?.shortDetail || ev.status?.displayClock || 'Upcoming';
          const period = `P${ev.status?.period || 1}`;

          const stadiumName = comp.venue?.fullName || `${homeComp.team.displayName} Arena`;
          const cityName = comp.venue?.address?.city || homeComp.team.location || 'Colosseum';

          // Team tracking
          [homeComp, awayComp].forEach(c => {
            const teamId = `${league.toLowerCase()}-${c.team.abbreviation?.toLowerCase() || c.team.id}`;
            const primaryColor = c.team.color ? `#${c.team.color}` : '#3b82f6';
            const secondaryColor = c.team.alternateColor ? `#${c.team.alternateColor}` : '#f59e0b';

            if (!discoveredTeams.some(t => t.id === teamId)) {
              discoveredTeams.push({
                id: teamId,
                name: c.team.displayName,
                shortName: c.team.abbreviation || c.team.shortDisplayName || c.team.displayName.slice(0, 3).toUpperCase(),
                city: c.team.location || cityName,
                league,
                conferenceOrDivision: `${league} Division`,
                colors: { primary: primaryColor, secondary: secondaryColor },
                record: {
                  wins: parseInt(c.records?.[0]?.summary?.split('-')?.[0] || '0', 10),
                  losses: parseInt(c.records?.[0]?.summary?.split('-')?.[1] || '0', 10),
                  streak: 'L1',
                  rank: 1
                },
                stats: {
                  pointsPerGame: 24.5,
                  pointsAllowedPerGame: 21.0,
                  form: ['W', 'L', 'W', 'W'],
                  homeRecord: '4-2',
                  awayRecord: '3-3'
                },
                keyPlayers: [],
                isWomensSports: league === 'WNBA' || league === 'NWSL'
              });
            }
          });

          const homeTeamId = `${league.toLowerCase()}-${homeComp.team.abbreviation?.toLowerCase() || homeComp.team.id}`;
          const awayTeamId = `${league.toLowerCase()}-${awayComp.team.abbreviation?.toLowerCase() || awayComp.team.id}`;

          // Format simulated play feed from leaders if live/final
          const samplePlays: LiveGamePlay[] = [];
          if (comp.broadcasts?.[0]?.names?.length) {
            samplePlays.push({
              id: `broadcast-${ev.id}`,
              time: clock,
              quarterOrPeriod: period,
              description: `Broadcast via ${comp.broadcasts[0].names.join(', ')} • Venue: ${stadiumName}`,
              teamId: homeTeamId,
              scoringPlay: false
            });
          }

          return {
            id: `espn-${ev.id}`,
            league,
            homeTeamId,
            awayTeamId,
            homeScore,
            awayScore,
            status,
            clock,
            period,
            venue: stadiumName,
            venueEnvironment: generateDndFlavorForVenue(stadiumName, cityName, league),
            startTime: ev.date,
            plays: samplePlays,
            boxScore: {
              homeTeamStats: {
                Score: homeScore,
                Record: homeComp.records?.[0]?.summary || '0-0'
              },
              awayTeamStats: {
                Score: awayScore,
                Record: awayComp.records?.[0]?.summary || '0-0'
              },
              topPerformers: []
            }
          };
        }).filter((g): g is LiveGame => g !== null);
      } catch (err) {
        console.warn(`ESPN fetch failed for ${league}:`, err);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(leagueGames => {
      allFetchedGames.push(...leagueGames);
    });

    if (allFetchedGames.length > 0) {
      cachedGames = allFetchedGames;
      cachedTeams = discoveredTeams.length > 0 ? discoveredTeams : INITIAL_TEAMS;
      lastFetchTimestamp = now;
      return { games: cachedGames, teams: cachedTeams, source: 'ESPN_LIVE' };
    }
  } catch (globalErr) {
    console.warn('Global ESPN fetch failed, falling back to seed database:', globalErr);
  }

  // Fallback to initial games
  return { games: INITIAL_GAMES, teams: INITIAL_TEAMS, source: 'FALLBACK' };
}
