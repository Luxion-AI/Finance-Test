import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login sebelumnya (saat web di-refresh)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axiosInstance.get("/auth/me");
          setUser(res.data.user);
        } catch (error) {
          console.error("Token tidak valid:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fungsi Login
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Fungsi Register
  const register = async (name, email, password) => {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
