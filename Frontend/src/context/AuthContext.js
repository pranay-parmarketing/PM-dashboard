import React, { createContext, useState, useEffect } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initial state is null
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
  

    if (token) {
      setIsAuthenticated(true); // If token exists, user is authenticated
    } else {
      setIsAuthenticated(false); // If no token, user is not authenticated
    }

    setLoading(false); // Stop loading once the token check is done
  }, []); // This effect runs once on initial load (page refresh)

  const login = (token) => {
    localStorage.setItem("usertoken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("usertoken");
    setIsAuthenticated(false);
  };

  // If loading, return null (or a loading indicator)
  if (loading) {
    return null; // or you could return a loading spinner
  }

  return (
    <AuthenticationContext.Provider value={{ setIsAuthenticated, isAuthenticated, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
