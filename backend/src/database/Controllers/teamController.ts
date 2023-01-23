import { Request, Response } from 'express';
import teamService from '../Services/teamService';
import 'express-async-errors';

const getAll = async (req: Request, res: Response) => {
  const response = await teamService.getAll();
  return res.status(200).json(response);
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await teamService.getById(Number(id));
  if (Number(id) !== response?.id) return res.send({ message: {} });
  return res.status(200).json(response);
};

export default {
  getAll,
  getById,
};
