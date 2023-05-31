import {UserForm} from "../types";
import {getErrorMessage, toApiResponse} from "./utils";
import userApi from "../services/api/UserApi";

const useUser = () => {
  const register = async (userFormData: UserForm) => {
    try {
      const success = await userApi.register(userFormData);

      if (!success) throw new Error('Failed to register');

      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err))
    }
  };

  return {
    register
  };
};

export {
  useUser
};