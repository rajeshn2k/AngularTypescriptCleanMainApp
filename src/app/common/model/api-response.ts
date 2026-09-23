/**
 * Standard API response wrapper for successful responses
 * @template T - The type of data being returned
 */
export interface ApiResponse<T> {
  Success: boolean;
  Data: T;
  Message: string;
  Timestamp: string;
  RequestId: string;
}

/**
 * Error detail structure for error responses
 */
export interface ErrorDetail {
  Code: string;
  Message: string;
  StatusCode: number;
}

/**
 * Standard API error response wrapper
 */
export interface ApiErrorResponse {
  Success: boolean;
  Error: ErrorDetail;
  Timestamp: string;
  RequestId: string;
  Path: string;
}

/**
 * Common error codes that can be used across the application
 */
export enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
}
