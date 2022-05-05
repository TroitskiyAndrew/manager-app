import { Response, Request } from 'express';
import { createError } from '../services/error.service';
import fs from 'fs';
import file from '../models/file';



export const getFile = async (req: Request, res: Response) => {
  const path = `files/${req.params.taskId}-${req.params.fileName}`
  fs.readFile(path, (err, file) => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file)
  });
};

export const getFilesByTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  try {
    const files = await file.find({ taskId });
    res.json(files);
  } catch (error) {

  }
};

export const uploadFile = async (req: Request, res: Response) => {

  if (req.params.error === "file exist") {
    return res.send(createError(402, "file exist"));
  } else if (req.params.error === "file not allowed") {
    return res.send(createError(400, "only images"));
  }
  return res.send(createError(200, 'file uploaded'));
};

