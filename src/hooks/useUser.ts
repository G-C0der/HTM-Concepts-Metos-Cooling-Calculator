import {UserForm} from "../types";
import {getErrorMessage, toApiResponse} from "./utils";
import {userApi} from "../services/api";

const useUser = () => {
  const register = async (form: UserForm) => {
    try {
      const { wasEmailSent } = await userApi.register(form);
      return toApiResponse(true, undefined, { wasEmailSent });
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { wasEmailSent } = await userApi.sendVerificationEmail(email);

      if (!wasEmailSent) throw new Error('Failed to send verification email.');

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

  const sendResetPasswordEmail = async (email: string) => {
    try {
      await userApi.sendResetPasswordEmail(email);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const verifyResetPasswordToken = async (token: string) => {
    try {
      await userApi.verifyResetPasswordToken(token);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await userApi.resetPassword(token, password);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const list = async () => {
    try {
      const { users } = await userApi.list();
      return toApiResponse(true, undefined, { users });
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const activate = async (id: string) => {
    try {
      const { wasEmailSent } = await userApi.changeActiveState(id, true);
      return toApiResponse(true, undefined, { wasEmailSent });
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const deactivate = async (id: string) => {
    try {
      await userApi.changeActiveState(id, false);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  return {
    register,
    sendVerificationEmail,
    verify,
    sendResetPasswordEmail,
    verifyResetPasswordToken,
    resetPassword,
    list,
    activate,
    deactivate
  };
};

export {
  useUser
};