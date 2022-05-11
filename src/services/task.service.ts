import task from '../models/task';
import { ObjectId } from 'mongodb';
import * as fileService from '../services/file.service';
import { socket } from './server.service';

export const createTask = async (params: any, emit = true, notify = true) => {
  const newTask = new task(params);
  await newTask.save();
  if (emit) {
    socket.emit('tasks', {
      action: 'added',
      notify: notify,
      tasks: [newTask]
    });
  }
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

export const updateTask = async (id: string, params: any, emit = true, notify = true) => {
  const taskId = new ObjectId(id);
  const updatedTask = await task.findByIdAndUpdate(taskId, params, { new: true })
  if (emit) {
    socket.emit('tasks', {
      action: 'edited',
      notify: notify,
      tasks: [updatedTask]
    });
  }
  return updatedTask;
}

export const deleteTaskById = async (taskId: string, emit = true, notify = true) => {
  const id = new ObjectId(taskId);
  const deletedTask = await task.findByIdAndDelete(id);
  await fileService.deletedFilesByTask(taskId);
  if (emit) {
    socket.emit('tasks', {
      action: 'deleted',
      notify: notify,
      tasks: [deletedTask]
    });
  }
  return deletedTask;
}

export const deleteTaskByParams = async (params: any) => {
  const tasks = await task.find(params);
  const deletedTasks = [];
  for (const onTask of tasks) {
    deletedTasks.push(await deleteTaskById(onTask._id, false));
  }
  socket.emit('tasks', {
    action: 'deleted',
    notify: false,
    tasks: deletedTasks,
  });
}

export const clearUserInTasks = async (userId: string) => {
  const tasks = await task.find({});
  const clearedTasks = [];
  for (const onTask of tasks) {
    const userIndex = onTask.users.findIndex((item: string) => item == userId)
    if (userIndex > 0) {
      onTask.users.splice(userIndex, 1);
      clearedTasks.push(await updateTask(onTask._id, { users: onTask.users, emit: false }));
    }
  }
  socket.emit('tasks', {
    action: 'edited',
    notify: false,
    tasks: clearedTasks,
  });
}
