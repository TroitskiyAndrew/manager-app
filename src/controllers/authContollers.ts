import { Response, Request } from 'express';
import * as userService from '../services/user.service';
import { checkBody, createError } from '../services/error.service';
import { checkPassword, hashPassword } from '../services/hash.service';
import { signToken } from '../services/token.service';

export const signIn = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['login', 'password'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { login, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser) {
    const isCorrectPassword = await checkPassword(password, foundedUser.password);
    if (isCorrectPassword) {
      return res.send({ token: signToken(foundedUser._id, login) })
    }
  }

  return res.send(createError(401, 'Wrong login/pass combination'));

};


export const signUp = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['name', 'login', 'password'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { login, name, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser) {
    return res.send(createError(402, 'login already exist'));
  }

  const hashedPassword = await hashPassword(password);

  try {
    console.log({ login, name, password: hashedPassword })
    const newUser = await userService.createUser({ login, name, password: hashedPassword });
    console.log(newUser);
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};
