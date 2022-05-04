import { NextFunction, Request, RequestHandler, Response } from "express";
import { checkToken } from "../services/token.service";

const isAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.path);
  if (req.path = '/auth') {
    next();
  }
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && checkToken(token)) {
      next();
    }
  }
  res.status(403).send('Wrong Authorization')
}

export default isAuth;