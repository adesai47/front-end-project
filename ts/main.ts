const API_KEY = 'd96ee95088b9438aa8c07a785c81b6e9';

interface Team {
  TeamId: number;
  Name: string;
  WikipediaLogoUrl: string;
}

const TEAM_NAMES = [
  'Manchester United FC',
  'FC Barcelona',
  'Real Madrid CF',
  'Arsenal FC',
  'Paris Saint-Germain FC',
  'Liverpool FC',
];

interface Player {
  PlayerID: number;
  CommonName: string;
  Position: string;
  TeamID: number;
  Jersey: number;
}

const API_URLS = {
  EPL: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL',
  ESP: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/ESP',
  FRL1: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/FRL1',
};

const POSITION_MAP: { [key: string]: string } = {
  D: 'Defender',
  A: 'Attacker',
  M: 'Midfielder',
};

async function fetchTeams(apiUrl: string): Promise<Team[]> {
  const response = await fetch(`${apiUrl}?key=${API_KEY}`);
  const data = await response.json();
  return data.filter((team: Team) => TEAM_NAMES.includes(team.Name)) as Team[];
}

const teamsContainer: HTMLElement | null =
  document.getElementById('teams-container');
const starting11Container: HTMLElement | null = document.getElementById(
  'starting11-container',
);
const teamLogoElement: HTMLImageElement | null = document.getElementById(
  'team-logo',
) as HTMLImageElement;
const titleElement: HTMLElement | null = document.getElementById('title');

const starting11ApiUrls: { [key: string]: string } = {
  'Arsenal FC':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/EPL/509?key=d96ee95088b9438aa8c07a785c81b6e9',
  'Manchester United FC':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/EPL/517?key=d96ee95088b9438aa8c07a785c81b6e9',
  'Liverpool FC':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/EPL/515?key=d96ee95088b9438aa8c07a785c81b6e9',
  'FC Barcelona':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/ESP/559?key=d96ee95088b9438aa8c07a785c81b6e9',
  'Real Madrid CF':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/ESP/605?key=d96ee95088b9438aa8c07a785c81b6e9',
  'Paris Saint-Germain FC':
    'https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/FRL1/600?key=d96ee95088b9438aa8c07a785c81b6e9',
};

async function loadTeams(): Promise<void> {
  try {
    const teamsEPL = await fetchTeams(API_URLS.EPL);
    const teamsESP = await fetchTeams(API_URLS.ESP);
    const teamsFRL1 = await fetchTeams(API_URLS.FRL1);

    const teams = [...teamsEPL, ...teamsESP, ...teamsFRL1];

    if (teamsContainer) {
      teamsContainer.innerHTML = '';
      teams.forEach((team: Team) => {
        const teamElement: HTMLElement = document.createElement('div');
        teamElement.classList.add('team');
        teamElement.innerHTML = `
          <div class="team-logo">
            <img src="${team.WikipediaLogoUrl}" alt="${team.Name}">
          </div>
          <div class="team-name"><p>${team.Name}</p></div>
        `;
        teamElement
          .querySelector('.team-logo')
          ?.addEventListener('click', () => {
            console.log(`Team clicked: ${team.Name}`);
            if (teamLogoElement) {
              teamLogoElement.src = team.WikipediaLogoUrl;
              teamLogoElement.alt = team.Name;
            }
            if (titleElement) {
              titleElement.textContent = team.Name;
            }
            loadStarting11(team.Name);
          });
        teamsContainer.appendChild(teamElement);
      });
    }
  } catch (error) {
    console.error('Error loading teams:', error);
  }
}

async function loadStarting11(teamName: string): Promise<void> {
  const apiUrl = starting11ApiUrls[teamName];
  if (!apiUrl || !starting11Container) return;

  try {
    const response: Response = await fetch(apiUrl);
    const players: Player[] = await response.json();
    console.log(`Fetched players for ${teamName}:`, players);
    starting11Container.innerHTML = '';

    players.forEach((player: Player) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('player');
      playerElement.innerHTML = `
        <div class="player-jersey">#${player.Jersey}</div>
        <div class="player-name">${player.CommonName}</div>
        <div class="player-position">${POSITION_MAP[player.Position] || player.Position}</div>
      `;
      starting11Container.appendChild(playerElement);
    });

    showPage('starting11-view');
  } catch (error) {
    console.error('Error loading starting 11:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const teamsTab = document.getElementById('teams-tab');
  const favoritesTab = document.getElementById('favorites-tab');

  if (teamsTab && favoritesTab) {
    teamsTab.addEventListener('click', () => {
      showPage('teams-view');
    });

    favoritesTab.addEventListener('click', () => {
      showPage('favorites-view');
    });
  }

  loadTeams();
});

function showPage(pageId: string): void {
  console.log(`Showing page: ${pageId}`);
  const pages = document.querySelectorAll('main section');
  pages.forEach((page) => {
    page.classList.remove('active');
  });
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
  }

  if (pageId === 'teams-view' && teamLogoElement) {
    teamLogoElement.src = '';
    teamLogoElement.alt = 'FootRanking';
    if (titleElement) {
      titleElement.textContent = 'FootRanking';
    }
  }
}
