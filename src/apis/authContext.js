import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "./authService";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem("accessToken");

        if (token) {
          // Try to get current user data
          try {
            const userRes = await authService.getCurrentUser();

            if (userRes?.isSuccessed && userRes?.resultObj) {
              setCurrentUser(userRes.resultObj);
              setIsAuthenticated(true);
              localStorage.setItem(
                "userData",
                JSON.stringify(userRes.resultObj)
              );
            } else {
              // If getCurrentUser fails, try to use stored userData
              const storedUser = localStorage.getItem("userData");
              if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
              } else {
                // No stored data, consider as logged out
                logout();
              }
            }
          } catch (error) {
            console.error("Error verifying authentication:", error);
            // If API call fails, try to use stored userData as fallback
            const storedUser = localStorage.getItem("userData");
            if (storedUser) {
              setCurrentUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
            } else {
              logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (!result.isSuccessed || !result.resultObj) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      // Save tokens
      localStorage.setItem("accessToken", result.resultObj.accessToken);
      localStorage.setItem("refreshToken", result.resultObj.refreshToken);

      try {
        // Get user data
        const userRes = await authService.getCurrentUser();
        const user = userRes?.resultObj;

        if (user) {
          setCurrentUser(user);
          localStorage.setItem("userData", JSON.stringify(user));
        } else {
          // Create default user from login info
          const defaultUser = {
            email: credentials.email,
          };
          setCurrentUser(defaultUser);
          localStorage.setItem("userData", JSON.stringify(defaultUser));
        }
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Create default user from login info
        const defaultUser = {
          email: credentials.email,
        };
        setCurrentUser(defaultUser);
        localStorage.setItem("userData", JSON.stringify(defaultUser));
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register({
        email: userData.email,
        password: userData.password,
      });

      if (!result.isSuccessed) {
        throw new Error(
          result.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
      }

      // Auto login after successful registration
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
