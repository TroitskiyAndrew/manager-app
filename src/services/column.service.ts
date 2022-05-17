import column from '../models/column';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import { socket } from './server.service';

export const createColumn = async (params: any, guid: string, emit = true, notify = true) => {
  const newColumn = new column(params);
  await newColumn.save();
  if (emit) {
    socket.emit('columns', {
      action: 'added',
      notify: notify,
      columns: [newColumn],
      guid,
      exceptUsers: [],
    });
  }
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

export const updateColumn = async (id: string, params: any, guid: string, emit = true, notify = true) => {
  const columnId = new ObjectId(id);
  const updatedColumn = await column.findByIdAndUpdate(columnId, params, { new: true })
  if (emit) {
    socket.emit('columns', {
      action: 'edited',
      notify: notify,
      columns: [updatedColumn],
      guid,
      exceptUsers: [],
    });
  }
  return updatedColumn;
}

export const deleteColumnById = async (columnId: string, guid: string, emit = true, notify = true) => {
  const id = new ObjectId(columnId);
  const deletedColumn = await column.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ columnId }, guid);
  if (emit) {
    socket.emit('columns', {
      action: 'deleted',
      notify: notify,
      columns: [deletedColumn],
      guid,
      exceptUsers: [],
    });
  }
  return deletedColumn;
}

export const deleteColumnByParams = async (params: any, guid: string) => {
  const columns = await column.find(params);
  const deletedColumns = [];
  for (const onColumn of columns) {
    deletedColumns.push(await deleteColumnById(onColumn._id, guid, false));
  }
  socket.emit('columns', {
    action: 'deleted',
    notify: false,
    columns: deletedColumns,
    guid,
    exceptUsers: [],
  });
}
