import express from 'express';
import * as columnsContollers from '../controllers/columnsContollers'

const jsonParser = express.json();


const columnsRouter = express.Router();

columnsRouter.get('/', columnsContollers.getColumns);

columnsRouter.get('/:id', columnsContollers.getColumnById);

columnsRouter.post('/', jsonParser, columnsContollers.createColumn);

columnsRouter.put('/:id', jsonParser, columnsContollers.updateColumn);

columnsRouter.delete('/:id', columnsContollers.deleteColumn);

export default columnsRouter;