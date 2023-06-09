import { createContext } from "react";
import {ApiResponse, UserForm} from "../types";

type UserContextType = {
  register: (userFormData: UserForm) => Promise<ApiResponse>;
  sendVerificationEmail: (email: string) => Promise<ApiResponse>;
  verify: (token: string) => Promise<ApiResponse>;
  sendResetPasswordEmail: (email: string) => Promise<ApiResponse>;
  verifyResetPasswordToken: (token: string) => Promise<ApiResponse>;
  resetPassword: (token: string, password: string) => Promise<ApiResponse>;
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
} as UserContextType);

export {
  UserContext
};