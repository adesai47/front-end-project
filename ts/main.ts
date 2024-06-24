interface Team {
  TeamID: number;
  Name: string;
  WikipediaLogoUrl: string;
}

const teamsContainer: HTMLElement | null =
  document.getElementById('teams-container');

const eplApiUrl: string =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL?key=d96ee95088b9438aa8c07a785c81b6e9';
const espApiUrl: string =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/ESP?key=d96ee95088b9438aa8c07a785c81b6e9';
const frlApiUrl: string =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/FRL1?key=d96ee95088b9438aa8c07a785c81b6e9';

async function fetchTeamLogos(
  apiUrl: string,
  filterTeams?: string[],
): Promise<void> {
  try {
    const response: Response = await fetch(apiUrl);
    const data: Team[] = await response.json();

    const filteredTeams = filterTeams
      ? data.filter((team: Team) => filterTeams.includes(team.Name))
      : data;

    if (teamsContainer) {
      filteredTeams.forEach((team: Team) => {
        const teamElement: HTMLElement = document.createElement('div');
        teamElement.classList.add('team');

        const teamLogoElement: HTMLElement = document.createElement('div');
        teamLogoElement.classList.add('team-logo');

        const imgElement: HTMLImageElement = document.createElement('img');
        imgElement.src = team.WikipediaLogoUrl;
        imgElement.alt = team.Name;
        teamLogoElement.appendChild(imgElement);

        const teamNameElement: HTMLElement = document.createElement('div');
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
