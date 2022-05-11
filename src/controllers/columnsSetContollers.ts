import { Response, Request } from 'express';
import * as columnService from '../services/column.service';
import { checkBody, createError } from '../services/error.service';
import { socket } from '../services/server.service';

export const updateSetOfColumns = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['columns'])
  if (bodyError) {
    return res.status(400).send(createError(400, bodyError));
  }
  const { columns } = req.body;
  if (columns.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 column'));
  }
  const updatedColumns = [];
  for (const oneColumn of columns) {
    const columnError = checkBody(oneColumn, ['_id', 'title', 'order', 'boardId', 'columnId'])
    if (columnError) {
      return res.status(400).send(createError(400, columnError));
    }
    const { _id, order } = oneColumn;

    const foundedColumns = await columnService.findColumnById(_id);
    if (!foundedColumns) {
      return res.status(404).send(createError(404, 'Column was not founded!'));
    }
    try {
      updatedColumns.push(await columnService.updateColumn(_id, { order }, false));
    }
    catch (err) { return console.log(err); }

  }
  socket.emit('columns', {
    action: 'edited',
    notify: false,
    tasks: updatedColumns,
  });
  return res.send(createError(200, 'Columns was updated!'));
};

