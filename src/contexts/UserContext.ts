import { createContext } from "react";
import {ApiDataEmailSent, ApiResponse, UserForm, UserFormCredLess} from "../types";

type UserContextType = {
  register: (form: UserForm) => Promise<ApiResponse<ApiDataEmailSent>>;
  sendVerificationEmail: (email: string) => Promise<ApiResponse>;
  verify: (token: string) => Promise<ApiResponse>;
  sendResetPasswordEmail: (email: string) => Promise<ApiResponse>;
  verifyResetPasswordToken: (token: string) => Promise<ApiResponse>;
  resetPassword: (password: string, token?: string) => Promise<ApiResponse>;
  editProfile: (form: UserFormCredLess) => Promise<ApiResponse>;
};

const UserContext = createContext({
  register: () =>
  { throw new Error('register: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  sendVerificationEmail: () =>
  { throw new Error('sendVerificationEmail: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  verify: () =>
  { throw new Error('verify: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  sendResetPasswordEmail: () =>
  { throw new Error('sendResetPasswordEmail: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  verifyResetPasswordToken: () =>
  { throw new Error('verifyResetPasswordToken: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  resetPassword: () =>
  { throw new Error('resetPassword: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  editProfile: () =>
  { throw new Error('editProfile: UserProvider is not set up. Wrap the app with an UserProvider.'); }
} as UserContextType);

export {
  UserContext
};