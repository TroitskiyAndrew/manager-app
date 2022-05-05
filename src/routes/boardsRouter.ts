import express from 'express';
import * as boardsContollers from '../controllers/boardsContollers'
import columnsRouter from './columnsRouter';

const jsonParser = express.json();


const boardsRouter = express.Router();
boardsRouter.use('/:id/columns', columnsRouter);

boardsRouter.get('/', boardsContollers.getBoards);

boardsRouter.get('/:id', boardsContollers.getBoardById);

boardsRouter.post('/', jsonParser, boardsContollers.createBoard);

boardsRouter.put('/:id', jsonParser, boardsContollers.updateBoard);

boardsRouter.delete('/:id', boardsContollers.deleteBoard);


export default boardsRouter;