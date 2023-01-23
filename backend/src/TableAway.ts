import ClassificationTable from './Classification';
import ITable from './interfaces/ITable';
import IFinishedMatch, { TTeamId } from './interfaces/IFinishedMatch';

export default class TableAway extends ClassificationTable {
  public classification = this.initialPoints;

  addDraw = (teams: TTeamId[]) => {
    this.classification[teams[1]].totalDraws += 1;
  };

  addPoints = (
    teams: TTeamId[],
    goals: number[],
  ) => {
    if (goals[0] < goals[1]) {
      this.classification[teams[1]].totalPoints += 3;
      this.addVictory(teams[1]);
      return;
    }
    if (goals[0] > goals[1]) {
      this.addLose(teams[1]);
      return;
    }
    this.classification[teams[1]].totalPoints += 1;
    this.addDraw(teams);
  };

  addGames = (teams: TTeamId[]) => {
    this.classification[teams[0]].totalGames += 1;
  };

  addGoalsOwn = (
    teams: TTeamId[],
    goals: number[],
  ) => {
    this.classification[teams[0]].goalsOwn += goals[0];
  };

  addGoalsFavor = (
    teamAway: TTeamId[],
    awayTeamGoals: number[],
  ) => {
    this.classification[teamAway[0]].goalsFavor += awayTeamGoals[0];
  };

  handleMatches = (matches: IFinishedMatch[]) => {
    matches.forEach(({ homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId }) => {
      this.addPoints([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      this.addGames([awayTeamId]);
      this.addGoalsOwn([awayTeamId], [homeTeamGoals]);
      this.addGoalsFavor([awayTeamId], [awayTeamGoals]);
      this.updateGoalsBalance(awayTeamId);
      this.addEfficiency(awayTeamId);
    });
  };

  compareGoalsOwn = (a: ITable, b: ITable) => a.goalsOwn - b.goalsOwn;

  compareGoalsFavor = (a: ITable, b: ITable) => {
    if (b.goalsFavor === a.goalsFavor) return false;
    return b.goalsFavor - a.goalsFavor;
  };

  compareGoalsBalance = (a: ITable, b: ITable) => {
    if (b.goalsBalance === a.goalsBalance) return false;
    return b.goalsBalance - a.goalsBalance;
  };

  compareVictory = (a: ITable, b: ITable) => {
    if (b.totalVictories === a.totalVictories) return false;
    return b.totalVictories - a.totalVictories;
  };

  handleDraw = (a: ITable, b: ITable) => {
    const byVictories = this.compareVictory(a, b);
    if (byVictories) return byVictories;

    const byGoalsBalance = this.compareGoalsBalance(a, b);
    if (byGoalsBalance) return byGoalsBalance;

    const byGoalsFavor = this.compareGoalsFavor(a, b);
    if (byGoalsFavor) return byGoalsFavor;

    const byGoalsOwn = this.compareGoalsOwn(a, b);
    return byGoalsOwn;
  };

  filterTable = () => {
    const table = Object.values(this.classification);
    const filtered = table.sort((a, b) => {
      if (b.totalPoints === a.totalPoints) return this.handleDraw(a, b);
      return b.totalPoints - a.totalPoints;
    });
    return filtered;
  };
}
