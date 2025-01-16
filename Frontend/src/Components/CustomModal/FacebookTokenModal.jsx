// import React, { useContext, useEffect, useState } from "react";
// import Modal from "./Modal";
// import "./Modal.css"; // Import CSS for the modal
// import Button from "../Button/Button";
// import { ApiTokenContext } from "../../context/Apicontext";
// import axios from "axios";
// import { MONGO_URI } from "../../Variables/Variables";

// const FacebookTokenModal = ({ isOpen, onClose }) => {
//   const [tokenLink, setTokenLink] = useState(""); // State for token input field
//   const { access_token, setAccessToken, setAppsecret_proof } = useContext(ApiTokenContext); // Access token and appsecret_proof from context
//   const [localAppsecretProof, setLocalAppsecretProof] = useState(""); // Local state for appsecret_proof

//   const handleTokenLinkChange = (e) => setTokenLink(e.target.value); // Update tokenLink state

//   const fetchTokenData = async () => {
//     try {
//       const response = await axios.get(`${MONGO_URI}/api/getTokenData`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const { accessToken, appSecretProof } = response.data;

//       // Update context and localStorage
//       setAccessToken(accessToken);
//       setAppsecret_proof(appSecretProof);

//       localStorage.setItem("access_token", accessToken);
//       localStorage.setItem("appsecret_proof", appSecretProof);

//       // Update local state
//       setLocalAppsecretProof(appSecretProof);

//       console.log("Fetched and updated token data successfully.");
//     } catch (error) {
//       console.error(
//         "Error fetching token data from MongoDB:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleSave = async () => {
//     try {
//       // Step 1: Exchange the short-lived token for a long-lived token
//       const response = await axios.get(
//         `https://graph.facebook.com/v17.0/oauth/access_token`,
//         {
//           params: {
//             grant_type: "fb_exchange_token",
//             client_id: "925846222818216", // Replace with your App ID
//             client_secret: "6233b84135fd2b65555dbf52ca98d70f", // Replace with your App Secret
//             fb_exchange_token: tokenLink, // Short-lived token from the input
//           },
//         }
//       );

//       const longLivedAccessToken = response.data.access_token;
//       setAccessToken(longLivedAccessToken); // Save the long-lived token to the context
//       localStorage.setItem("access_token", longLivedAccessToken); // Save the long-lived token in localStorage

//       // Step 2: Generate appsecret_proof
//       await generateAppSecretProof(longLivedAccessToken);
//       await saveTokenData();
//       onClose(); // Close the modal
//     } catch (error) {
//       console.error(
//         "Error during token exchange:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const generateAppSecretProof = async (accessToken) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/authtoken", {
//         accessToken: accessToken,
//       });

//       const proof = response.data.appsecret_proof;

//       setAppsecret_proof(proof); // Save proof in context
//       setLocalAppsecretProof(proof); // Set locally for component state

//       localStorage.setItem("appsecret_proof", proof); // Save in localStorage

//       console.log("Generated appsecret proof:", proof);
//     } catch (error) {
//       console.error(
//         "Error generating appsecret proof:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const saveTokenData = async () => {
//     try {
//       const tokenData = {
//         accessToken: access_token,
//         appSecretProof: localAppsecretProof,
//       };

//       const saveResponse = await axios.post(
//         `${MONGO_URI}/api/saveToken`,
//         tokenData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Token saved successfully:", saveResponse.data);
//     } catch (saveError) {
//       console.error(
//         "Error saving token data:",
//         saveError.response ? saveError.response.data : saveError.message
//       );
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchTokenData(); // Fetch data when the modal opens
//     }
//   }, [isOpen]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Facebook Access Token"
//       footer={
//         <>
//           <Button className="modal-footer-btn" onClick={onClose}>
//             Close
//           </Button>
//           <Button className="modal-footer-btn save-btn" onClick={handleSave}>
//             Save
//           </Button>
//         </>
//       }
//     >
//       <div className="modal-body-content">
//         <p className="modal-description">
//           <strong>Facebook Expiry:</strong> 06 Oct 2024
//         </p>
//         <p className="modal-description">
//           <strong>To Generate Token:</strong>
//           <span className="modal-description-content">
//             <a
//               href="https://developers.facebook.com/tools/explorer/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="modal-link"
//             >
//               Click Here
//             </a>
//           </span>
//         </p>
//         <strong>OR Open:</strong>
//         <span>
//           https://developers.facebook.com/tools/explorer/ in Marketing Login
//         </span>
//         <label className="modal-label">
//           Copy Access Token and paste below:
//           <input
//             type="text"
//             value={tokenLink}
//             onChange={handleTokenLinkChange}
//             placeholder="Paste your Facebook Token link here"
//             className="modal-input"
//           />
//         </label>
//       </div>
//     </Modal>
//   );
// };

// export default FacebookTokenModal;

// import React, { useContext, useEffect, useState } from "react";
// import Modal from "./Modal";
// import "./Modal.css"; // Import CSS for the modal
// import Button from "../Button/Button";
// import { ApiTokenContext } from "../../context/Apicontext";
// import axios from "axios";
// import { MONGO_URI } from "../../Variables/Variables";

// const FacebookTokenModal = ({ isOpen, onClose }) => {
//   const [tokenLink, setTokenLink] = useState(""); // State for token input field
//   const { access_token, setAccessToken, setAppsecret_proof, appsecret_proof } =
//     useContext(ApiTokenContext); // Access token from context
//   const [localAppsecretProof, setLocalAppsecretProof] =
//     useState(appsecret_proof); // Local state for appsecret_proof

//   const handleTokenLinkChange = (e) => setTokenLink(e.target.value); // Update tokenLink state

//   const handleSave = async () => {
//     try {
//       // Exchange the short-lived token for a long-lived token
//       const response = await axios.get(
//         `https://graph.facebook.com/v17.0/oauth/access_token`,
//         {
//           params: {
//             grant_type: "fb_exchange_token",
//             client_id: "925846222818216", // Replace with your App ID
//             client_secret: "6233b84135fd2b65555dbf52ca98d70f", // Replace with your App Secret
//             fb_exchange_token: tokenLink, // Short-lived token from the input
//           },
//         }
//       );

//       const longLivedAccessToken = response.data.access_token;
//       setAccessToken(longLivedAccessToken); // Save the long-lived token to the context
//       localStorage.setItem("access_token", longLivedAccessToken); // Save the long-lived token in localStorage

//       await generateAppSecretProof(longLivedAccessToken); // Generate appsecret_proof
//       await saveTokenData(); // Save token data to MongoDB
//       onClose(); // Close the modal
//     } catch (error) {
//       console.error("Error during token exchange:", error.response?.data || error.message);
//     }
//   };

//   const generateAppSecretProof = async (accessToken) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/authtoken", {
//         accessToken: accessToken,
//       });
//       console.log("Appsecret Proof:", response.data.appsecret_proof);
//       setAppsecret_proof(response.data.appsecret_proof); // Save proof in context
//       setLocalAppsecretProof(response.data.appsecret_proof); // Set locally for component state

//       localStorage.setItem("appsecret_proof", response.data.appsecret_proof); // Save appsecret_proof in localStorage
//     } catch (error) {
//       console.error("Error generating appsecret proof:", error.response?.data || error.message);
//     }
//   };

//   const fetchTokenFromMongo = async () => {
//     try {
//       // Fetch token from MongoDB if not found in localStorage
//       const response = await axios.get(`${MONGO_URI}/api/saveToken/getToken`);
//       const { accessToken, appSecretProof } = response.data;

//       if (accessToken) {
//         setAccessToken(accessToken);
//         localStorage.setItem("access_token", accessToken); // Save in localStorage for future access
//       }

//       if (appSecretProof) {
//         setAppsecret_proof(appSecretProof);
//         localStorage.setItem("appsecret_proof", appSecretProof); // Save in localStorage for future access
//       }
//     } catch (error) {
//       console.error("Error fetching token from Mongo:", error.response?.data || error.message);
//     }
//   };

//   useEffect(() => {
//     // Check if the access_token and appsecret_proof are in localStorage
//     const storedAccessToken = localStorage.getItem("access_token");
//     const storedAppsecretProof = localStorage.getItem("appsecret_proof");

//     if (storedAccessToken) {
//       setAccessToken(storedAccessToken);
//     } else {
//       fetchTokenFromMongo(); // Fetch from MongoDB if not in localStorage
//     }

//     if (storedAppsecretProof) {
//       setAppsecret_proof(storedAppsecretProof);
//       setLocalAppsecretProof(storedAppsecretProof); // Set the local state if present in localStorage
//     } else if (storedAccessToken) {
//       generateAppSecretProof(storedAccessToken); // If appsecret_proof is missing but access_token is present, generate it
//     }
//   }, [setAccessToken, setAppsecret_proof]);

//   useEffect(() => {
//     console.log("Updated appsecret_proof:", appsecret_proof);
//     console.log("Local Appsecret Proof:", localAppsecretProof);
//   }, [appsecret_proof, localAppsecretProof]);

//   const saveTokenData = async () => {
//     try {
//       const tokenData = {
//         accessToken: access_token,
//         appSecretProof: appsecret_proof,
//       };

//       const saveResponse = await axios.post(
//         `${MONGO_URI}/api/saveToken`,
//         tokenData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Token saved successfully:", saveResponse.data);
//     } catch (saveError) {
//       console.error("Error saving token data:", saveError.response ? saveError.response.data : saveError.message);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Facebook Access Token"
//       footer={
//         <>
//           <Button className="modal-footer-btn" onClick={onClose}>
//             Close
//           </Button>
//           <Button className="modal-footer-btn save-btn" onClick={handleSave}>
//             Save
//           </Button>
//         </>
//       }
//     >
//       <div className="modal-body-content">
//         <p className="modal-description">
//           <strong>Facebook Expiry:</strong> 06 Oct 2024
//         </p>
//         <p className="modal-description">
//           <strong>To Generate Token:</strong>
//           <span className="modal-description-content">
//             <a
//               href="https://developers.facebook.com/tools/explorer/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="modal-link"
//             >
//               Click Here
//             </a>
//           </span>
//         </p>
//         <strong>OR Open:</strong>
//         <span>
//           https://developers.facebook.com/tools/explorer/ in Marketing Login
//         </span>
//         <label className="modal-label">
//           Copy Access Token and paste below:
//           <input
//             type="text"
//             value={tokenLink}
//             onChange={handleTokenLinkChange}
//             placeholder="Paste your Facebook Token link here"
//             className="modal-input"
//           />
//         </label>
//       </div>
//     </Modal>
//   );
// };

// export default FacebookTokenModal;

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
  
      console.log("Appsecret Proof:", appSecretProof);
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
        console.log(`Updated ${key} in localStorage: ${value}`);
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
  
      console.log(response.data, "this is Mongo db data");
  
      if (accessToken) {
        setAccessToken(accessToken);
        localStorage.setItem("access_token", accessToken); // Save in localStorage for future access
      }
  
      if (appSecretProof) {
        console.log("Setting appSecretProof:", appSecretProof);  // Debug logging here
        setAppsecret_proof(appSecretProof);
        localStorage.setItem("appsecret_proof", appSecretProof); // Save in localStorage for future access
      } else {
        console.log("No appSecretProof found in response");
      }
    } catch (error) {
      console.error("Error fetching token from Mongo:", error.response?.data || error.message);
    }
  };
  // After setting it to localStorage
console.log("Appsecret Proof in localStorage:", localStorage.getItem("appsecret_proof"));
console.log("access_token in localStorage:", localStorage.getItem("access_token"));

  
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
    console.log("Updated appsecret_proof:", appsecret_proof);
    console.log("Local Appsecret Proof:", localAppsecretProof);
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

      console.log("Token saved successfully:", saveResponse.data);
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
