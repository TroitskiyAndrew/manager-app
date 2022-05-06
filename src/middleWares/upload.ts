import multer from 'multer';
import * as fileService from '../services/file.service';

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'files/')
  },
  filename: (req, fileFromReq, next) => {
    const taskId = req.body.taskId
    const { originalname } = fileFromReq;
    next(null, `${taskId}-${originalname}`);
  }
})
export const upload = multer({
  storage: storage,
  fileFilter: async (req, fileFromReq, next) => {
    if (fileFromReq.mimetype == 'image/png' || fileFromReq.mimetype == 'image/jpeg') {
      const taskId = req.body.taskId;
      const name = fileFromReq.originalname;
      const path = `files/${taskId}-${name}`
      const existFile = await fileService.findOneFile({ taskId, name });
      if (existFile) {
        req.params.error = "file exist";
        next(null, false);
      }
      const newFile = await fileService.createFile({ taskId, name, path });
      req.params.fileId = newFile._id;
      next(null, true)
    } else {
      req.params.error = "file not allowed";
      next(null, false);
    }

  }
})