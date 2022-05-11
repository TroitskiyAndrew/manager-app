import express from 'express';
import * as columnsSetContollers from '../controllers/columnsSetContollers'

const jsonParser = express.json();


const columnsSetRouter = express.Router();


columnsSetRouter.post('/', jsonParser, columnsSetContollers.updateSetOfColumns);


export default columnsSetRouter;