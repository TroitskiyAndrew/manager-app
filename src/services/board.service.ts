import board from '../models/board';
import { ObjectId } from 'mongodb';
import * as columnService from './column.service';

export const createBoard = async (params: any) => {
  const newBoard = new board(params);
  await newBoard.save();
  return newBoard;
}

export const findBoardById = (id: string) => {
  return board.findById(new ObjectId(id));
}

export const findBoards = () => {
  return board.find({});
}

export const updateBoard = (id: string, params: any) => {
  const boardId = new ObjectId(id);
  return board.findByIdAndUpdate(boardId, params, { new: true })
}

export const deleteBoardById = async (boardId: string) => {
  const id = new ObjectId(boardId);
  const deletedBoard = await board.findByIdAndDelete(id);
  await columnService.deleteColumnByParams({ boardId });
  return deletedBoard;
}