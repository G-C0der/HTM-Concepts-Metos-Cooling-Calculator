import {UserForm} from "../types";
import {getErrorMessage, toApiResponse} from "./utils";
import {userApi} from "../services/api";

const useUser = () => {
  const register = async (userFormData: UserForm) => {
    try {
      const { wasVerificationEmailSent } = await userApi.register(userFormData);
      return toApiResponse(true, undefined, { wasVerificationEmailSent });
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { wasVerificationEmailSent } = await userApi.sendVerificationEmail(email);

      if (!wasVerificationEmailSent) throw new Error('Failed to send verification email.');

      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const verify = async (token: string) => {
    try {
      await userApi.verify(token);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  return {
    register,
    sendVerificationEmail,
    verify
  };
};

export {
  useUser
};