import { NextFunction, Request, Response } from 'express';
import IValidateReturn from '../../interfaces/IValidateReturn';

type testNme = { password: string, email: string };

const validateEmail = (email: string): IValidateReturn => {
  const emailRx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRx.test(email)) {
    return { ok: false, status: 401, message: 'Incorrect email or password' };
  }
  return { ok: true };
};

const validatePassword = (password: string): IValidateReturn => {
  if (password.length < 6) {
    return { ok: false, status: 401, message: 'Incorrect email or password' };
  }
  return { ok: true };
};

const validateFieldsPassword = (infos: testNme): IValidateReturn => {
  if (!(Object.keys(infos).includes('password') && infos.password.length !== 0)) {
    return { ok: false, status: 400, message: 'All fields must be filled' };
  }
  return { ok: true };
};

const validateFieldsEmail = (infos: testNme): IValidateReturn => {
  if (!(Object.keys(infos).includes('email') && infos.email.length !== 0)) {
    return { ok: false, status: 400, message: 'All fields must be filled' };
  }
  return { ok: true };
};

const validateFields = (infos: testNme): IValidateReturn => {
  const email = validateFieldsEmail(infos);
  if (!email.ok) return { ok: false, status: email.status, message: email.message };
  const password = validateFieldsPassword(infos);
  if (!password.ok) return { ok: false, status: password.status, message: password.message };
  return { ok: true, message: `${email.message}, ${password.message}` };
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const infos = req.body;
  const fields = validateFields(infos);
  if (!fields.ok) {
    return res.status(fields.status as number).json({ message: fields.message });
  }
  const email = validateEmail(infos.email);
  if (!email.ok) {
    return res.status(email.status as number).json({ message: email.message });
  }
  const password = validatePassword(infos.password);
  if (!password.ok) {
    return res.status(password.status as number).json({ message: password.message });
  }
  next();
};

export default validateLogin;
