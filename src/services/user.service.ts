import user from '../models/user';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import { socket } from './server.service';

export const createUser = async (params: any, emit = true, notify = false) => {
  const newUser = new user(params);
  await newUser.save();
  if (emit) {
    socket.emit('users', {
      action: 'added',
      notify: notify,
      users: [newUser]
    });
  }
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

export const updateUser = async (id: string, params: any, emit = true, notify = false) => {
  const userId = new ObjectId(id);
  const updatedUser = await user.findByIdAndUpdate(userId, params, { new: true })
  if (emit) {
    socket.emit('users', {
      action: 'edited',
      notify: notify,
      users: [updatedUser]
    });
  }
  return updatedUser;
}

export const deleteUserById = async (userId: string, emit = true, notify = false) => {
  const id = new ObjectId(userId);
  const deletedUser = await user.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ userId });
  await taskService.clearUserInTasks(userId);
  if (emit) {
    socket.emit('users', {
      action: 'edited',
      notify: notify,
      users: [deletedUser]
    });
  }
  return deletedUser;
}