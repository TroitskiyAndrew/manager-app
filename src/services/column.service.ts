import column from '../models/column';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import { socket } from './server.service';

export const createColumn = async (params: any) => {
  const newColumn = new column(params);
  await newColumn.save();
  socket.emit('columns', 'add', newColumn);
  return newColumn;
}

export const findOneColumn = (params: any) => {
  return column.findOne(params);
}

export const findColumnById = (id: string) => {
  return column.findById(new ObjectId(id));
}

export const findColumns = (params: any) => {
  return column.find(params);
}

export const updateColumn = async (id: string, params: any) => {
  const columnId = new ObjectId(id);
  const updatedColumn = await column.findByIdAndUpdate(columnId, params, { new: true })
  socket.emit('columns', 'add', updatedColumn);
  return updatedColumn;
}

export const deleteColumnById = async (columnId: string) => {
  const id = new ObjectId(columnId);
  const deletedColumn = await column.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ columnId });
  socket.emit('columns', 'remove', deletedColumn);
  return deletedColumn;
}

export const deleteColumnByParams = async (params: any) => {
  const columns = await column.find(params);
  for (const onColumn of columns) {
    deleteColumnById(onColumn._id);
  }
}
