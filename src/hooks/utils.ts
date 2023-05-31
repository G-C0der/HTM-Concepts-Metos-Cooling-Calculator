import {APIResponse} from "../types";
import {hasDatePassed} from "../utils";

const isTokenExpired = (tokenExpiration: string | null) => hasDatePassed(tokenExpiration);

const toAPIResponse = (success?: boolean, error?: string, data?: any): APIResponse => ({
  success: success,
  error: error,
  data: data
});

const getErrorMessage = (err: any) => err.response ? err.response.data : err.message;

export {
  isTokenExpired,
  toAPIResponse,
  getErrorMessage
};