import { Response, Request } from 'express';
import * as boardService from '../services/board.service';


export const getBoardsByUser = async (req: Request, res: Response) => {
  try {
    const foundedBoards = await boardService.findBoardsByUser(req.params['userId']);
    res.json(foundedBoards);
  } catch (err) {
    console.log(err);
  }
};

