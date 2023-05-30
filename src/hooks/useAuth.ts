import {useEffect, useState} from "react";
import { authApi } from "../services/api";
import {isTokenExpired} from "../utils/time";

function useAuth() {
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

  const login = async (email: string, password: string) => {
    const { token, expiration } = await authApi.login({ email, password });

    if (typeof token === 'string' && token.length) {
      setToken(token);
      setTokenExpiration(expiration);
      return token;
    }

    throw new Error('Failed to log in');
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
}

export {
  useAuth
};