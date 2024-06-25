export const API_KEY = 'd96ee95088b9438aa8c07a785c81b6e9';
export const API_URL =
  'https://api.sportsdata.io/v4/soccer/scores/json/Teams/EPL';

export interface Team {
  TeamId: number;
  Name: string;
  WikipediaLogoUrl: string;
}

export const TEAM_NAMES = [
  'Manchester United',
  'FC Barcelona',
  'Real Madrid',
  'Arsenal',
  'PSG',
  'Liverpool',
];
