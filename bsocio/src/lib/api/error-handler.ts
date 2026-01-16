/**
 * ============================================
 * BSOCIO - API Error Handler
 * ============================================
 * Centralized error handling utilities
 */

import { AxiosError } from 'axios';
import { ApiError } from '@/types';

/**
 * Standard error codes for consistent error handling
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Custom API Error class
 */
export class ApiException extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly originalError?: AxiosError<ApiError>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    errors?: Record<string, string[]>,
    originalError?: AxiosError<ApiError>
  ) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
  }

  /**
   * Get first error message from validation errors
   */
  getFirstError(): string | null {
    if (!this.errors) return null;
    const firstKey = Object.keys(this.errors)[0];
    return firstKey ? this.errors[firstKey][0] : null;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.code === ERROR_CODES.VALIDATION_ERROR;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return (
      this.code === ERROR_CODES.UNAUTHORIZED ||
      this.code === ERROR_CODES.FORBIDDEN
    );
  }
}

/**
 * Parse axios error into standardized ApiException
 */
export function parseApiError(error: unknown): ApiException {
  // Handle AxiosError
  if (error instanceof AxiosError) {
    const response = error.response;
    const data = response?.data as ApiError | undefined;

    // Network error (no response)
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        return new ApiException(
          'Request timeout. Please try again.',
          ERROR_CODES.TIMEOUT,
          0,
          undefined,
          error
        );
      }
      return new ApiException(
        'Network error. Please check your connection.',
        ERROR_CODES.NETWORK_ERROR,
        0,
        undefined,
        error
      );
    }

    // Map status codes to error codes
    const statusCode = response.status;
    let errorCode: ErrorCode;
    let message = data?.message || 'An error occurred';

    switch (statusCode) {
      case 400:
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        break;
      case 401:
        errorCode = ERROR_CODES.UNAUTHORIZED;
        message = 'Please log in to continue';
        break;
      case 403:
        errorCode = ERROR_CODES.FORBIDDEN;
        message = 'You do not have permission to perform this action';
        break;
      case 404:
        errorCode = ERROR_CODES.NOT_FOUND;
        message = 'The requested resource was not found';
        break;
      case 422:
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorCode = ERROR_CODES.SERVER_ERROR;
        message = 'Server error. Please try again later.';
        break;
      default:
        errorCode = ERROR_CODES.UNKNOWN_ERROR;
    }

    return new ApiException(
      message,
      errorCode,
      statusCode,
      data?.errors,
      error
    );
  }

  // Handle ApiException (pass through)
  if (error instanceof ApiException) {
    return error;
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new ApiException(
      error.message,
      ERROR_CODES.UNKNOWN_ERROR,
      0
    );
  }

  // Handle unknown error type
  return new ApiException(
    'An unexpected error occurred',
    ERROR_CODES.UNKNOWN_ERROR,
    0
  );
}

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Unable to connect. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.UNAUTHORIZED]: 'Session expired. Please log in again.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.SERVER_ERROR]: 'Something went wrong on our end. Please try again later.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}
