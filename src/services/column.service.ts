import column from '../models/column';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';

export const createColumn = async (params: any) => {
  const newColumn = new column(params);
  await newColumn.save();
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

export const updateColumn = (id: string, params: any) => {
  const columnId = new ObjectId(id);
  return column.findByIdAndUpdate(columnId, params, { new: true })
}

export const deleteColumnById = async (columnId: string) => {
  const id = new ObjectId(columnId);
  const deletedColumn = await column.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ columnId });
  return deletedColumn;
}

export const deleteColumnByParams = async (params: any) => {
  const columns = await column.find(params);
  for (const onColumn of columns) {
    deleteColumnById(onColumn._id);
  }
}
