import {ApiResponse} from "../types";
import {hasDatePassed} from "../utils";

const isTokenExpired = (tokenExpiration: string | null) => hasDatePassed(tokenExpiration);

const toApiResponse = (success?: boolean, error?: string, data?: any): ApiResponse => ({
  success: success,
  error: error,
  data: data
});

const getErrorMessage = (err: any) => err.response ? err.response.data : err.message;

export {
  isTokenExpired,
  toApiResponse,
  getErrorMessage
};