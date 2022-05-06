import { Response, Request } from 'express';
import * as userService from '../services/user.service';
import { checkBody, createError } from '../services/error.service';
import { hashPassword } from '../services/hash.service';


export const getUsers = async (_: Request, res: Response) => {
  try {
    const foundedUsers = await userService.findUsers();
    res.json(foundedUsers);
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const foundedUser = await userService.findUserById(req.params['id']);
    if (foundedUser) {
      res.json(foundedUser);
    } else {
      return res.send(createError(404, 'User was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params['id'];

  const bodyError = checkBody(req.body, ['name', 'login', 'password'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { login, name, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser && foundedUser.id !== id) {
    return res.send(createError(402, 'login already exist'));
  }

  try {
    const hashedPassword = await hashPassword(password);
    const updatedUser = await userService.updateUser(id, { login, name: name, password: hashedPassword });
    res.json(updatedUser);
  }
  catch (err) { return console.log(err); }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    res.json(deletedUser);
  }
  catch (err) { return console.log(err); }
}