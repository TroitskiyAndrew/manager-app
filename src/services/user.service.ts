import user from '../models/user';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import * as boardService from './board.service';
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

export const deleteUserById = async (userId: string, guid: string, emit = true, notify = false) => {
  const id = new ObjectId(userId);
  const deletedUser = await user.findByIdAndDelete(id);
  taskService.deleteTaskByParams({ userId }, guid);
  boardService.deleteBoardByParams({ owner: userId }, guid);
  taskService.clearUserInTasks(userId, guid);
  if (emit) {
    socket.emit('users', {
      action: 'edited',
      notify: notify,
      users: [deletedUser]
    });
  }
  return deletedUser;
}