import {UserForm} from "../types";
import {getErrorMessage, toApiResponse} from "./utils";
import userApi from "../services/api/UserApi";

const useUser = () => {
  const register = async (userFormData: UserForm) => {
    try {
      const { wasVerificationEmailSent } = await userApi.register(userFormData);
      return toApiResponse(true, undefined, { wasVerificationEmailSent });
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