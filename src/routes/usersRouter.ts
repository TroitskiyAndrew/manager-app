import express from 'express';
import * as usersContollers from '../controllers/usersContollers'

const jsonParser = express.json();


const usersRouter = express.Router();

usersRouter.get('/', usersContollers.getItems);

usersRouter.get('/:id', usersContollers.getItemById);

usersRouter.post('/', jsonParser, usersContollers.createUser);

usersRouter.put('/', jsonParser, usersContollers.updateUser);

usersRouter.delete('/:id', usersContollers.deleteUser);

export default usersRouter;