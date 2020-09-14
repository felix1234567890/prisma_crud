import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: 'Ops! We have an error :(',
      error_message: err.message,
      error_status_code: err.statusCode,
      error_details: err?.errorDetails,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Ops! We have an error :(',
    error_message: err.message,
    error_status_code: 500,
  });
};

export default errorHandler;
