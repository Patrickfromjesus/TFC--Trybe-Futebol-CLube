export type TTeamId = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16);

export default interface IFinishedMatch {
  'id': number;
  'homeTeamId': TTeamId;
  'homeTeamGoals': number;
  'awayTeamId': TTeamId;
  'awayTeamGoals': number;
  'inProgress': boolean,
  'homeTeam': {
    'teamName': string;
  },
  'awayTeam': {
    'teamName': string;
  }
}
