import board from '../models/board';
import { ObjectId } from 'mongodb';
import * as columnService from './column.service';
import { socket } from './server.service';

export const createBoard = async (params: any) => {
  const newBoard = new board(params);
  await newBoard.save();
  socket.emit('board', 'add', newBoard);
  return newBoard;
}

export const findBoardById = (id: string) => {
  return board.findById(new ObjectId(id));
}

export const findBoards = () => {
  return board.find({});
}

export const updateBoard = async (id: string, params: any) => {
  const boardId = new ObjectId(id);
  const updatedBoard = await board.findByIdAndUpdate(boardId, params, { new: true });
  socket.emit('board', 'add', updatedBoard);
  return updatedBoard;
}

export const deleteBoardById = async (boardId: string) => {
  const id = new ObjectId(boardId);
  const deletedBoard = await board.findByIdAndDelete(id);
  await columnService.deleteColumnByParams({ boardId });
  return deletedBoard;
}