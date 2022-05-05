import mongoose from 'mongoose';
import express from 'express';
import usersRouter from './routes/usersRouter';
import { PORT } from './constants';
import authRouter from './routes/authRouter';
import isAuth from './middleWares/isAuth';
import cors from 'cors';
import mung from './middleWares/mung';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({ origin: '*' }));
app.use(cookieParser('coockie-secret'));
app.use(mung);
app.use(isAuth);
app.use('/users', usersRouter);
app.use('/auth', authRouter);



(async () => {
  try {
    await mongoose.connect('mongodb+srv://shon:wDvO9AuEsmKx3PHe@cluster0.wusr4.mongodb.net/managerApp');
    app.listen(process.env.PORT || PORT, function () {
      console.log('Сервер ожидает подключения...');
    })
  } catch (error) {
    console.log(error);
  }
})();



process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit();
});
