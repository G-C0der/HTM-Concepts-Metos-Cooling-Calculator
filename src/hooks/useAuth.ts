import {useEffect, useState} from "react";
import { authApi } from "../services/api";
import {isTokenExpired, toApiResponse, toApiError} from "./utils";
import {Credentials, User} from "../types";

const useAuth = () => {
  const getStorageToken = () => localStorage.getItem('token');
  const getStorageTokenExpiration = () => localStorage.getItem('tokenExpiration');

  const [token, setToken] = useState<string | null>(getStorageToken());
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(getStorageTokenExpiration());
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  const setAuthenticatedUserWrapper = (authenticatedUser: User) => {
    if (!authenticatedUser) logout();

    setAuthenticatedUser(authenticatedUser);
  };

  useEffect(() => {
    if (token && tokenExpiration && (token !== getStorageToken() || tokenExpiration !== getStorageTokenExpiration())) {
      localStorage.setItem('tokenExpiration', tokenExpiration);
      localStorage.setItem('token', token);
    }

    if (!token || !tokenExpiration) localStorage.clear();
  }, [token, tokenExpiration]);

  useEffect(() => {
    if (isTokenExpired(tokenExpiration)) logout();
  }, []);

  useEffect(() => {
    if (token && tokenExpiration && !authenticatedUser) {
      const syncAuthenticatedUser = async () => {
        const { user } = await authApi.getAuthenticatedUser();

        setAuthenticatedUserWrapper(user);
      };

      syncAuthenticatedUser();
    }
  }, [token, authenticatedUser]);

  const login = async (credentials: Credentials) => {
    try {
      const { token, expiration, user } = await authApi.login(credentials);

      if (typeof token === 'string' && token.length) {
        setToken(token);
        setTokenExpiration(expiration);
        setAuthenticatedUserWrapper(user);

        return toApiResponse(true);
      }

      throw new Error('Failed to log in.');
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
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