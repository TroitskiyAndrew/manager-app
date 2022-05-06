import user from '../models/user';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import { io } from './server.service';

export const createUser = async (params: any) => {
  const newUser = new user(params);
  await newUser.save();
  io.emit('login', newUser);
  return newUser;
}

export const findUserById = (id: string) => {
  return user.findById(new ObjectId(id));
}

export const findUsers = () => {
  return user.find({});
}

export const findOneUser = (params: any) => {
  return user.findOne(params);
}

export const updateUser = (id: string, params: any) => {
  const userId = new ObjectId(id);
  return user.findByIdAndUpdate(userId, params, { new: true })
}

export const deleteUserById = async (userId: string) => {
  const id = new ObjectId(userId);
  const deletedUser = await user.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ userId });
  await taskService.clearUserInTasks(userId);
  return deletedUser;
}