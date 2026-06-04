import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (e) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  // const register = async (payload) => {
  //   const { data } = await api.post("/auth/register", payload);
  //   localStorage.setItem("token", data.token);
  //   setUser(data.user);
  //   return data.user;
  // };
  const signup = async (payload) => {
    const { data } = await api.post(
      "/auth/register",
      payload
    );
  
    localStorage.setItem(
      "token",
      data.token
    );
  
    setUser(data.user);
  
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // const value = useMemo(
  //   () => ({ user, loading, login, register, logout, reload: loadMe }),
  //   [user, loading]
  // );
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      reload: loadMe,
    }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

