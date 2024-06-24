import { fetchTeams } from './data';
document.addEventListener('DOMContentLoaded', () => {
  const teamsTab = document.getElementById('teams-tab');
  const favoritesTab = document.getElementById('favorites-tab');
  const teamsView = document.getElementById('teams-view');
  const detailsView = document.getElementById('details-view');
  const favoritesView = document.getElementById('favorites-view');
  const teamsContainer = document.getElementById('teams-container');
  const clubDetails = document.getElementById('club-details');
  const backButton = document.getElementById('back-button');
  const favorites = [];
  teamsTab.addEventListener('click', () => {
    teamsView.classList.add('active');
    detailsView.classList.remove('active');
    favoritesView.classList.remove('active');
  });
  favoritesTab.addEventListener('click', () => {
    teamsView.classList.remove('active');
    detailsView.classList.remove('active');
    favoritesView.classList.add('active');
    renderFavorites();
  });
  backButton.addEventListener('click', () => {
    teamsView.classList.add('active');
    detailsView.classList.remove('active');
  });
  function renderTeams(teams) {
    teamsContainer.innerHTML = '';
    teams.forEach((team) => {
      const teamElement = document.createElement('div');
      teamElement.className = 'team';
      teamElement.innerHTML = `
        <div class="team-logo">
          <img src="${team.WikipediaLogoUrl}" alt="${team.Name}" />
        </div>
        <p>${team.Name}</p>
      `;
      teamElement.addEventListener('click', () => {
        showTeamDetails(team);
      });
      teamsContainer.appendChild(teamElement);
    });
  }
  function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';
    favorites.forEach((team) => {
      const teamElement = document.createElement('div');
      teamElement.className = 'team';
      teamElement.innerHTML = `
        <div class="team-logo">
          <img src="${team.WikipediaLogoUrl}" alt="${team.Name}" />
        </div>
        <p>${team.Name}</p>
      `;
      favoritesContainer.appendChild(teamElement);
    });
  }
  function showTeamDetails(team) {
    teamsView.classList.remove('active');
    detailsView.classList.add('active');
    clubDetails.innerHTML = `
      <h2>${team.Name}</h2>
      <img src="${team.WikipediaLogoUrl}" alt="${team.Name}" />
      <button id="add-favorite">Add to Favorites</button>
    `;
    const addFavoriteButton = document.getElementById('add-favorite');
    addFavoriteButton.addEventListener('click', () => {
      if (!favorites.includes(team)) {
        favorites.push(team);
        alert(`${team.Name} added to favorites!`);
      }
    });
  }
  fetchTeams().then((teams) => {
    renderTeams(teams);
  });
});
