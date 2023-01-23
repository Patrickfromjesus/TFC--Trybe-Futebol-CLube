import ITable from './interfaces/ITable';
import IFinishedMatch, { TTeamId } from './interfaces/IFinishedMatch';
import resetTable from './utils/resetTable';

export default class ClassificationTable {
  readonly initialPoints = {
    1: { ...resetTable[1] },
    2: { ...resetTable[2] },
    3: { ...resetTable[3] },
    4: { ...resetTable[4] },
    5: { ...resetTable[5] },
    6: { ...resetTable[6] },
    7: { ...resetTable[7] },
    8: { ...resetTable[8] },
    9: { ...resetTable[9] },
    10: { ...resetTable[10] },
    11: { ...resetTable[11] },
    12: { ...resetTable[12] },
    13: { ...resetTable[13] },
    14: { ...resetTable[14] },
    15: { ...resetTable[15] },
    16: { ...resetTable[16] },
  };

  public classification = this.initialPoints;

  addVictory = (team: TTeamId) => {
    this.classification[team].totalVictories += 1;
  };

  addDraw = (teams: TTeamId[]) => {
    this.classification[teams[0]].totalDraws += 1;
    this.classification[teams[1]].totalDraws += 1;
  };

  addLose = (team: TTeamId) => {
    this.classification[team].totalLosses += 1;
  };

  addPoints = (
    teams: TTeamId[],
    goals: number[],
  ) => {
    if (goals[0] > goals[1]) {
      this.classification[teams[0]].totalPoints += 3;
      this.addVictory(teams[0]);
      this.addLose(teams[1]);
      return;
    }
    if (goals[0] < goals[1]) {
      this.classification[teams[1]].totalPoints += 3;
      this.addVictory(teams[1]);
      this.addLose(teams[0]);
      return;
    }
    this.classification[teams[0]].totalPoints += 1;
    this.classification[teams[1]].totalPoints += 1;
    this.addDraw(teams);
  };

  addGames = (teams: TTeamId[]) => {
    this.classification[teams[0]].totalGames += 1;
    this.classification[teams[1]].totalGames += 1;
  };

  addGoalsOwn = (
    teams: TTeamId[],
    goals: number[],
  ) => {
    this.classification[teams[1]].goalsOwn += goals[0];
    this.classification[teams[0]].goalsOwn += goals[1];
  };

  addGoalsFavor = (
    teams: TTeamId[],
    teamGoals: number[],
  ) => {
    this.classification[teams[0]].goalsFavor += teamGoals[0];
    this.classification[teams[1]].goalsFavor += teamGoals[1];
  };

  updateGoalsBalance = (team: TTeamId) => {
    const { goalsFavor } = this.classification[team];
    const { goalsOwn } = this.classification[team];
    const balanceGoals = goalsFavor - goalsOwn;
    this.classification[team].goalsBalance = balanceGoals;
  };

  addEfficiency = (team: TTeamId) => {
    const { totalGames } = this.classification[team];
    const { totalPoints } = this.classification[team];
    const efficiency = (totalPoints / (totalGames * 3)) * 100;
    this.classification[team].efficiency = Number.parseFloat(efficiency.toFixed(2));
  };

  handleMatches = (matches: IFinishedMatch[]) => {
    matches.forEach(({ homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId }) => {
      // função para adicionar pontos ao times.
      this.addPoints([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      // adiciona 1 ao total de jogos de homeTeam e awayTeam.
      this.addGames([homeTeamId, awayTeamId]);
      // adiciona homeTeamGoals ao total de GC de awayTeam e awayTeamGoals ao total de GC de homeTeam.
      this.addGoalsOwn([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      // adiciona homeTeamGoals ao total de GP de homeTeam.
      this.addGoalsFavor([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      // atualiza o saldo de gols.
      this.updateGoalsBalance(homeTeamId);
      this.updateGoalsBalance(awayTeamId);
      // atualiza a eficiência.
      this.addEfficiency(homeTeamId);
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
