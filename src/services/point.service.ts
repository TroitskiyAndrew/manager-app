import point from '../models/point';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';

export const createPoint = async (params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const newPoint = new point(params);
  await newPoint.save();
  if (emit) {
    socket.emit('points', {
      action: 'added',
      notify: notify,
      points: [newPoint],
      guid,
      initUser,
      exceptUsers: [],
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
    action: 'added',
    notify: false,
    points: createdPoints,
    guid,
    initUser,
    exceptUsers: [],
  });
  return createdPoints;
}


export const findPoints = (params: any) => {
  return point.find(params);
}

export const findPointById = (id: string) => {
  return point.findById(new ObjectId(id));
}

export const updatePoint = async (id: string, params: any, guid: string, initUser: string, emit = true, notify = false) => {
  const pointId = new ObjectId(id);
  const updatedPoint = await point.findByIdAndUpdate(pointId, params, { new: true })
  if (emit) {
    socket.emit('points', {
      action: 'edited',
      notify: notify,
      points: [updatedPoint],
      guid,
      initUser,
      exceptUsers: [],
    });
  }
  return updatedPoint;
}

export const deletePointById = async (pointId: string, guid: string, initUser: string, emit = true, notify = false) => {
  const id = new ObjectId(pointId);
  const deletedPoint = await point.findByIdAndDelete(id);
  if (emit) {
    socket.emit('points', {
      action: 'deleted',
      notify: notify,
      points: [deletedPoint],
      guid,
      initUser,
      exceptUsers: [],
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
    action: 'deleted',
    notify: false,
    points: deletedPoints,
    guid,
    initUser,
    exceptUsers: [],
  });
}


