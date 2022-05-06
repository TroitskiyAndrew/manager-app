import task from '../models/task';
import { ObjectId } from 'mongodb';
import * as fileService from '../services/file.service';

export const createTask = async (params: any) => {
  const newTask = new task(params);
  await newTask.save();
  return newTask;
}

export const findOneTask = (params: any) => {
  return task.findOne(params);
}

export const findTaskById = (id: string) => {
  return task.findById(new ObjectId(id));
}

export const findTasks = (params: any) => {
  return task.find(params);
}

export const updateTask = (id: string, params: any) => {
  const taskId = new ObjectId(id);
  return task.findByIdAndUpdate(taskId, params, { new: true })
}

export const deleteTaskById = async (taskId: string) => {
  const id = new ObjectId(taskId);
  const deletedTask = await task.findByIdAndDelete(id);
  await fileService.deletedFilesByTask(taskId);
  return deletedTask;
}

export const deleteTaskByParams = async (params: any) => {
  const tasks = await task.find(params);
  for (const onTask of tasks) {
    deleteTaskById(onTask._id);
  }
}

export const clearUserInTasks = async (userId: string) => {
  const tasks = await task.find({});
  for (const onTask of tasks) {
    const userIndex = onTask.users.findIndex((item: string) => item == userId)
    if (userIndex > 0) {
      onTask.users.splice(userIndex, 1);
      updateTask(onTask._id, { users: onTask.users });
    }
  }
}