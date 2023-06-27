import {ApiError, ApiErrorSeverity, ApiResponse} from "../types";
import {hasDatePassed} from "../utils";

const isTokenExpired = (tokenExpiration: string | null) => hasDatePassed(tokenExpiration);

const toApiResponse = (success?: boolean, error?: ApiError, data?: any): ApiResponse => ({
  success,
  error,
  data
});

const toApiError = (err: any) => {
  const toApiError = (message: string, severity: ApiErrorSeverity = 'error') => ({
    message,
    severity
  });

  const { response } = err;

  if (!response) return toApiError(err.message);

  if (!response.data.message) return toApiError(err.response.data);

  return toApiError(response.data.message, response.data.severity);
};

export {
  isTokenExpired,
  toApiResponse,
  toApiError
};