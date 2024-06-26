'use strict';
const teamsContainer = document.getElementById('teams-container');
const starting11Container = document.getElementById('starting11-container');
const starting11ApiUrls = {
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
async function loadTeams() {
  try {
    const teamsEPL = await fetchTeams(API_URLS.EPL);
    const teamsESP = await fetchTeams(API_URLS.ESP);
    const teamsFRL1 = await fetchTeams(API_URLS.FRL1);
    const teams = [...teamsEPL, ...teamsESP, ...teamsFRL1];
    if (teamsContainer) {
      teamsContainer.innerHTML = '';
      teams.forEach((team) => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
        teamElement.addEventListener('click', () => {
          console.log(`Team clicked: ${team.Name}`);
          loadStarting11(team.Name);
        });
        const teamLogoElement = document.createElement('div');
        teamLogoElement.classList.add('team-logo');
        const imgElement = document.createElement('img');
        imgElement.src = team.WikipediaLogoUrl;
        imgElement.alt = team.Name;
        teamLogoElement.appendChild(imgElement);
        const teamNameElement = document.createElement('div');
        teamNameElement.classList.add('team-name');
        teamNameElement.innerHTML = `<p>${team.Name}</p>`;
        teamElement.appendChild(teamLogoElement);
        teamElement.appendChild(teamNameElement);
        teamsContainer.appendChild(teamElement);
      });
    }
  } catch (error) {
    console.error('Error loading teams:', error);
  }
}
async function loadStarting11(teamName) {
  const apiUrl = starting11ApiUrls[teamName];
  if (!apiUrl || !starting11Container) return;
  try {
    const response = await fetch(apiUrl);
    const players = await response.json();
    console.log(`Fetched players for ${teamName}:`, players);
    starting11Container.innerHTML = '';
    players.forEach((player) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('player');
      playerElement.innerHTML = `
        <div class="player-name">${player.CommonName}</div>
        <div class="player-position">${player.Position}</div>
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
function showPage(pageId) {
  console.log(`Showing page: ${pageId}`);
  const pages = document.querySelectorAll('main section');
  pages.forEach((page) => {
    page.classList.remove('active');
  });
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
  }
}
