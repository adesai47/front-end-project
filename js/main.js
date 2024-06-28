'use strict';
const API_KEY = 'd96ee95088b9438aa8c07a785c81b6e9';
const POSITION_MAP = {
  D: 'Defender',
  A: 'Attacker',
  M: 'Midfielder',
  GK: 'Goalkeeper',
};
const TEAM_NAMES = [
  'Manchester United FC',
  'FC Barcelona',
  'Real Madrid CF',
  'Arsenal FC',
  'Paris Saint-Germain FC',
  'Liverpool FC',
];
const COMPETITION_MAP = {
  'Manchester United FC': 'EPL',
  'FC Barcelona': 'ESP',
  'Real Madrid CF': 'ESP',
  'Arsenal FC': 'EPL',
  'Paris Saint-Germain FC': 'FRL1',
  'Liverpool FC': 'EPL',
};
const API_URLS = [
  `https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL?key=${API_KEY}`,
  `https://api.sportsdata.io/v4/soccer/scores/json/Teams/ESP?key=${API_KEY}`,
  `https://api.sportsdata.io/v4/soccer/scores/json/Teams/FRL1?key=${API_KEY}`,
];
const teamsContainer = document.getElementById('teams-container');
const starting11Container = document.getElementById('starting11-container');
const teamLogoElement = document.getElementById('team-logo');
const titleElement = document.getElementById('title');
const favoritesContainer = document.getElementById('favorites-container');
async function fetchTeams() {
  const promises = API_URLS.map((url) =>
    fetch(url).then((response) => response.json()),
  );
  const results = await Promise.all(promises);
  const allTeams = results.flat();
  return allTeams.filter((team) => TEAM_NAMES.includes(team.Name));
}
async function fetchPlayers(competition, teamId) {
  try {
    const url = `https://api.sportsdata.io/v4/soccer/scores/json/PlayersByTeamBasic/${competition}/${teamId}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
}
function createTeamElement(team) {
  const teamElement = document.createElement('div');
  teamElement.classList.add('team');
  teamElement.dataset.teamId = team.TeamId.toString();
  teamElement.dataset.competition = COMPETITION_MAP[team.Name];
  const imgElement = document.createElement('img');
  imgElement.src = team.WikipediaLogoUrl;
  imgElement.alt = team.Name;
  teamElement.appendChild(imgElement);
  const teamNameElement = document.createElement('p');
  teamNameElement.textContent = team.Name;
  teamElement.appendChild(teamNameElement);
  const favoriteButton = document.createElement('button');
  favoriteButton.classList.add('favorite-button');
  updateFavoriteButton(favoriteButton, team.TeamId);
  favoriteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFavoriteTeam(team);
    updateFavoriteButton(favoriteButton, team.TeamId); // Update button text after toggling
  });
  teamElement.appendChild(favoriteButton);
  teamElement.addEventListener('click', () => {
    if (teamLogoElement) {
      teamLogoElement.src = team.WikipediaLogoUrl;
      teamLogoElement.alt = team.Name;
    }
    if (titleElement) {
      titleElement.textContent = team.Name;
    }
    const competition = teamElement.dataset.competition;
    const teamId = teamElement.dataset.teamId;
    if (competition && teamId) {
      loadStarting11(competition, teamId);
    } else {
      console.error('Missing competition or teamId dataset attributes');
    }
  });
  return teamElement;
}
function toggleFavoriteTeam(team) {
  const favorites = getFavoriteTeams();
  const teamIndex = favorites.findIndex((fav) => fav.TeamId === team.TeamId);
  if (teamIndex > -1) {
    favorites.splice(teamIndex, 1);
  } else {
    favorites.push(team);
  }
  localStorage.setItem('favoriteTeams', JSON.stringify(favorites));
  updateFavoritesView();
}
function getFavoriteTeams() {
  const favorites = localStorage.getItem('favoriteTeams');
  return favorites ? JSON.parse(favorites) : [];
}
function updateFavoriteButton(button, teamId) {
  const favorites = getFavoriteTeams();
  const isFavorite = favorites.some((fav) => fav.TeamId === teamId);
  button.textContent = isFavorite ? 'Unfavorite' : 'Favorite';
}
function updateFavoritesView() {
  const favorites = getFavoriteTeams();
  if (favoritesContainer) {
    favoritesContainer.innerHTML = '';
    favorites.forEach((team) => {
      const teamElement = createTeamElement(team);
      favoritesContainer.appendChild(teamElement);
    });
  }
}
async function loadTeams() {
  try {
    const teams = await fetchTeams();
    if (teamsContainer) {
      teamsContainer.innerHTML = '';
      teams.forEach((team) => {
        const teamElement = createTeamElement(team);
        teamsContainer.appendChild(teamElement);
      });
    }
  } catch (error) {
    console.error('Error loading teams:', error);
  }
}
async function loadStarting11(competition, teamId) {
  if (!competition || !teamId || !starting11Container) {
    console.error('Missing competition, teamId, or starting11Container');
    return;
  }
  try {
    const players = await fetchPlayers(competition, parseInt(teamId));
    starting11Container.innerHTML = '';
    players.forEach((player) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('player');
      const jerseyDiv = document.createElement('div');
      jerseyDiv.classList.add('player-jersey');
      jerseyDiv.textContent = `#${player.Jersey}`;
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('player-name');
      nameDiv.textContent = player.CommonName;
      const positionDiv = document.createElement('div');
      positionDiv.classList.add('player-position');
      positionDiv.textContent =
        POSITION_MAP[player.Position] || player.Position;
      playerElement.appendChild(jerseyDiv);
      playerElement.appendChild(nameDiv);
      playerElement.appendChild(positionDiv);
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
      updateFavoritesView();
    });
  }
  loadTeams();
  updateFavoritesView();
});
function showPage(pageId) {
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
