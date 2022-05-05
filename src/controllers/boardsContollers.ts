import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import board from '../models/board';
import { checkBody, createError } from '../services/error.service';


export const getBoards = async (_: Request, res: Response) => {
  try {
    const foundedBoards = await board.find({});
    res.json(foundedBoards);
  } catch (err) {
    console.log(err);
  }
};

export const getBoardById = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params['id']);
  try {
    const foundedBoards = await await board.findById(id);
    if (foundedBoards) {
      res.json(foundedBoards);
    } else {
      return res.send(createError(404, 'Board was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const createBoard = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['title'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }

  const { title } = req.body;

  const newBoard = new board({ title });

  try {
    await newBoard.save();
    res.json(newBoard);
  }
  catch (err) { return console.log(err); }

};

export const updateBoard = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params['id']);

  const bodyError = checkBody(req.body, ['title'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title } = req.body;

  try {
    const updatedBoard = await board.findOneAndUpdate({ _id: id }, { title }, { new: true });
    res.json(updatedBoard);
  }
  catch (err) { return console.log(err); }
};

export const deleteBoard = async (req: Request, res: Response) => {

  const id = new ObjectId(req.params.id);
  try {
    const deletedBoard = await board.findByIdAndDelete(id);
    res.json(deletedBoard);
  }
  catch (err) { return console.log(err); }
};