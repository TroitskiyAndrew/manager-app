import { Response, Request } from 'express';
import user from '../models/user';
import { signToken } from '../services/token.service';

export const signIn = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);
  const { login, password } = req.body;
  if (!login) {
    res.status(400).send('You need login');
  }
  if (!password) {
    res.status(400).send('You need password');
  }
  const foundedUser = await user.findOne({ login, password });
  if (foundedUser) {
    res.send({ token: signToken(foundedUser._id, login) })
  } else {
    res.status(401).send('Wrong login/pass combination');
  }
};


export const signUp = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);

  const { login, name, password } = req.body;
  const newUser = new user({ login, name, password });

  try {
    await newUser.save();
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};
