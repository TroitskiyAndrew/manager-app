import { Response, Request } from 'express';
import user from '../models/user';
import { checkPassword, hashPassword } from '../services/hash.service';
import { signToken } from '../services/token.service';

export const signIn = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);
  const { login, password } = req.body;
  if (!login) {
    res.status(400).send('You need login');
  } else if (!password) {
    res.status(400).send('You need password');
  } else {
    const foundedUser = await user.findOne({ login });
    if (foundedUser) {
      const isCorrectPassword = await checkPassword(password, foundedUser.password);
      if (isCorrectPassword) {
        res.send({ token: signToken(foundedUser._id, login) })
      }
      else {
        res.status(401).send('Wrong login/pass combination');
      }
    } else {
      res.status(401).send('Wrong login/pass combination');
    }
  }

};


export const signUp = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);

  const { login, name, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const newUser = new user({ login: login, name: name, password: hashedPassword });

  try {
    await newUser.save();
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};
