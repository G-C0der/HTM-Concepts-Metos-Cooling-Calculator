interface ApiResponse {
  success?: boolean;
  error?: ApiError;
  data?: any;
}

interface ApiError {
  message: string;
  severity: ApiErrorSeverity;
}

type ApiErrorSeverity = 'error' | 'warning';

export type {
  ApiResponse,
  ApiError,
  ApiErrorSeverity
};