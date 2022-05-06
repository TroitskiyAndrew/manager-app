import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from "socket.io";

import isAuth from '../middleWares/isAuth';
import mung from '../middleWares/mung';
import authRouter from '../routes/authRouter';
import boardsRouter from '../routes/boardsRouter';
import filesRouter from '../routes/filesRouter';
import tasksSetRouter from '../routes/tasksSetRouter';
import usersRouter from '../routes/usersRouter';


export const app = express();
export const server = http.createServer(app);
export const socket = new Server(server, {
  cors: {
    origin: '*'
  }
});
app.use(cors({ origin: '*' }));
app.use(mung);
app.use(isAuth);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/boards', boardsRouter);
app.use('/tasksSet', tasksSetRouter);
app.use('/file', filesRouter);
app.use('/files', express.static('files'));