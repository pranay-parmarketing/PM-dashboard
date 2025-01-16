import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { MONGO_URI } from "../Variables/Variables";


// Create the context with default values
export const ApiTokenContext = createContext({
  selectedAccount: null,
  setSelectedAccount: () => {},
  appsecret_proof: undefined,
  access_token: undefined,
  setAccessToken: () => {},
  setAppsecret_proof: () => {},
  updateTokenAndSecret: () => {},
  updateSelectedAccount: () => {},
  generateAppSecretProof: () => Promise.resolve(),
});

// Constants
const TOKEN_EXPIRY_MS = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null); // Store the selected account
  const [appsecret_proof, setAppsecret_proof] = useState(() => localStorage.getItem("appsecret_proof") || undefined);
  const [access_token, setAccessToken] = useState(() => localStorage.getItem("access_token") || undefined);
  const [tokenExpiryDate, setTokenExpiryDate] = useState(
    new Date(localStorage.getItem("tokenExpiryDate") || Date.now() + TOKEN_EXPIRY_MS)
  );
  const [allPayment, setAllPayment] = useState(); // Store the selected account

  // Save token and expiry date in localStorage
  useEffect(() => {
    if (access_token) localStorage.setItem("access_token", access_token);
  }, [access_token]);

  useEffect(() => {
    if (appsecret_proof) localStorage.setItem("appsecret_proof", appsecret_proof);
  }, [appsecret_proof]);

  useEffect(() => {
    localStorage.setItem("tokenExpiryDate", tokenExpiryDate.toISOString());
  }, [tokenExpiryDate]);

  // Function to generate appsecret_proof
  const generateAppSecretProof = async (accessToken) => {
    try {
      const response = await axios.post(`${MONGO_URI}/api/authtoken`, { accessToken });
      const proof = response.data.appsecret_proof;
      setAppsecret_proof(proof);
      return proof;
    } catch (error) {
      console.error("Error generating appsecret proof:", error.response?.data || error.message);
      setAppsecret_proof(undefined);
    }
  };

  // Function to refresh the token
  const refreshToken = async () => {
    if (!access_token) {
      console.error("Access token is not available for refreshing.");
      return;
    }
    try {
      const response = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
        params: {
          grant_type: "fb_exchange_token",
          client_id: "925846222818216", // Your App ID
          client_secret: "6233b84135fd2b65555dbf52ca98d70f", // Your App Secret
          fb_exchange_token: access_token,
        },
      });

      const newAccessToken = response.data.access_token;
      setAccessToken(newAccessToken);
      setTokenExpiryDate(new Date(Date.now() + TOKEN_EXPIRY_MS));
      console.log("Token refreshed successfully:", newAccessToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  // Check if the token needs to be refreshed
  useEffect(() => {
    const checkTokenExpiration = () => {
      const currentDate = new Date();
      if (currentDate > tokenExpiryDate) {
        console.log("Token expired, refreshing...");
        refreshToken();
      }
    };

    // Check token every 24 hours
    const interval = setInterval(checkTokenExpiration, 24 * 60 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [tokenExpiryDate]);

  // Function to update the token and appsecret_proof
  const updateTokenAndSecret = (newToken, newSecretProof) => {
    setAccessToken(newToken);
    setAppsecret_proof(newSecretProof);
  };

  // Function to update the selected account
  const updateSelectedAccount = (account) => {
    setSelectedAccount(account); // Update the selected account in the context
  };

  return (
    <ApiTokenContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
        appsecret_proof,
        access_token,
        setAccessToken,
        setAppsecret_proof,
        updateTokenAndSecret,
        generateAppSecretProof,
        updateSelectedAccount,
        allPayment, 
        setAllPayment,
      }}
    >
      {children}
    </ApiTokenContext.Provider>
  );
};
