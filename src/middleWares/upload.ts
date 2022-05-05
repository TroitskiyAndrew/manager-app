import multer from 'multer';
import file from '../models/file'

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
      const existFile = await file.findOne({ taskId, name });
      if (existFile) {
        req.params.error = "file exist";
        next(null, false);
      }
      const newFile = new file({ taskId, name, path })
      await newFile.save();
      next(null, true)
    } else {
      req.params.error = "file not allowed";
      next(null, false);
    }

  }
})