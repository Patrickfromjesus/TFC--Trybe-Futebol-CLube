import ILogin from '../../interfaces/ILogin';
import UsersModel from '../models/usersModel';

const login = async (infos: ILogin) => {
  const { email } = infos;
  const data = await UsersModel.findOne({ where: { email } });
  return data;
};

const getRole = async (id: number) => {
  const response = await UsersModel.findOne({ where: { id } });
  return response;
};

export default {
  login,
  getRole,
};
