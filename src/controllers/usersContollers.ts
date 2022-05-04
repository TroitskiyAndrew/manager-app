import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import user from '../models/user';
import { checkBody, createError } from '../services/error.service';
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
      return res.send(createError(404, 'User was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const updateUser = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params['id']);

  const bodyError = checkBody(req.body, ['name', 'login', 'password'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { login, name, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const updatedUser = await user.findOneAndUpdate({ _id: id }, { login, name: name, password: hashedPassword }, { new: true });
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