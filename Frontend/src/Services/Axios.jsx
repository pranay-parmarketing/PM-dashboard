import { useContext } from "react";
import { ApiTokenContext } from "../context/Apicontext.js";
import { BASEURL, GenerateToken } from "./ApiConfig.tsx";
import axios from "axios";

export const isTokenExpired = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (!tokenExpiry) {
    return true; // If no expiry is set, consider the token expired
  }

  const currentTime = Date.now();
  return currentTime > parseInt(tokenExpiry, 10); // Compare current time with expiry time
};

// Refresh token function
export const refreshToken = async () => {
  try {
    console.log("Refreshing token...");

    // Fetch a new token from the GenerateToken endpoint
    const response = await axios.get(GenerateToken);

    // Extract the new token from the response
    const newToken = response?.data?.token[0]?.token;
    if (!newToken) {
      throw new Error("No token found in the response.");
    }

    // Set expiry duration to 5 minutes (300 seconds)
    const expiryDuration = 300;
    const expiryTimestamp = Date.now() + expiryDuration * 1000;

    await localStorage.setItem("accessToken", newToken);

    await localStorage.setItem("tokenExpiry", expiryTimestamp.toString());

    return newToken;
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.status,
      error.message
    );
    if (error.response?.status === 401) {
      console.error(
        "Unauthorized: Token refresh failed due to invalid credentials."
      );
      // Handle re-login or notify the user if necessary
    }
    throw error; // Propagate the error for upstream handling
  }
};

export const getToken = async () => {
  // Check if the token is expired or missing
  if (isTokenExpired()) {
    console.log("Token expired or not available. Refreshing...");
    const newToken = await refreshToken();
    return newToken; // Return the refreshed token
  }

  // Return the existing valid token
  return localStorage.getItem("accessToken");
};

const AxiosInstance = axios.create({
  baseURL: BASEURL,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await localStorage.getItem("accessToken");
      console.log("Request Interceptor - Access Token:", accessToken);

      if (accessToken) {
        config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
      } else {
        console.log("Request Interceptor - Generating a new token...");
        // Generate a new token if it doesn't exist
        const newAccessToken = await refreshToken();
        config.headers.Authorization = `Zoho-oauthtoken ${newAccessToken}`;
        console.log("Request Interceptor - New Access Token:", newAccessToken);
      }

      return config;
    } catch (error) {
      console.log("Request Interceptor - Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.log("Request Interceptor - Error:", error);
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Response Interceptor - Trying to refresh token...");
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Zoho-oauthtoken ${newAccessToken}`;
        console.log(
          "Response Interceptor - Retry with new token - Request Config:",
          originalRequest
        );
        return AxiosInstance(originalRequest);
      } catch (error) {
        console.log("Refresh Token Error: phase 1", error);
        // Handle refresh token errors
      }
    }

    console.log("Response Interceptor - Error:", error);
    return Promise.reject(error);
  }
);

export default AxiosInstance;
