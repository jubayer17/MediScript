"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = getToken();
    console.log(t);
    setTokenState(t);
  }, []);

  // Login function - calls backend API
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return { success: false, message: data.message || "Login failed" };
      }

      // Save token
      setToken(data.token);
      setTokenState(data.token);

      // Optionally set user data if returned
      if (data.user) {
        setUser(data.user);
      }

      setLoading(false);
      return { success: true, message: "Login successful" };
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      return {
        success: false,
        message: "Server error. Make sure the backend is running on port 5000.",
      };
    }
  };

  // Signup function - calls backend API
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      // Save token
      setToken(data.token);
      setTokenState(data.token);

      // Optionally set user data if returned
      if (data.user) {
        setUser(data.user);
      }

      setLoading(false);
      return { success: true, message: "Registration successful" };
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);
      return {
        success: false,
        message: "Server error. Make sure the backend is running on port 5000.",
      };
    }
  };

  //Create Prescription function
  const createPrescription = async (prescriptionData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prescriptionData),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return {
          success: false,
          message: data.message || "Failed to create prescription",
        };
      }

      // Add the new prescription to the list
      setPrescriptions([...prescriptions, data]);

      setLoading(false);
      return { success: true, message: "Prescription created successfully" };
    } catch (err) {
      console.error("Creation error:", err);
      setLoading(false);
      return {
        success: false,
        message: "Server error. Make sure the backend is running on port 5000.",
      };
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setPrescriptions([]);
    router.push("/login");
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        signup,
        logout,
        createPrescription,
        prescriptions,
        setPrescriptions,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
