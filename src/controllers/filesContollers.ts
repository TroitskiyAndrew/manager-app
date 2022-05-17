import { Response, Request } from 'express';
import { createError } from '../services/error.service';
import fs from 'fs';
import * as fileService from '../services/file.service';



export const getFile = async (req: Request, res: Response) => {
  const path = `files/${req.params.taskId}-${req.params.fileName}`
  fs.readFile(path, (err, file) => {
    if (err) {
      return res.status(404).send(createError(404, "file not founded"));
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file)
  });
};

export const getFilesByBoard = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  try {
    const files = await fileService.findFiles({ boardId });
    res.json(files);
  } catch (error) {

  }
};

export const findFiles = async (req: Request, res: Response) => {
  const boards = req.query.boards as string[];
  if (boards) {
    const allFiles = await fileService.findFiles({});
    return res.json(allFiles.filter(oneFile => boards.includes(oneFile.boardId)));
  } else {
    return res.status(400).send(createError(400, 'Bad request'));
  }
};

export const uploadFile = async (req: Request, res: Response) => {

  if (req.params.error === "file exist") {
    return res.status(402).send(createError(402, "file exist"));
  } else if (req.params.error === "file not allowed") {
    return res.status(400).send(createError(400, "only images"));
  } else if (req.params.error) {
    return res.status(400).send(createError(400, req.params.error));
  }
  return res.json(await fileService.getFileById(req.params.fileId));
};

export const deleteFile = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  try {
    const deletedFile = await fileService.deleteFileById(req.params.fileId, guid);
    res.json(deletedFile);
  }
  catch (err) { return console.log(err); }
};

