import { type Request, type Response } from 'express';
import httpStatus from '../config/httpStatusCodes';

// type error no hace falta importarlo. viene por default

const errorMiddleware = (err: Error, req: Request, res: Response) => {
  console.error(err); // Loggear el error para depuración
  if (err instanceof Error) {
    res.status(httpStatus.internalServerError).send({
      error: err.message || 'Un error inesperado ocurrió, contacta con el administrador del sistema.',
    });
  }
};

export default errorMiddleware;
