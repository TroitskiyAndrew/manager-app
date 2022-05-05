import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import column from '../models/column';
import task from '../models/task';
import { checkBody, createError } from '../services/error.service';


export const getColumns = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  try {
    const foundedColumns = await column.find({ boardId });
    res.json(foundedColumns);
  } catch (err) {
    console.log(err);
  }
};

export const getColumnById = async (req: Request, res: Response) => {

  const columnId = new ObjectId(req.params['columnId']);
  try {
    const foundedColumns = await await column.findById(columnId);
    if (foundedColumns) {
      res.json(foundedColumns);
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

  const newColumn = new column({ title, order, boardId });

  try {
    await newColumn.save();
    res.json(newColumn);
  }
  catch (err) { return console.log(err); }

};

export const updateColumn = async (req: Request, res: Response) => {
  const columnId = new ObjectId(req.params['columnId']);

  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title, order } = req.body;

  try {
    const updatedColumn = await column.findOneAndUpdate({ _id: columnId }, { title, order }, { new: true });
    res.json(updatedColumn);
  }
  catch (err) { return console.log(err); }
};

export const deleteColumn = async (req: Request, res: Response) => {

  const columnId = req.params['columnId'];
  const id = new ObjectId(columnId);
  try {
    const deletedColumn = await column.findByIdAndDelete(id);
    await task.deleteMany({ columnId });
    res.json(deletedColumn);
  }
  catch (err) { return console.log(err); }
};