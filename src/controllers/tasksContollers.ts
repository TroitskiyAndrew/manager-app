import { Response, Request } from 'express';
import * as taskService from '../services/task.service';
import { checkBody, createError } from '../services/error.service';



export const getTasks = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  const columnId = req.baseUrl.split('/')[4];
  try {
    const foundedTasks = await taskService.findTasks({ boardId, columnId });
    res.json(foundedTasks);
  } catch (err) {
    console.log(err);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const foundedTask = await taskService.findTaskById(req.params['taskId']);
    if (foundedTask) {
      res.json(foundedTask);
    } else {
      return res.status(404).send(createError(404, 'Task was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const createTask = async (req: Request, res: Response) => {

  const boardId = req.baseUrl.split('/')[2];
  const columnId = req.baseUrl.split('/')[4];

  const bodyError = checkBody(req.body, ['title', 'order', 'description', 'userId', 'boardId', 'columnId', 'users'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }

  const { title, order, description, userId, users } = req.body;
  try {
    const newTask = await taskService.createTask({ title, order, description, userId, boardId, columnId, users });
    res.json(newTask);
  }
  catch (err) { return console.log(err); }

};

export const updateTask = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['title', 'order', 'description', 'userId', 'boardId', 'columnId', 'users'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { title, order, description, userId, boardId, columnId, users } = req.body;

  try {
    const updatedTask = await taskService.updateTask(req.params.taskId, { title, order, description, userId, boardId, columnId, users });
    res.json(updatedTask);
  }
  catch (err) { return console.log(err); }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await taskService.deleteTaskById(req.params.taskId);
    res.json(deletedTask);
  }
  catch (err) { return console.log(err); }
};
