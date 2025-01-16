// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom"; // For navigation
// import "./Navbar.css";
// import { Select, MenuItem, IconButton, Menu } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon

// import { ApiTokenContext } from "../../context/Apicontext";
// import axios from "axios"; // Import axios to make API calls
// import { MONGO_URI } from "../../Variables/Variables"; // Ensure MONGO_URI is correctly defined
// import { AuthenticationContext } from "../../context/AuthContext";

// const Navbar = () => {
//   const [anchorEl, setAnchorEl] = useState(null); // State to control the profile menu
//   const { selectedAccount, updateSelectedAccount } = useContext(ApiTokenContext); // Access context for selected account
//   const [accountOptions, setAccountOptions] = useState([]); // State to store the dynamic account options
//   const navigate = useNavigate(); // Hook for navigation
//   const { setIsAuthenticated } = useContext(AuthenticationContext);
//   // Fetch account data from the API
//   const fetchCampaignData = async () => {
//     try {

//       const response = await axios.get(`${MONGO_URI}/api/account`);
//       const apiData = response.data || []; // Directly use response.data if it's an array

//       // Map the fetched data to the required structure
//       const formattedData = apiData.map(item => ({
//         name: item.accountName, // Use accountName from API
//         id: item.facebookAccountId, // Use facebookAccountId from API
//       }));

//       // Set the formatted data into the state
//       setAccountOptions(formattedData);
//     } catch (error) {
//       console.error("Error fetching data from API:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCampaignData(); // Call the API when the component is mounted
//   }, []); // Empty dependency array to run only once on component mount

//   const handleChange = (event) => {
//     const selected = accountOptions.find(option => option.name === event.target.value);
//     updateSelectedAccount(selected); // Update the selected account in the context
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget); // Set anchor element for the menu
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null); // Close the menu
//   };

//   const handleLogout = () => {
//     setAnchorEl(null); // Close the menu
//     localStorage.removeItem("usertoken"); // Clear the token from localStorage
//     clearLocalStorage();
//     navigate("/login"); // Redirect to the login page
//     setIsAuthenticated(false); // Update authentication state to false (if you have access to the context)
//   };

//   const handleProfileOption = (option) => {
//     if (option === "Logout") {
//       handleLogout(); // Call logout handler
//     } else {
//      // Handle other options (like "Admin Profile")
//     }
//     setAnchorEl(null); // Close the menu
//   };
// //
// const clearLocalStorage = () => {
//   try {
//     localStorage.clear();
//     console.log("All localStorage data has been cleared.");
//   } catch (error) {
//     console.error("Error clearing localStorage:", error.message);
//   }
// };
//   return (
//     <div className="navbar">
//       <div className="wrapper">
//         <div className="left">Account Expiry: February 2018</div>
//         <div className="right">
//           {/* Account Selection Dropdown */}
//           <Select
//             value={selectedAccount?.name || ""} // Use the name of the selected account
//             onChange={handleChange} // Handle change event
//             displayEmpty // Show empty value when no selection
//             className="dropdown"
//             MenuProps={{
//               PaperProps: {
//                 sx: {
//                   border: "none", // Remove border
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select an account
//             </MenuItem>
//             {accountOptions.map((option) => (
//               <MenuItem key={option.id} value={option.name}>
//                 {option.name} {/* Display the account name */}
//               </MenuItem>
//             ))}
//           </Select>

//           {/* Profile Icon that triggers the profile menu */}
//           <IconButton onClick={handleMenuOpen}>
//             <AccountCircleIcon className="profile-icon-img" />
//           </IconButton>

//           {/* Menu for Profile Options */}
//           <Menu
//             anchorEl={anchorEl} // Anchor element for positioning the menu
//             open={Boolean(anchorEl)} // Open the menu if anchorEl is not null
//             onClose={handleMenuClose} // Close the menu when clicking outside
//           >
//             <MenuItem onClick={() => handleProfileOption("Admin Profile")}>
//               Admin Profile
//             </MenuItem>
//             <MenuItem onClick={() => handleProfileOption("Logout")}>
//               Logout
//             </MenuItem>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Select, MenuItem, IconButton, Menu } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { ApiTokenContext } from "../../context/Apicontext";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import { AuthenticationContext } from "../../context/AuthContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    selectedAccount,
    updateSelectedAccount,
    appsecret_proof,
    access_token,
  } = useContext(ApiTokenContext);
  const [accountOptions, setAccountOptions] = useState([]);
  const [expDate,setExpDate]=useState()
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthenticationContext);
  const appSecretProof = appsecret_proof;
  const accessToken = access_token;

  const fetchCampaignData = async () => {
    try {
      const response = await axios.get(`${MONGO_URI}/api/account`);
      const apiData = response.data || [];

      const formattedData = apiData.map((item) => ({
        name: item.accountName,
        id: item.facebookAccountId,
      }));

      setAccountOptions(formattedData);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const expirydata = async () => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v17.0/debug_token`, {
          params: {
            input_token: accessToken,
            access_token: accessToken,
            appsecret_proof: appSecretProof,
          }
        });

      // Assuming the response contains the expiration date in 'data.expires_at'
      const expirationDate = response.data.data.expires_at;
      const humanReadableDate = new Date(expirationDate * 1000)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });// Convert to readable date
      setExpDate(humanReadableDate); // Update the state with the expiry date
    } catch (error) {
      console.error('Error fetching expiry data', error);
    }
  };
  
  useEffect(() => {
    fetchCampaignData();
    expirydata();

    // Load the saved account from localStorage
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) {
      updateSelectedAccount(JSON.parse(savedAccount)); // Update context with saved account
    }
  }, []); // Run on component mount

  const handleChange = (event) => {
    const selected = accountOptions.find(
      (option) => option.name === event.target.value
    );

    if (selected) {
      updateSelectedAccount(selected); // Update the selected account in the context
      localStorage.setItem("selectedAccount", JSON.stringify(selected)); // Persist the selected account
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("usertoken");
    localStorage.removeItem("selectedAccount"); // Clear saved account on logout
    clearLocalStorage();
    navigate("/login");
    setIsAuthenticated(false);
  };

  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      console.log("All localStorage data has been cleared.");
    } catch (error) {
      console.error("Error clearing localStorage:", error.message);
    }
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">Account Expiry: {expDate}</div>
        <div className="right">
          {/* Account Selection Dropdown */}
          <Select
            value={selectedAccount?.name || ""} // Use the name of the selected account
            onChange={handleChange} // Handle change event
            displayEmpty // Show empty value when no selection
            className="dropdown"
            MenuProps={{
              PaperProps: {
                sx: {
                  border: "none",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select an account
            </MenuItem>
            {accountOptions.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>

          {/* Profile Icon that triggers the profile menu */}
          <IconButton onClick={handleMenuOpen}>
            <AccountCircleIcon className="profile-icon-img" />
          </IconButton>

          {/* Menu for Profile Options */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
