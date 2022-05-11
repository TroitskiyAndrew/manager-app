import { Response, Request } from 'express';
import * as pointService from '../services/point.service';
import { checkBody, createError } from '../services/error.service';
import { socket } from '../services/server.service';



export const getPoints = async (req: Request, res: Response) => {
  const boardId = req.params['boardId'];
  try {
    const foundedPoints = await pointService.findPoints({ boardId });
    res.json(foundedPoints);
  } catch (err) {
    console.log(err);
  }
};

export const createPoint = async (req: Request, res: Response) => {


  const bodyError = checkBody(req.body, ['title', 'taskId', 'boardId', 'done']);
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }

  const { title, taskId, boardId, done } = req.body;
  try {
    const newPoint = await pointService.createPoint({ title, taskId, boardId, done });
    res.json(newPoint);
  }
  catch (err) { return console.log(err); }

};

export const updatePoint = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['title', 'taskId', 'boardId', 'done']);
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { title, done } = req.body;

  try {
    const updatedPoint = await pointService.updatePoint(req.params.pointId, { title, done });
    res.json(updatedPoint);
  }
  catch (err) { return console.log(err); }
};

export const updateSetOfPoints = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['points']);
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { points } = req.body;

  if (points.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 point'));
  }

  const updatedPoints = [];
  for (const onePoint of points) {
    const pointError = checkBody(onePoint, ['_id', 'title', 'taskId', 'boardId', 'done'])
    if (pointError) {
      return res.status(400).send(createError(400, pointError));
    }
    const { _id, done } = onePoint;

    const foundedColumns = await pointService.findPointById(_id);
    if (!foundedColumns) {
      return res.status(404).send(createError(404, 'Point was not founded!'));
    }
    try {
      updatedPoints.push(await pointService.updatePoint(_id, { done }, false));
    }
    catch (err) { return console.log(err); }

  }
  socket.emit('points', {
    action: 'edited',
    notify: false,
    tasks: updatedPoints,
  });
};

export const deletePoint = async (req: Request, res: Response) => {
  try {
    const deletedPoint = await pointService.deletePointById(req.params.pointId);
    res.json(deletedPoint);
  }
  catch (err) { return console.log(err); }
};
