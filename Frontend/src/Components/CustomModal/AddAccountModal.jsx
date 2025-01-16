import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios"; // Import axios for HTTP requests
import { MONGO_URI } from "../../Variables/Variables";

const AddAccountModal = ({ isOpen, onClose, selected, onSuccess }) => {
  const [accountName, setAccountName] = useState("");
  const [facebookAccountId, setFacebookAccountId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    accountName: false,
    facebookAccountId: false,
    selectedTable: false,
  });

  useEffect(() => {
    if (selected) {
      setAccountName(selected.accountName || "");
      setFacebookAccountId(selected.facebookAccountId || "");
    } else {
      setAccountName("");
      setFacebookAccountId("");
    }
  }, [selected]);

  const validateForm = () => {
    const newErrors = {
      accountName: accountName === "",
      facebookAccountId: facebookAccountId === "",
    };
    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const newAccount = {
          accountName,
          facebookAccountId,
        };

        // Send POST request to create a new account
        const response = await axios.post(
          `${MONGO_URI}/api/account`,
          newAccount
        );
      

        setMessage("Account successfully created!");
        setError(false); // Reset error state on success
        setSubmitted(true);

        onSuccess(response.data);
        onClose(); // Close the modal after successful submission
      } catch (error) {
        console.error("Error creating account:", error);

        // Display error message based on server response
        if (error.response?.status === 400) {
          setMessage(error.response.data.message); // Display the backend's error message
        } else {
          setMessage(
            "An error occurred while creating the account. Please try again."
          );
          setSubmitted(true); 
        }
        setError(true); // Indicate error state
      }
    } else {
      setMessage("Please fill all the fields before submitting.");
      setError(true);
      setSubmitted(true);
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
      title={selected ? "Edit Account" : "Add Account"}
      footer={footerContent}
    >
      <div className="modal-body-content">
        <label className="modal-label">
          Account Name
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
          Facebook Account ID
          <input
            type="text"
            className={`modal-input ${
              errors.facebookAccountId ? "input-error" : ""
            }`}
            placeholder="Enter Facebook Account ID"
            value={facebookAccountId}
            onChange={(e) => setFacebookAccountId(e.target.value)}
          />
          {errors.facebookAccountId && (
            <span className="error-text">Facebook Account ID is required</span>
          )}
        </label>
        {submitted && message && (
          <p
            style={{
              color: error ? "red" : "green", // Red for errors, green for success
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AddAccountModal;
