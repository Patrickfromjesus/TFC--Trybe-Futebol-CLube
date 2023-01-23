import { Request, Response } from 'express';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import loginService from '../Services/loginService';
import validateToken from '../../auth/auth';
import 'express-async-errors';

const SECRET = String(process.env.JWT_SECRET);

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await loginService.login({ email });
  compare(password, data?.password as string, (err, resp) => {
    if (err) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    if (resp) {
      const token = sign({ id: data?.id }, SECRET);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'Incorrect email or password' });
  });
};

const checkLogin = async (req: Request, res: Response) => {
  const user = validateToken(req);
  if (user.ok) return res.status(401).json({ message: 'não autorizado.' });
  const data = await loginService.getRole(Number(user.id));
  return res.status(200).json({ role: data?.role });
};

export default {
  login,
  checkLogin,
};
