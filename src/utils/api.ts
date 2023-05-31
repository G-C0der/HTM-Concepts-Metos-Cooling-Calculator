import {APIResponse} from "../types";

const toAPIResponse = (success?: boolean, error?: string, data?: any): APIResponse => ({
  success: success,
  error: error,
  data: data
});

export {
  toAPIResponse
};