import board from '../models/board';
import { ObjectId } from 'mongodb';
import * as columnService from './column.service';
import { socket } from './server.service';

export const createBoard = async (params: any, guid: string, emit = true, notify = true) => {
  const newBoard = new board(params);
  await newBoard.save();
  if (emit) {
    socket.emit('boards', {
      action: 'added',
      notify: notify,
      boards: [newBoard],
      guid,
      exceptUsers: [],
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

export const updateBoard = async (id: string, params: any, guid: string, emit = true, notify = true) => {
  const boardId = new ObjectId(id);
  const updatedBoard = await board.findByIdAndUpdate(boardId, params, { new: true });
  if (emit) {
    socket.emit('boards', {
      action: 'edited',
      notify: notify,
      boards: [updatedBoard],
      guid,
      exceptUsers: [],
    });
  }
  return updatedBoard;
}

export const deleteBoardById = async (boardId: string, guid: string, emit = true, notify = true) => {
  const id = new ObjectId(boardId);
  const deletedBoard = await board.findByIdAndDelete(id);
  await columnService.deleteColumnByParams({ boardId }, guid);
  if (emit) {
    socket.emit('boards', {
      action: 'deleted',
      notify: notify,
      boards: [deletedBoard],
      guid,
      exceptUsers: [],
    });
  }
  return deletedBoard;
}

export const deleteBoardByParams = async (params: any, guid: string) => {
  const boards = await board.find(params);
  const deletedBoards = [];
  for (const onBoard of boards) {
    deletedBoards.push(await deleteBoardById(onBoard._id, guid, false));
  }
  socket.emit('boards', {
    action: 'deleted',
    notify: false,
    columns: deletedBoards,
    guid,
    exceptUsers: [],
  });
}

export const clearUserInBoards = async (userId: string, guid: string) => {
  const boards = await board.find({});
  const clearedBoards = [];
  for (const onBoard of boards) {
    const userIndex = onBoard.users.findIndex((item: string) => item == userId)
    if (userIndex > 0) {
      onBoard.users.splice(userIndex, 1);
      clearedBoards.push(await updateBoard(onBoard._id, { users: onBoard.users }, guid, false));
    }
  }
  socket.emit('boards', {
    action: 'edited',
    notify: false,
    tasks: clearedBoards,
    guid,
    exceptUsers: [],
  });
}