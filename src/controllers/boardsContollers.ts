import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import * as boardService from '../services/board.service';
import { checkBody, createError } from '../services/error.service';


export const getBoards = async (_: Request, res: Response) => {
  try {
    const foundedBoards = await boardService.findBoards();
    res.json(foundedBoards);
  } catch (err) {
    console.log(err);
  }
};

export const getBoardById = async (req: Request, res: Response) => {

  try {
    const foundedBoards = await boardService.findBoardById(req.params['boardId']);
    if (foundedBoards) {
      res.json(foundedBoards);
    } else {
      return res.status(404).send(createError(404, 'Board was not founded!'));
    }
  }
  catch (err) {
    return console.log(err);
  }

};

export const createBoard = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['title'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }

  const { title } = req.body;
  try {
    const newBoard = await boardService.createBoard({ title });
    res.json(newBoard);
  }
  catch (err) { return console.log(err); }

};

export const updateBoard = async (req: Request, res: Response) => {
  const boardId = new ObjectId(req.params['boardId']);

  const bodyError = checkBody(req.body, ['title'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { title } = req.body;

  try {
    const updatedBoard = await boardService.updateBoard(req.params['boardId'], { title });
    res.json(updatedBoard);
  }
  catch (err) { return console.log(err); }
};

export const deleteBoard = async (req: Request, res: Response) => {

  try {
    const deletedBoard = await boardService.deleteBoardById(req.params['boardId']);
    res.json(deletedBoard);
  }
  catch (err) { return console.log(err); }
};