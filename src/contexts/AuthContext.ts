import { createContext } from "react";
import {ApiResponse, Credentials, User} from "../types";
import {ContextProviderError} from "../errors";

type AuthContextType = {
  authenticatedUser: User | null;
  token: null | string;
  login: (credentials: Credentials) => Promise<ApiResponse>;
  logout: () => void;
};

const providerName = 'AuthProvider';
const AuthContext = createContext({
  authenticatedUser: null,
  token: null,
  login: () => { throw new ContextProviderError(providerName, 'login'); },
  logout: () => { throw new ContextProviderError(providerName, 'logout'); }
} as AuthContextType);

export {
  AuthContext
};