import {ApiError, ApiErrorSeverity, ApiResponse} from "../types";
import {hasDatePassed} from "../utils";
import {supportContactMessage, unexpectedError} from "../constants";

const isTokenExpired = (tokenExpiration: string | null) => hasDatePassed(tokenExpiration);

const toApiResponse = (success?: boolean, error?: ApiError, data?: any): ApiResponse => ({
  success,
  error,
  data
});

const toApiError = (err: any) => {
  const toApiError = (message: string, severity: ApiErrorSeverity = 'error'): ApiError => ({
    message,
    severity
  });

  const { response } = err;

  if (!response || response.status === 500) return toApiError(`${unexpectedError} ${supportContactMessage}`);

  if (!response.data.message) return toApiError(err.response.data);

  return toApiError(response.data.message, response.data.severity);
};

export {
  isTokenExpired,
  toApiResponse,
  toApiError
};