import mongoose from 'mongoose';
import express from 'express';
import usersRouter from './routes/usersRouter';


const app = express();



app.use('/users', usersRouter);



(async () => {
  try {
    await mongoose.connect('mongodb+srv://shon:wDvO9AuEsmKx3PHe@cluster0.wusr4.mongodb.net/test');
    app.listen(process.env.PORT || 3000, function () {
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
