import point from '../models/point';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';
import * as boardService from './board.service';

export const createPoint = async (params: any, guid: string, initUser: string, emit = true) => {
  const newPoint = new point(params);
  await newPoint.save();
  if (emit) {
    socket.emit('points', {
      action: 'add',
      users: boardService.getUserIdsByBoardsIds([newPoint.boardId]),
      ids: [newPoint._id],
      guid,
      initUser
    });
  }
  return newPoint;
}

export const createSetOfPoints = async (taskId: string, boardId: string, newPoints: any[], guid: string, initUser: string) => {
  if (newPoints.length === 0) {
    return [];
  }
  const createdPoints = [];
  for (const onePoint of newPoints) {
    createdPoints.push(await createPoint({ ...onePoint, taskId, boardId }, guid, initUser, false));
  }
  socket.emit('points', {
    action: 'add',
    users: boardService.getUserIdsByBoardsIds(createdPoints.map(item => item.boardId)),
    ids: createdPoints.map(item => item._id),
    guid,
    initUser,
  });
  return createdPoints;
}


export const findPoints = (params: any) => {
  return point.find(params);
}

export const findPointById = (id: string) => {
  return point.findById(new ObjectId(id));
}

export const updatePoint = async (id: string, params: any, guid: string, initUser: string, emit = true) => {
  const pointId = new ObjectId(id);
  const updatedPoint = await point.findByIdAndUpdate(pointId, params, { new: true })
  if (emit) {
    socket.emit('points', {
      action: 'update',
      users: boardService.getUserIdsByBoardsIds([updatedPoint.boardId]),
      ids: [updatedPoint._id],
      guid,
      initUser
    });
  }
  return updatedPoint;
}

export const deletePointById = async (pointId: string, guid: string, initUser: string, emit = true) => {
  const id = new ObjectId(pointId);
  const deletedPoint = await point.findByIdAndDelete(id);
  if (emit) {
    socket.emit('points', {
      action: 'delete',
      users: boardService.getUserIdsByBoardsIds([deletedPoint.boardId]),
      ids: [deletedPoint._id],
      guid,
      initUser
    });
  }
  return deletedPoint;
}

export const deletePointsByParams = async (params: any, guid: string, initUser: string) => {
  const points = await point.find(params);
  const deletedPoints = [];
  for (const onPoint of points) {
    deletedPoints.push(await deletePointById(onPoint._id, guid, initUser, false));
  }
  socket.emit('points', {
    action: 'delete',
    users: boardService.getUserIdsByBoardsIds(deletedPoints.map(item => item.boardId)),
    ids: deletedPoints.map(item => item._id),
    guid,
    initUser,
  });
}


