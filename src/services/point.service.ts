import point from '../models/point';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';

export const createPoint = async (params: any, emit = true, notify = true) => {
  const newPoint = new point(params);
  await newPoint.save();
  if (emit) {
    socket.emit('points', {
      action: 'added',
      notify: notify,
      points: [newPoint]
    });
  }
  return newPoint;
}

export const createSetOfPoints = async (taskId: string, boardId: string, newPoints: any[]) => {
  if (newPoints.length === 0) {
    return [];
  }
  const createdPoints = [];
  for (const onePoint of newPoints) {
    createdPoints.push(await createPoint({ ...onePoint, taskId, boardId }, false));
  }
  socket.emit('points', {
    action: 'added',
    notify: false,
    points: createdPoints,
  });
  return createdPoints;
}


export const findPoints = (params: any) => {
  return point.find(params);
}

export const findPointById = (id: string) => {
  return point.findById(new ObjectId(id));
}

export const updatePoint = async (id: string, params: any, emit = true, notify = true) => {
  const pointId = new ObjectId(id);
  const updatedPoint = await point.findByIdAndUpdate(pointId, params, { new: true })
  if (emit) {
    socket.emit('points', {
      action: 'edited',
      notify: notify,
      points: [updatedPoint]
    });
  }
  return updatedPoint;
}

export const deletePointById = async (pointId: string, emit = true, notify = true) => {
  const id = new ObjectId(pointId);
  const deletedPoint = await point.findByIdAndDelete(id);
  if (emit) {
    socket.emit('points', {
      action: 'deleted',
      notify: notify,
      points: [deletedPoint]
    });
  }
  return deletedPoint;
}

export const deletePointsByParams = async (params: any) => {
  const points = await point.find(params);
  const deletedPoints = [];
  for (const onPoint of points) {
    deletedPoints.push(await deletePointById(onPoint._id, false));
  }
  socket.emit('points', {
    action: 'deleted',
    notify: false,
    points: deletedPoints,
  });
}


