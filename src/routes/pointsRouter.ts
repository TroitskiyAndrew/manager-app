import express from 'express';
import * as pointsContollers from '../controllers/pointsContollers'

const jsonParser = express.json();


const pointsRouter = express.Router();


pointsRouter.get('/', pointsContollers.findPoints);

pointsRouter.get('/:boardId', pointsContollers.getPoints);

pointsRouter.post('/', jsonParser, pointsContollers.createPoint);

pointsRouter.patch('/', jsonParser, pointsContollers.updateSetOfPoints);

pointsRouter.put('/:pointId', jsonParser, pointsContollers.updatePoint);

pointsRouter.delete('/:pointId', pointsContollers.deletePoint);

export default pointsRouter;