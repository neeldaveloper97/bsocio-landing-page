/**
 * ============================================
 * BSOCIO ADMIN - API Error Handler
 * ============================================
 * Centralized error handling for API responses
 */

import type { ApiError } from '@/types';

/**
 * Standard error codes
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Error messages for each code
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.UNAUTHORIZED]: 'Session expired. Please login again.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Custom API Exception class
 */
export class ApiException extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    code: ErrorCode = ERROR_CODES.UNKNOWN,
    statusCode: number = 500,
    errors?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
  }

  /**
   * Check if error is of specific code
   */
  is(code: ErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Get first validation error message
   */
  getFirstValidationError(): string | null {
    if (!this.errors) return null;
    const firstField = Object.keys(this.errors)[0];
    if (firstField && this.errors[firstField]?.length > 0) {
      return this.errors[firstField][0];
    }
    return null;
  }
}

/**
 * Get error code from HTTP status
 */
function getErrorCodeFromStatus(status: number): ErrorCode {
  switch (status) {
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 400:
    case 422:
      return ERROR_CODES.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
      return ERROR_CODES.SERVER_ERROR;
    default:
      return ERROR_CODES.UNKNOWN;
  }
}

/**
 * Parse API error response into ApiException
 */
export function parseApiError(error: unknown): ApiException {
  // Already an ApiException
  if (error instanceof ApiException) {
    return error;
  }

  // Network or fetch error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new ApiException(
      ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      ERROR_CODES.NETWORK_ERROR,
      0,
      undefined,
      error
    );
  }

  // API error response object
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    
    if ('statusCode' in apiError || 'message' in apiError) {
      const statusCode = apiError.statusCode || 500;
      const code = getErrorCodeFromStatus(statusCode);
      
      // Handle message being a string or an array of strings (NestJS validation pipe)
      let message: string;
      if (Array.isArray(apiError.message)) {
        message = apiError.message.join('. ');
      } else {
        message = apiError.message || ERROR_MESSAGES[code];
      }
      
      return new ApiException(
        message,
        code,
        statusCode,
        apiError.errors,
        error
      );
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return new ApiException(
      error.message,
      ERROR_CODES.UNKNOWN,
      500,
      undefined,
      error
    );
  }

  // Unknown error type
  return new ApiException(
    ERROR_MESSAGES[ERROR_CODES.UNKNOWN],
    ERROR_CODES.UNKNOWN,
    500,
    undefined,
    error
  );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
}
