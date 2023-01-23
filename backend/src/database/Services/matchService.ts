import MatchesModel, { AwayTeams, HomeTeams } from '../models/matchesModel';
import IFieldsMatch from '../../interfaces/IFieldsMatch';

type Tgoals = {
  homeTeamGoals: number;
  awayTeamGoals: number;
};

const getAll = async () => {
  const data = await MatchesModel.findAll({ include: [
    { association: HomeTeams, attributes: { exclude: ['id'] } },
    { association: AwayTeams, attributes: { exclude: ['id'] } },
  ] });
  return data;
};

const getByProgress = async (inProgress: string) => {
  const data = await getAll();
  const response = data
    .filter((match) => String(match.inProgress) === inProgress);
  return response;
};

const createMatchInprogress = async (infos: IFieldsMatch) => {
  const infoWithProgress = { ...infos, inProgress: 1 };
  const data = await MatchesModel.create(infoWithProgress);
  return data;
};

const getById = async (id: number) => {
  const data = await MatchesModel.findOne({ where: { id } });
  return data;
};

const updateProgress = async (id: number) => {
  await MatchesModel.update({ inProgress: 0 }, { where: { id } });
};

const updateResults = async (id: number, body: Tgoals) => {
  const { homeTeamGoals, awayTeamGoals } = body;
  await MatchesModel.update(
    { homeTeamGoals, awayTeamGoals },
    { where: { id, inProgress: 1 } },
  );
};

export default {
  getAll,
  getByProgress,
  createMatchInprogress,
  getById,
  updateProgress,
  updateResults,
};
