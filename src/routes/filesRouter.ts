import express from 'express';
import * as filesContollers from '../controllers/filesContollers'
import { upload } from '../middleWares/upload';

const jsonParser = express.json();


const filesRouter = express.Router();

filesRouter.get('/:taskId/:fileName', filesContollers.getFile);

filesRouter.get('/:taskId', filesContollers.getFilesByTask);

filesRouter.post('/', upload.single('file'), filesContollers.uploadFile);

filesRouter.delete('/:fileId', filesContollers.deleteFile);

export default filesRouter;