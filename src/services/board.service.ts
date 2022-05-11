import board from '../models/board';
import { ObjectId } from 'mongodb';
import * as columnService from './column.service';
import { socket } from './server.service';

export const createBoard = async (params: any, emit = true, notify = true) => {
  const newBoard = new board(params);
  await newBoard.save();
  if (emit) {
    socket.emit('boards', {
      action: 'added',
      notify: notify,
      boards: [newBoard]
    });
  }
  return newBoard;
}

export const findBoardById = (id: string) => {
  return board.findById(new ObjectId(id));
}

export const findBoards = () => {
  return board.find({});
}

export const findBoardsByUser = async (userId: string) => {
  const allBoards = await board.find({});
  return allBoards.filter(item => item.owner === userId || item.users.includes(userId))
}

export const updateBoard = async (id: string, params: any, emit = true, notify = true) => {
  const boardId = new ObjectId(id);
  const updatedBoard = await board.findByIdAndUpdate(boardId, params, { new: true });
  if (emit) {
    socket.emit('boards', {
      action: 'edited',
      notify: notify,
      boards: [updatedBoard]
    });
  }
  return updatedBoard;
}

export const deleteBoardById = async (boardId: string, emit = true, notify = true) => {
  const id = new ObjectId(boardId);
  const deletedBoard = await board.findByIdAndDelete(id);
  await columnService.deleteColumnByParams({ boardId });
  if (emit) {
    socket.emit('boards', {
      action: 'deleted',
      notify: notify,
      boards: [deletedBoard]
    });
  }
  return deletedBoard;
}

export const deleteBoardByParams = async (params: any) => {
  const boards = await board.find(params);
  const deletedBoards = [];
  for (const onBoard of boards) {
    deletedBoards.push(await deleteBoardById(onBoard._id, false));
  }
  socket.emit('boards', {
    action: 'deleted',
    notify: false,
    columns: deletedBoards
  });
}