import { useCallback } from "react";

// Token storage strategy
// Using localStorage for simplicity, but you could use alternatives like an in-memory store
// or HTTP-only cookies set by your backend
export const useAuthToken = () => {
  const TOKEN_KEY = "accessToken";

  const setToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return { setToken, getToken, removeToken };
};
