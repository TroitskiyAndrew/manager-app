import express from 'express';
import * as authContollers from '../controllers/authContollers'

const jsonParser = express.json();

const authRouter = express.Router();

authRouter.post('/signIn', jsonParser, authContollers.signIn);
authRouter.post('/signUp', jsonParser, authContollers.signUp);

export default authRouter;