import { useState } from "react";
import { authApi } from "../api";

export function useAuth() {
  const [token, setToken] = useState(null);

  const login = async (email: string, password: string) => {
    const token = await authApi.login({ email, password });

    if (token && token.length) setToken(token);
    return token;
  };

  const logout = () => {
    setToken(null);
  };

  return {
    token,
    login,
    logout,
  };
}