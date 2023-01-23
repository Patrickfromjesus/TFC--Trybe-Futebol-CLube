import TableHome from '../../TableHome';
import ClassificationTable from '../../Classification';
import IFinishedMatch from '../../interfaces/IFinishedMatch';
import matchService from './matchService';
import TableAway from '../../TableAway';

const getLeaderBoard = async () => {
  const data = await matchService.getByProgress('false');
  const Classification = new ClassificationTable();
  Classification.handleMatches(data as unknown as IFinishedMatch[]);
  const finalTable = Classification.filterTable();
  return finalTable;
};

const getLeaderBoardHome = async () => {
  const data = await matchService.getByProgress('false');
  const Classification = new TableHome();
  Classification.handleMatches(data as unknown as IFinishedMatch[]);
  const finalTable = Classification.filterTable();
  return finalTable;
};

const getLeaderBoardAway = async () => {
  const data = await matchService.getByProgress('false');
  const Classification = new TableAway();
  Classification.handleMatches(data as unknown as IFinishedMatch[]);
  const finalTable = Classification.filterTable();
  return finalTable;
};

export default {
  getLeaderBoard,
  getLeaderBoardHome,
  getLeaderBoardAway,
};
