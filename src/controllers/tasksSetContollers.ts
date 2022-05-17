import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import * as taskService from '../services/task.service';
import * as userService from '../services/user.service';
import { checkBody, createError } from '../services/error.service';
import { socket } from '../services/server.service';


export const updateSetOfTask = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const bodyError = checkBody(req.body, ['tasks'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { tasks } = req.body;
  if (tasks.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 task'));
  }
  const updatedTasks = [];
  for (const oneTask of tasks) {
    const taskError = checkBody(oneTask, ['_id', 'title', 'order', 'description', 'userId', 'boardId', 'columnId', 'users'])
    if (taskError) {
      return res.status(400).send(createError(400, taskError));
    }
    const { _id, order, columnId } = oneTask;

    const foundedTasks = await taskService.findTaskById(_id);
    if (!foundedTasks) {
      return res.status(404).send(createError(404, 'Task was not founded!'));
    }
    try {
      updatedTasks.push(await taskService.updateTask(_id, { order, columnId }, guid, false));
    }
    catch (err) { return console.log(err); }

  }
  socket.emit('tasks', {
    action: 'edited',
    notify: false,
    tasks: updatedTasks,
    guid,
    exceptUsers: [],
  });
  return res.send(createError(200, 'Tasks was updated!'));

};

export const findTasks = async (req: Request, res: Response) => {
  const search = req.query.search as string;
  const boards = req.query.boards as string[];
  const allTasks = await taskService.findTasks({});
  if (search) {
    try {
      const allUsers = await userService.findUsers();
      return res.json(allTasks.filter(oneTask => {
        const searchRequest = search.toUpperCase();
        if (oneTask.title.toUpperCase().includes(searchRequest)) {
          return true;
        }
        if (oneTask.description.toUpperCase().includes(searchRequest)) {
          return true;
        }
        const users = [...allUsers.filter(user => user._id === new ObjectId(oneTask.userId) || oneTask.users.includes(user._id))];
        for (const user of users) {

          if (user.name.toUpperCase().includes(searchRequest)) {
            return true;
          }
        }
        return false;

      }));
    }
    catch (err) { return console.log(err); }
  } else if (boards) {
    return res.json(allTasks.filter(oneTask => boards.includes(oneTask.boardId)));
  } else {
    return res.status(400).send(createError(400, 'Bad request'));
  }

};

export const getTasksByBoard = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  try {
    const foundedTasks = await taskService.findTasks({ boardId });
    res.json(foundedTasks);
  } catch (err) {
    console.log(err);
  }
};

