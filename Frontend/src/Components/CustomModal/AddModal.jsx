// import React, { useState, useEffect } from 'react';
// import Modal from './Modal'; // Assuming Modal component is imported correctly

// const AddModal = ({ Name, isOpen, onClose, selected }) => {
//   const [accountName, setAccountName] = useState("");
//   const [selectedTable, setSelectedTable] = useState("");
//   const [errors, setErrors] = useState({
//     accountName: false,
//     selectedTable: false,
//   });

//   // Pre-fill the data when 'selected' changes
//   useEffect(() => {
//     if (selected) {
//       setAccountName(selected.name || "");
//       setSelectedTable(selected.table || "");
//     } else {
//       setAccountName("");
//       setSelectedTable("");
//     }
//   }, [selected]);

//   const validateForm = () => {
//     const newErrors = {
//       accountName: accountName === "",
//       selectedTable: selectedTable === "",
//     };
//     setErrors(newErrors);

//     return !Object.values(newErrors).includes(true);
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Handle form submission logic here

//       onClose(); // Close the modal after submission
//     } else {
//       console.log("Please fill all the fields before submitting.");
//     }
//   };

//   const footerContent = (
//     <>
//       <button className="modal-footer-btn" onClick={onClose}>
//         Close
//       </button>
//       <button className="modal-footer-btn save-btn" onClick={handleSubmit}>
//         Submit
//       </button>
//     </>
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={selected ? `Edit ${Name}` : `Add ${Name}`} // Change modal title
//       footer={footerContent}
//     >
//       <div className="modal-body-content">
//         <label className="modal-label">
//           Add {Name}
//           <input
//             type="text"
//             className={`modal-input ${errors.accountName ? "input-error" : ""}`}
//             placeholder="Enter Account Name"
//             value={accountName}
//             onChange={(e) => setAccountName(e.target.value)}
//           />
//           {errors.accountName && (
//             <span className="error-text">Account Name is required</span>
//           )}
//         </label>

//         <label className="modal-label">
//           Accounts
//           <select
//             className={`modal-input ${errors.selectedTable ? "input-error" : ""}`}
//             value={selectedTable}
//             onChange={(e) => setSelectedTable(e.target.value)}
//           >
//             <option value="">Select Account</option>
//             <option value="yesloans">Yesloans</option>
//             <option value="singledebt">SingleDebt</option>
//             <option value="taurus_collection">Taurus Collection</option>
//             <option value="loan_sanction">Loan Sanction</option>
//           </select>
//           {errors.selectedTable && (
//             <span className="error-text">Select a table</span>
//           )}
//         </label>
//       </div>
//     </Modal>
//   );
// };

// export default AddModal;

import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Assuming Modal component is imported correctly
import { MONGO_URI } from "../../Variables/Variables";
import axios from "axios";

const AddModal = ({ Name, isOpen, onClose, selected, apiEndpoint }) => {
  const [accountName, setAccountName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [accountOptions, setAccountOptions] = useState([]); // State for dynamic select options
  const [errors, setErrors] = useState({
    accountName: false,
    selectedTable: false,
  });

  // Fetch account options when the modal is open
  useEffect(() => {
    const fetchAccountOptions = async () => {
      try {
        const response = await fetch(`${MONGO_URI}/api/account`); // Fetch account options from the given API endpoint
        const data = await response.json();
        if (response.ok) {
          // Assuming API returns an array of accounts
          const formattedData = data.map((item) => ({
            name: item.accountName, // Assuming account objects have an id field
            id: item.facebookAccountId, // Assuming account objects have a name field
          }));
          setAccountOptions(formattedData); // Set the fetched options
        } else {
          console.error("Error fetching account options:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    if (isOpen) {
      fetchAccountOptions(); // Fetch account options when modal is open
    }
  }, [isOpen, apiEndpoint]); // Re-run when modal opens or the API endpoint changes

  // Pre-fill the data when 'selected' changes
  useEffect(() => {
    if (selected) {
      setAccountName(selected.name || "");
      setSelectedTable(selected.table || "");
    } else {
      setAccountName("");
      setSelectedTable("");
    }
  }, [selected]);

  const validateForm = () => {
    const newErrors = {
      accountName: accountName === "",
      selectedTable: selectedTable === "",
    };
    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const generateUniqueId = () =>
        `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      let data = {
        id: generateUniqueId(),
        name: accountName,
        account_id: selectedTable,
      };

      const isArrayRequired = true;
      if (isArrayRequired) {
        data = [data];
      }
      console.log("this is scount data", data);

      try {
        const response = await axios.post(apiEndpoint, data, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("response", response, response.status);

        if (response.status === 200) {
          console.log("Data saved successfully:", response.data);
          // Fetch updated data
          const updatedResponse = await axios.get(apiEndpoint); // Replace with correct GET API
          setAccountOptions(updatedResponse.data); // Update state with new data
          console.log("updatedResponse.data", updatedResponse.data);
        }
      } catch (error) {
        console.error("Error during submission:", error);
      }

      onClose(); // Close modal after submission
    } else {
      console.log("Please fill all the fields before submitting.");
    }
  };

  const footerContent = (
    <>
      <button className="modal-footer-btn" onClick={onClose}>
        Close
      </button>
      <button className="modal-footer-btn save-btn" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selected ? `Edit ${Name}` : `Add ${Name}`} // Change modal title
      footer={footerContent}
    >
      <div className="modal-body-content">
        <label className="modal-label">
          Add {Name}
          <input
            type="text"
            className={`modal-input ${errors.accountName ? "input-error" : ""}`}
            placeholder="Enter Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          {errors.accountName && (
            <span className="error-text">Account Name is required</span>
          )}
        </label>

        <label className="modal-label">
          Accounts
          <select
            className={`modal-input ${
              errors.selectedTable ? "input-error" : ""
            }`}
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Select Account</option>
            {accountOptions.length > 0 ? (
              accountOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                  {console.log(option)}
                </option>
              ))
            ) : (
              <option value="">No accounts available</option> // Option when no accounts are available
            )}
          </select>
          {errors.selectedTable && (
            <span className="error-text">Select a table</span>
          )}
        </label>
      </div>
    </Modal>
  );
};

export default AddModal;
