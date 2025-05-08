import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        setUser(response.data.data);
        navigate("/dashboard");
        return response.data;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        setUser(response.data.data);
        navigate("/dashboard");
        return response.data;
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const guestLogin = async () => {
    try {
      const response = await api.post("/auth/guest");
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        setUser(response.data.data);
        navigate("/dashboard");
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
