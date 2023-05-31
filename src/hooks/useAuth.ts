import {useEffect, useState} from "react";
import { authApi } from "../services/api";
import {isTokenExpired, toApiResponse, getErrorMessage} from "./utils";
import {Credentials} from "../types";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(localStorage.getItem('tokenExpiration'));

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

  const login = async (credentials: Credentials) => {
    try {
      const { token, expiration } = await authApi.login(credentials);

      if (typeof token === 'string' && token.length) {
        setToken(token);
        setTokenExpiration(expiration);

        return toApiResponse(true);
      }

      throw new Error('Failed to log in');
    } catch (err: any) {
      return toApiResponse(false, getErrorMessage(err));
    }
  };

  const logout = () => {
    setToken(null);
    setTokenExpiration(null);
  };

  return {
    token,
    login,
    logout
  };
};

export {
  useAuth
};