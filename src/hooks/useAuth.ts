import {useEffect, useState} from "react";
import { authApi } from "../api";

function useAuth() {
  const [token, setToken] =
    useState<string | null>(localStorage.getItem('jwttoken'));

  useEffect(() => {
    if (token) localStorage.setItem('jwttoken', token);
    else localStorage.clear();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token } = await authApi.login({ email, password });

    if (typeof token === 'string' && token.length) {
      setToken(token);
      return token;
    }

    throw new Error('Failed to log in');
  };

  const logout = () => {
    setToken(null);
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