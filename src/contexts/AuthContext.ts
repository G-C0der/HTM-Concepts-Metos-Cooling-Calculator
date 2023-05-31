import { createContext } from "react";
import {ApiResponse, Credentials} from "../types";

type AuthContextType = {
  token: null | string;
  login: (credentials: Credentials) => Promise<ApiResponse>;
  logout: () => void;
};

const AuthContext = createContext({
  token: null,
  login: () =>
    { throw new Error('login: AuthProvider is not set up. Wrap the app with an AuthProvider.'); },
  logout: () =>
    { throw new Error('logout: AuthProvider is not set up. Wrap the app with an AuthProvider.'); }
} as AuthContextType);

export {
  AuthContext
};