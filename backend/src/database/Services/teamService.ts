import TeamsModel from '../models/teamsModel';

const getAll = async () => {
  const data = await TeamsModel.findAll();
  return data;
};

const getById = async (id: number) => {
  const data = await TeamsModel.findOne({ where: { id } });
  return data;
};

export default {
  getAll,
  getById,
};
