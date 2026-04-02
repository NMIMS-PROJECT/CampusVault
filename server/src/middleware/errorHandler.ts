import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Unauthorized access') {
    super(401, message, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Access forbidden') {
    super(403, message, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(404, \\ not found\, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(409, message, 'CONFLICT_ERROR');
  }
}

export class InsufficientCreditsError extends APIError {
  constructor(required: number, available: number) {
    super(402, 'Insufficient credits', 'INSUFFICIENT_CREDITS_ERROR', { required, available });
  }
}

export class DatabaseError extends APIError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(500, message, 'DATABASE_ERROR', details);
  }
}

export class TransactionError extends APIError {
  constructor(message: string = 'Transaction failed', details?: any) {
    super(500, message, 'TRANSACTION_ERROR', details);
  }
}

export class ServerError extends APIError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, message, 'SERVER_ERROR', details);
  }
}

export const errorHandler = (err: Error | APIError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', { name: err.name, message: err.message, stack: err.stack, url: req.url, method: req.method, timestamp: new Date().toISOString() });
  
  let statusCode = 500;
  let errorResponse: any = { success: false, error: 'Internal Server Error', code: 'SERVER_ERROR' };
  
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    errorResponse = { success: false, error: err.message, code: err.code, ...(err.details && { details: err.details }) };
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    errorResponse = { success: false, error: 'Invalid JSON in request body', code: 'PARSE_ERROR' };
  } else {
    errorResponse = { success: false, error: err.message || 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
  }
  
  if (req.id) {
    errorResponse.requestId = req.id;
  }
  
  res.status(statusCode).json(errorResponse);
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
