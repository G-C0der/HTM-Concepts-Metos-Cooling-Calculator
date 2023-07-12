import {ApiDataEmailSent, UserForm, UserFormEdit} from "../types";
import {toApiError, toApiResponse} from "./utils";
import {userApi} from "../services/api";

const useUser = () => {
  const register = async (form: UserForm) => {
    try {
      const data = await userApi.register(form);
      return toApiResponse<ApiDataEmailSent>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { wasEmailSent } = await userApi.sendVerificationEmail(email);

      if (!wasEmailSent) throw new Error('Failed to send verification email.');

      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const verify = async (token: string) => {
    try {
      await userApi.verify(token);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const sendResetPasswordEmail = async (email: string) => {
    try {
      const { wasEmailSent } = await userApi.sendResetPasswordEmail(email);

      if (!wasEmailSent) throw new Error('Failed to send password reset email.');

      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const verifyResetPasswordToken = async (token: string) => {
    try {
      await userApi.verifyResetPasswordToken(token);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const resetPassword = async (password: string, token?: string) => {
    try {
      await userApi.resetPassword(password, token);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const editProfile = async (form: UserFormEdit, id?: string) => {
    try {
      await userApi.editProfile(form, id);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  return {
    register,
    sendVerificationEmail,
    verify,
    sendResetPasswordEmail,
    verifyResetPasswordToken,
    resetPassword,
    editProfile
  };
};

export {
  useUser
};