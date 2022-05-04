import { NextFunction, Request, RequestHandler, Response } from "express";
import { checkToken } from "../services/token.service";

const isAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (['/auth/signin', '/auth/signup'].includes(req.path)) {
    return next();
  }
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && checkToken(token)) {
      return next();
    }
  }
  res.status(403).send('Wrong Authorization')
}

export default isAuth;