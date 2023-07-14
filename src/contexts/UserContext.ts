import { createContext } from "react";
import {ApiDataEmailSent, ApiDataUserFormEdit, ApiResponse, UserForm, UserFormEdit} from "../types";
import {ContextProviderError} from "../errors";

type UserContextType = {
  register: (form: UserForm) => Promise<ApiResponse<ApiDataEmailSent>>;
  sendVerificationEmail: (email: string) => Promise<ApiResponse>;
  verify: (token: string) => Promise<ApiResponse>;
  sendResetPasswordEmail: (email: string) => Promise<ApiResponse>;
  verifyResetPasswordToken: (token: string) => Promise<ApiResponse>;
  resetPassword: (password: string, token?: string) => Promise<ApiResponse>;
  fetchForm: () => Promise<ApiResponse<ApiDataUserFormEdit>>;
  editProfile: (form: UserFormEdit, id?: string) => Promise<ApiResponse>;
};

const providerName = 'UserProvider';
const UserContext = createContext({
  register: () => { throw new ContextProviderError(providerName, 'register'); },
  sendVerificationEmail: () => { throw new ContextProviderError(providerName, 'sendVerificationEmail'); },
  verify: () => { throw new ContextProviderError(providerName, 'verify'); },
  sendResetPasswordEmail: () => { throw new ContextProviderError(providerName, 'sendResetPasswordEmail'); },
  verifyResetPasswordToken: () => { throw new ContextProviderError(providerName, 'verifyResetPasswordToken'); },
  resetPassword: () => { throw new ContextProviderError(providerName, 'resetPassword'); },
  fetchForm: () => { throw new ContextProviderError(providerName, 'fetchForm') },
  editProfile: () => { throw new ContextProviderError(providerName, 'editProfile'); }
} as UserContextType);

export {
  UserContext
};