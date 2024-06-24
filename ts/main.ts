import { fetchTeams, Team } from './data';

document.addEventListener('DOMContentLoaded', () => {
  const teamsTab = document.getElementById('teams-tab') as HTMLButtonElement;
  const favoritesTab = document.getElementById(
    'favorites-tab',
  ) as HTMLButtonElement;
  const teamsView = document.getElementById('teams-view') as HTMLElement;
  const detailsView = document.getElementById('details-view') as HTMLElement;
  const favoritesView = document.getElementById(
    'favorites-view',
  ) as HTMLElement;
  const teamsContainer = document.getElementById(
    'teams-container',
  ) as HTMLElement;
  const clubDetails = document.getElementById('club-details') as HTMLElement;
  const backButton = document.getElementById(
    'back-button',
  ) as HTMLButtonElement;

  const favorites: Team[] = [];

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

  function renderTeams(teams: Team[]): void {
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

  function renderFavorites(): void {
    const favoritesContainer = document.getElementById(
      'favorites-container',
    ) as HTMLElement;
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

  function showTeamDetails(team: Team): void {
    teamsView.classList.remove('active');
    detailsView.classList.add('active');
    clubDetails.innerHTML = `
      <h2>${team.Name}</h2>
      <img src="${team.WikipediaLogoUrl}" alt="${team.Name}" />
      <button id="add-favorite">Add to Favorites</button>
    `;
    const addFavoriteButton = document.getElementById(
      'add-favorite',
    ) as HTMLButtonElement;
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