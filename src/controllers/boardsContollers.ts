import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import board from '../models/board';
import column from '../models/column';
import task from '../models/task';
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

  const boardId = new ObjectId(req.params['boardId']);
  try {
    const foundedBoards = await await board.findById(boardId);
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
  const boardId = new ObjectId(req.params['boardId']);

  const bodyError = checkBody(req.body, ['title'])
  if (bodyError) {
    return res.send(createError(400, bodyError));
  }
  const { title } = req.body;

  try {
    const updatedBoard = await board.findOneAndUpdate({ _id: boardId }, { title }, { new: true });
    res.json(updatedBoard);
  }
  catch (err) { return console.log(err); }
};

export const deleteBoard = async (req: Request, res: Response) => {

  const boardId = req.params['boardId'];
  const id = new ObjectId(boardId);
  try {
    const deletedBoard = await board.findByIdAndDelete(id);
    await column.deleteMany({ boardId });
    await task.deleteMany({ boardId });
    res.json(deletedBoard);
  }
  catch (err) { return console.log(err); }
};