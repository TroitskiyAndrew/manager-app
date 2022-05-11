import express from 'express';
import * as boardsSetContollers from '../controllers/boardsSetContollers'


const boardsSetRouter = express.Router();

boardsSetRouter.get('/:userId', boardsSetContollers.getBoardsByUser);

export default boardsSetRouter;