import {useEffect, useState} from "react";
import { authApi } from "../services/api";
import {isTokenExpired, toApiResponse, getErrorMessage} from "./utils";
import {Credentials, User} from "../types";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(localStorage.getItem('tokenExpiration'));
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  useEffect(() => {
    if (token && tokenExpiration) {
      localStorage.setItem('tokenExpiration', tokenExpiration);
      localStorage.setItem('token', token);
    }
    else localStorage.clear();
  }, [token, tokenExpiration]);

  useEffect(() => {
    if (isTokenExpired(tokenExpiration)) logout();
  }, []);

  useEffect(() => {
    if (token && !authenticatedUser) {
      const syncAuthenticatedUser = async () => {
        const { user } = await authApi.getAuthenticatedUser();

        setAuthenticatedUser(user);
      };

      syncAuthenticatedUser();
    }
  }, [token, authenticatedUser]);

  const login = async (credentials: Credentials) => {
    try {
      const { token, expiration, user } = await authApi.login(credentials);

      if (typeof token === 'string' && token.length) {
        setAuthenticatedUser(user);
        setToken(token);
        setTokenExpiration(expiration);

        return toApiResponse(true);
      }

      throw new Error('Failed to log in.');
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const logout = () => {
    setAuthenticatedUser(null);
    setToken(null);
    setTokenExpiration(null);
  };

  return {
    authenticatedUser,
    token,
    login,
    logout
  };
};

export {
  useAuth
};