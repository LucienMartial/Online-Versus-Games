import { Request, Response, NextFunction } from "express";

class AppError extends Error {
  public readonly status: number;
  public readonly message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}

function handleAppError(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status).json({ message: err.message });
}

export { AppError, handleAppError };
