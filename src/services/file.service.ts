import file from '../models/file';
import fs from 'fs';
import { ObjectId } from 'mongodb';

export const createFile = async (params: any) => {
  const newFile = new file(params);
  await newFile.save();
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

export const deleteFileById = async (id: string) => {
  const fileId = new ObjectId(id);
  const deletedFile = await file.findByIdAndDelete(fileId);
  fs.unlink(deletedFile.path, (err) => {
    if (err) console.log(err);
  });
  return deletedFile;
}

export const deletedFilesByTask = async (taskId: string) => {
  const files = await file.find({ taskId });
  for (const onFile of files) {
    deleteFileById(onFile._id);
  }
}