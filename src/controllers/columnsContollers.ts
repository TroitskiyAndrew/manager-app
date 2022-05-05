import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import column from '../models/column';
import { checkBody, createError } from '../services/error.service';


export const getColumns = async (_: Request, res: Response) => {
  try {
    const foundedColumns = await column.find({});
    res.json(foundedColumns);
  } catch (err) {
    console.log(err);
  }
};

export const getColumnById = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params['id']);
  try {
    const foundedColumns = await await column.findById(id);
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

  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { title, order } = req.body;

  const newColumn = new column({ title, order });

  try {
    await newColumn.save();
    res.json(newColumn);
  }
  catch (err) { return console.log(err); }

};

export const updateColumn = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params['id']);

  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title, order } = req.body;

  try {
    const updatedColumn = await column.findOneAndUpdate({ _id: id }, { title, order }, { new: true });
    res.json(updatedColumn);
  }
  catch (err) { return console.log(err); }
};

export const deleteColumn = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);
  try {
    const deletedColumn = await column.findByIdAndDelete(id);
    res.json(deletedColumn);
  }
  catch (err) { return console.log(err); }
};