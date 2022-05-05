import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import task from '../models/task';
import { checkBody, createError } from '../services/error.service';


export const getTasks = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  const columnId = req.baseUrl.split('/')[4];
  try {
    const foundedTasks = await task.find({ boardId, columnId });
    res.json(foundedTasks);
  } catch (err) {
    console.log(err);
  }
};

export const getTaskById = async (req: Request, res: Response) => {

  const taskId = new ObjectId(req.params['taskId']);
  try {
    const foundedTasks = await task.findById(taskId);
    if (foundedTasks) {
      res.json(foundedTasks);
    } else {
      return res.send(createError(404, 'Task was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const createTask = async (req: Request, res: Response) => {

  const boardId = req.baseUrl.split('/')[2];
  const columnId = req.baseUrl.split('/')[4];

  const bodyError = checkBody(req.body, ['title', 'order', 'description', 'userId', 'users'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { title, order, description, userId, users } = req.body;

  if (users.length === 0) {
    users.push(userId);
  }

  const newTask = new task({ title, order, description, userId, boardId, columnId, users });

  try {
    await newTask.save();
    res.json(newTask);
  }
  catch (err) { return console.log(err); }

};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = new ObjectId(req.params['taskId']);

  const bodyError = checkBody(req.body, ['title', 'order', 'description', 'userId', 'boardId', 'columnId', 'users'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title, order, description, userId, boardId, columnId, users } = req.body;

  if (users.length === 0) {
    users.push(userId);
  }

  try {
    const updatedTask = await task.findOneAndUpdate({ _id: taskId }, { title, order, description, userId, boardId, columnId, users }, { new: true });
    res.json(updatedTask);
  }
  catch (err) { return console.log(err); }
};

export const deleteTask = async (req: Request, res: Response) => {

  const taskId = new ObjectId(req.params.taskId);
  try {
    const deletedTask = await task.findByIdAndDelete(taskId);
    res.json(deletedTask);
  }
  catch (err) { return console.log(err); }
};
