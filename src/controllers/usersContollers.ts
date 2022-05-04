import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import user from '../models/user';
import { hashPassword } from '../services/hash.service';


export const getUsers = async (_: Request, res: Response) => {
  try {
    const items = await user.find({});
    res.json(items);
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params['id']);
  try {
    const item = await user.findById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).send('User was not founded!');
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const updateUser = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params['id']);

  if (!req.body) return res.sendStatus(400);
  const { login, name, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    const updatedUser = await user.findOneAndUpdate({ _id: id }, { login: login, name: name, password: hashedPassword }, { new: true });
    console.log(updatedUser);
    res.json(updatedUser);
  }
  catch (err) { return console.log(err); }
}

export const deleteUser = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);
  try {
    const deletedUser = await user.findByIdAndDelete(id);
    res.json(deletedUser);
  }
  catch (err) { return console.log(err); }
}