import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import "./Modal.css"; // Import CSS for the modal
import Button from "../Button/Button";
import { ApiTokenContext } from "../../context/Apicontext";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";

const FacebookTokenModal = ({ isOpen, onClose }) => {
  const [tokenLink, setTokenLink] = useState(""); // State for token input field
  const { access_token, setAccessToken, setAppsecret_proof, appsecret_proof } =
    useContext(ApiTokenContext); // Access token from context
  const [localAppsecretProof, setLocalAppsecretProof] =
    useState(appsecret_proof); // Local state for appsecret_proof

  const handleTokenLinkChange = (e) => setTokenLink(e.target.value); // Update tokenLink state

  const handleSave = async () => {
    try {
      // Exchange the short-lived token for a long-lived token
      const response = await axios.get(
        `https://graph.facebook.com/v17.0/oauth/access_token`,
        {
          params: {
            grant_type: "fb_exchange_token",
            client_id: "925846222818216", // Replace with your App ID
            client_secret: "6233b84135fd2b65555dbf52ca98d70f", // Replace with your App Secret
            fb_exchange_token: tokenLink, // Short-lived token from the input
          },
        }
      );
  
      const longLivedAccessToken = response.data.access_token;
  
      // Update access token in context and localStorage
      setAccessToken(longLivedAccessToken);
      updateLocalStorage("access_token", longLivedAccessToken);
  
      // Generate and save appsecret_proof
      await generateAppSecretProof(longLivedAccessToken);
  
      // Save token data to MongoDB
      await saveTokenData();
  
      // Close the modal
      onClose();
    } catch (error) {
      console.error(
        "Error during token exchange:",
        error.response?.data || error.message
      );
    }
  };
  
  const generateAppSecretProof = async (accessToken) => {
    try {
      const response = await axios.post(`${MONGO_URI}/api/authtoken`, {
        accessToken: accessToken,
      });
  
      const appSecretProof = response.data.appsecret_proof;
  
      // Update appsecret proof in context and localStorage
      setAppsecret_proof(appSecretProof);
      setLocalAppsecretProof(appSecretProof);
      updateLocalStorage("appsecret_proof", appSecretProof);
  
     
    } catch (error) {
      console.error(
        "Error generating appsecret proof:",
        error.response?.data || error.message
      );
    }
  };
  
  // Utility function to handle updating localStorage
  const updateLocalStorage = (key, value) => {
    try {
      if (value) {
        localStorage.setItem(key, value);
      
      } else {
        console.warn(`Attempted to update ${key} with invalid value: ${value}`);
      }
    } catch (error) {
      console.error(`Error updating localStorage for ${key}:`, error.message);
    }
  };
  

  const fetchTokenFromMongo = async () => {
    try {
      const response = await axios.get(`${MONGO_URI}/api/saveToken/getToken`);
      const { accessToken, appSecretProof } = response.data[0] || {};
  
 
      if (accessToken) {
        setAccessToken(accessToken);
        localStorage.setItem("access_token", accessToken); // Save in localStorage for future access
      }
  
      if (appSecretProof) {
        setAppsecret_proof(appSecretProof);
        localStorage.setItem("appsecret_proof", appSecretProof); // Save in localStorage for future access
      } else {
        console.log("No appSecretProof found in response");
      }
    } catch (error) {
      console.error("Error fetching token from Mongo:", error.response?.data || error.message);
    }
  };

  
  useEffect(() => {
    // Check if the access_token and appsecret_proof are in localStorage
    const storedAccessToken = localStorage.getItem("access_token");
    const storedAppsecretProof = localStorage.getItem("appsecret_proof");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    } else {
      fetchTokenFromMongo(); // Fetch from MongoDB if not in localStorage
    }

    if (storedAppsecretProof) {
      setAppsecret_proof(storedAppsecretProof);
      setLocalAppsecretProof(storedAppsecretProof); // Set the local state if present in localStorage
    } else if (storedAccessToken) {
      generateAppSecretProof(storedAccessToken); // If appsecret_proof is missing but access_token is present, generate it
    }
  }, [setAccessToken, setAppsecret_proof]);

  useEffect(() => {
   
  }, [appsecret_proof, localAppsecretProof]);

  const saveTokenData = async () => {
    try {
      const tokenData = {
        accessToken: access_token,
        appSecretProof: appsecret_proof,
      };

      const saveResponse = await axios.put(
        `${MONGO_URI}/api/saveToken`,
        tokenData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (saveError) {
      console.error(
        "Error saving token data:",
        saveError.response ? saveError.response.data : saveError.message
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Facebook Access Token"
      footer={
        <>
          <Button className="modal-footer-btn" onClick={onClose}>
            Close
          </Button>
          <Button className="modal-footer-btn save-btn" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="modal-body-content">
        <p className="modal-description">
          <strong>Facebook Expiry:</strong> 06 Oct 2024
        </p>
        <p className="modal-description">
          <strong>To Generate Token:</strong>
          <span className="modal-description-content">
            <a
              href="https://developers.facebook.com/tools/explorer/"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              Click Here
            </a>
          </span>
        </p>
        <strong>OR Open:</strong>
        <span>
          https://developers.facebook.com/tools/explorer/ in Marketing Login
        </span>
        <label className="modal-label">
          Copy Access Token and paste below:
          <input
            type="text"
            value={tokenLink}
            onChange={handleTokenLinkChange}
            placeholder="Paste your Facebook Token link here"
            className="modal-input"
          />
        </label>
      </div>
    </Modal>
  );
};

export default FacebookTokenModal;
