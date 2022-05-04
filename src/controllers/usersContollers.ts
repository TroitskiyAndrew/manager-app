import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import user from '../models/user';


export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await user.find({});
    const requestString = req.query.request as string;
    if (requestString) {
      res.json(items.filter(item => item.name.toUpperCase().includes(requestString.toUpperCase())));
    }
    res.json(items);
  } catch (err) {
    console.log(err);
  }
};



export const getItemById = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params['id']);
  try {
    const item = await user.find({ _id: id });
    res.json(item);
  }
  catch (err) {
    return console.log(err);
  }

};

export const createUser = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);

  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = new user({ name: userName, age: userAge });

  try {
    await newUser.save();
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};

export const updateUser = async (req: Request, res: Response) => {

  if (!req.body) return res.sendStatus(400);
  const id = new ObjectId(req.body.id);
  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = { age: userAge, name: userName };

  try {
    const updatedUser = await user.findOneAndUpdate({ _id: id }, newUser, { new: true });
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