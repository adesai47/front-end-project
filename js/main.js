'use strict';
const teamsContainer = document.getElementById('teams-container');
const eplApiUrl =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL?key=d96ee95088b9438aa8c07a785c81b6e9';
const espApiUrl =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/ESP?key=d96ee95088b9438aa8c07a785c81b6e9';
const frlApiUrl =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/FRL1?key=d96ee95088b9438aa8c07a785c81b6e9';
async function fetchTeamLogos(apiUrl, filterTeams) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const filteredTeams = filterTeams
      ? data.filter((team) => filterTeams.includes(team.Name))
      : data;
    if (teamsContainer) {
      filteredTeams.forEach((team) => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
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
    console.error('Error fetching team logos:', error);
  }
}
fetchTeamLogos(eplApiUrl, [
  'Arsenal FC',
  'Manchester United FC',
  'Liverpool FC',
]);
fetchTeamLogos(espApiUrl, ['FC Barcelona', 'Real Madrid CF']);
fetchTeamLogos(frlApiUrl, ['Paris Saint-Germain FC']);
