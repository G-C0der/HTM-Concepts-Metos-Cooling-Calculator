import { createContext } from "react";
import {ApiResponse, UserForm} from "../types";

type UserContextType = {
  register: (userFormData: UserForm) => Promise<ApiResponse>;
  sendVerificationEmail: (email: string) => Promise<ApiResponse>;
};

const UserContext = createContext({
  register: () =>
  { throw new Error('register: UserProvider is not set up. Wrap the app with an UserProvider.'); },
  sendVerificationEmail: () =>
  { throw new Error('sendVerificationEmail: UserProvider is not set up. Wrap the app with an UserProvider.'); }
} as UserContextType);

export {
  UserContext
};