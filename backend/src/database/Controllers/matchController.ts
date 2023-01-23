import { NextFunction, Request, Response } from 'express';
import matchService from '../Services/matchService';
import validateToken from '../../auth/auth';
import 'express-async-errors';

const getAll = async (req: Request, res:Response) => {
  const response = await matchService.getAll();
  return res.status(200).json(response);
};

const getByProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { inProgress } = req.query;
  if (!inProgress) return next();
  const response = await matchService.getByProgress(inProgress as unknown as string);
  return res.status(200).json(response);
};

const createMatchInprogress = async (req: Request, res: Response) => {
  const user = validateToken(req);
  if (user.ok) return res.status(401).json({ message: user.message });
  const data = await matchService.createMatchInprogress(req.body);
  return res.status(201).json(data);
};

const updateProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  await matchService.updateProgress(Number(id));
  return res.status(200).json({ message: 'Finished' });
};

const updateResults = async (req: Request, res: Response) => {
  const { id } = req.params;
  await matchService.updateResults(Number(id), req.body);
  return res.status(200).json({ message: 'Updated!' });
};

export default {
  getAll,
  getByProgress,
  createMatchInprogress,
  updateProgress,
  updateResults,
};
