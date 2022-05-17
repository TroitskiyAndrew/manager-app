import file from '../models/file';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';

export const createFile = async (params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const newFile = new file(params);
  await newFile.save();
  if (emit) {
    socket.emit('files', {
      action: 'added',
      notify: notify,
      files: [newFile],
      guid,
      initUser,
      exceptUsers: [],
    });
  }
  return newFile;
}

export const findOneFile = (params: any) => {
  return file.findOne(params);
}

export const getFileById = (id: string) => {
  return file.findById(new ObjectId(id));
}

export const findFiles = (params: any) => {
  return file.find(params);
}

export const deleteFileById = async (id: string, guid: string, initUser: string, emit = true, notify = true) => {
  const fileId = new ObjectId(id);
  const deletedFile = await file.findByIdAndDelete(fileId);
  fs.unlink(deletedFile.path, (err) => {
    if (err) console.log(err);
  });
  if (emit) {
    socket.emit('files', {
      action: 'deleted',
      notify: notify,
      files: [deletedFile],
      guid,
      initUser,
      exceptUsers: [],
    });
  }
  return deletedFile;
}

export const deletedFilesByTask = async (taskId: string, guid: string, initUser: string) => {
  const files = await file.find({ taskId });
  const deletedFiles = [];
  for (const onFile of files) {
    deletedFiles.push(await deleteFileById(onFile._id, guid, initUser, false));
  }
  socket.emit('files', {
    action: 'deleted',
    notify: false,
    files: deletedFiles,
    guid,
    initUser,
    exceptUsers: [],
  });
}