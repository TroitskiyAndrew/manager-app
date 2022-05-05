import { Response, Request } from 'express';
import user from '../models/user';
import { checkBody, createError } from '../services/error.service';
import { checkPassword, hashPassword } from '../services/hash.service';
import { signToken } from '../services/token.service';

export const signIn = async (req: Request, res: Response) => {

  console.log(req.cookies);

  const bodyError = checkBody(req.body, ['login', 'password'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { login, password } = req.body;

  const foundedUser = await user.findOne({ login });
  if (foundedUser) {
    const isCorrectPassword = await checkPassword(password, foundedUser.password);
    if (isCorrectPassword) {
      const options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
      }
      const token = signToken(foundedUser._id, login);
      res.cookie('testToken', signToken, options)
      return res.send({ token });
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

  const foundedUser = await user.findOne({ login });
  if (foundedUser) {
    return res.send(createError(402, 'login already exist'));
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new user({ login, name, password: hashedPassword });

  try {
    await newUser.save();
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};
