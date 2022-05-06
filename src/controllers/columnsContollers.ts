import { Response, Request } from 'express';
import * as columnService from '../services/column.service';
import { checkBody, createError } from '../services/error.service';


export const getColumns = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  try {
    const foundedColumns = await columnService.findColumns({ boardId });
    res.json(foundedColumns);
  } catch (err) {
    console.log(err);
  }
};

export const getColumnById = async (req: Request, res: Response) => {
  try {
    const foundedColumn = await columnService.findColumnById(req.params['columnId']);
    if (foundedColumn) {
      res.json(foundedColumn);
    } else {
      return res.send(createError(404, 'Column was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const createColumn = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { title, order } = req.body;

  try {
    const newColumn = await columnService.createColumn({ title, order, boardId });
    res.json(newColumn);
  }
  catch (err) { return console.log(err); }

};

export const updateColumn = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title, order } = req.body;

  try {
    const updatedColumn = await columnService.updateColumn(req.params['columnId'], { title, order })
    res.json(updatedColumn);
  }
  catch (err) { return console.log(err); }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const deletedColumn = await columnService.deleteColumnById(req.params['columnId']);
    res.json(deletedColumn);
  }
  catch (err) { return console.log(err); }
};