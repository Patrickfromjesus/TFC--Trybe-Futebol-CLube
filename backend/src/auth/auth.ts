import { Request } from 'express';
import 'dotenv/config';
import { verify } from 'jsonwebtoken';
import IPayload from '../interfaces/IPayload';

const SECRET = String(process.env.JWT_SECRET);

const validateToken = (req: Request): IPayload => {
  try {
    const token = req.header('Authorization');
    if (!token) return { ok: true };
    const result = verify(token, SECRET);
    return result as IPayload;
  } catch (error) {
    return { ok: true, message: 'Token must be a valid token' };
  }
};

export default validateToken;
