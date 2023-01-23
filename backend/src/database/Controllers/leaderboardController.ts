import { Request, Response } from 'express';
import 'express-async-errors';
import leaderboardService from '../Services/leaderBoardService';

const getLeaderBoard = async (req: Request, res: Response) => {
  const data = await leaderboardService.getLeaderBoard();
  return res.status(200).json(data);
};

const getLeaderBoardHome = async (req: Request, res: Response) => {
  const data = await leaderboardService.getLeaderBoardHome();
  return res.status(200).json(data);
};

const getLeaderBoardAway = async (req: Request, res: Response) => {
  const data = await leaderboardService.getLeaderBoardAway();
  return res.status(200).json(data);
};

export default {
  getLeaderBoard,
  getLeaderBoardHome,
  getLeaderBoardAway,
};
