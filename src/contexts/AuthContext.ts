import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  login: (username: string, password: string): Promise<string> =>
    { throw new Error('login: AuthProvider is not set up. Wrap the app with an AuthProvider.'); },
  logout: (): void =>
    { throw new Error('logout: AuthProvider is not set up. Wrap the app with an AuthProvider.'); }
});