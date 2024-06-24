const API_KEY = 'd96ee95088b9438aa8c07a785c81b6e9';
const API_URL = 'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL';

export interface Team {
  TeamId: number;
  Name: string;
  WikipediaLogoUrl: string;
}

const TEAM_NAMES = [
  'Manchester United',
  'FC Barcelona',
  'Real Madrid',
  'Arsenal',
  'PSG',
  'Liverpool',
];

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(`${API_URL}?key=${API_KEY}`);
  const data = await response.json();
  return data.filter((team: Team) => TEAM_NAMES.includes(team.Name)) as Team[];
}