import point from '../models/point';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';

export const createPoint = async (params: any, guid: string, emit = true, notify = true) => {
  const newPoint = new point(params);
  await newPoint.save();
  if (emit) {
    socket.emit('points', {
      action: 'added',
      notify: notify,
      points: [newPoint],
      guid,
      exceptUsers: [],
    });
  }
  return newPoint;
}

export const createSetOfPoints = async (taskId: string, boardId: string, newPoints: any[], guid: string) => {
  if (newPoints.length === 0) {
    return [];
  }
  const createdPoints = [];
  for (const onePoint of newPoints) {
    createdPoints.push(await createPoint({ ...onePoint, taskId, boardId }, guid, false));
  }
  socket.emit('points', {
    action: 'added',
    notify: false,
    points: createdPoints,
    guid,
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

export const updatePoint = async (id: string, params: any, guid: string, emit = true, notify = false) => {
  const pointId = new ObjectId(id);
  const updatedPoint = await point.findByIdAndUpdate(pointId, params, { new: true })
  if (emit) {
    socket.emit('points', {
      action: 'edited',
      notify: notify,
      points: [updatedPoint],
      guid,
      exceptUsers: [],
    });
  }
  return updatedPoint;
}

export const deletePointById = async (pointId: string, guid: string, emit = true, notify = false) => {
  const id = new ObjectId(pointId);
  const deletedPoint = await point.findByIdAndDelete(id);
  if (emit) {
    socket.emit('points', {
      action: 'deleted',
      notify: notify,
      points: [deletedPoint],
      guid,
      exceptUsers: [],
    });
  }
  return deletedPoint;
}

export const deletePointsByParams = async (params: any, guid: string) => {
  const points = await point.find(params);
  const deletedPoints = [];
  for (const onPoint of points) {
    deletedPoints.push(await deletePointById(onPoint._id, guid, false));
  }
  socket.emit('points', {
    action: 'deleted',
    notify: false,
    points: deletedPoints,
    guid,
    exceptUsers: [],
  });
}


