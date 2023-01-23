import { NextFunction, Request, Response } from 'express';
import IFieldsMatch from '../../interfaces/IFieldsMatch';
import teamService from '../Services/teamService';

const validateIsEqualTeams = (teamHome: number, teamAway: number) => {
  if (teamHome === teamAway) {
    return {
      ok: false,
      status: 422,
      message: 'It is not possible to create a match with two equal teams',
    };
  }
  return { ok: true };
};

const validateTeamId = async (team: number) => {
  const data = await teamService.getById(team);
  if (!data) return { ok: false, status: 404, message: 'There is no team with such id!' };
  return { ok: true };
};

const validateTeamsId = async (teamHome: number, teamAway: number) => {
  const resultHome = await validateTeamId(teamHome);
  if (!resultHome.ok) return { ok: false, status: resultHome.status, message: resultHome.message };
  const resultAway = await validateTeamId(teamAway);
  if (!resultAway.ok) return { ok: false, status: resultAway.status, message: resultAway.message };
  return { ok: true };
};

const validateFields = async (fields: IFieldsMatch) => {
  const validTeamId = await validateTeamsId(fields.homeTeamId, fields.awayTeamId);
  if (!validTeamId.ok) {
    return { ok: false, status: validTeamId.status, message: validTeamId.message };
  }
  return { ok: true };
};

const validateMatch = async (req: Request, res: Response, next: NextFunction) => {
  const fields = await validateFields(req.body);
  if (!fields.ok) return res.status(fields.status as number).json({ message: fields.message });
  const { homeTeamId, awayTeamId } = req.body;
  const isEqualTeams = validateIsEqualTeams(homeTeamId, awayTeamId);
  if (!isEqualTeams.ok) {
    return res.status(isEqualTeams.status as number).json({ message: isEqualTeams.message });
  }
  return next();
};

export default validateMatch;
