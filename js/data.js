'use strict';
const API_KEY = 'd96ee95088b9438aa8c07a785c81b6e9';
const API_URLS = {
  EPL: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL',
  ESP: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/ESP',
  FRL1: 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/FRL1',
};
const TEAM_NAMES = [
  'Manchester United FC',
  'FC Barcelona',
  'Real Madrid CF',
  'Arsenal FC',
  'Paris Saint-Germain FC',
  'Liverpool FC',
];
async function fetchTeams(apiUrl) {
  const response = await fetch(`${apiUrl}?key=${API_KEY}`);
  const data = await response.json();
  return data.filter((team) => TEAM_NAMES.includes(team.Name));
}
