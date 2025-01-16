import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed and imported
import Modal from "./Modal"; // Assuming Modal component is imported correctly

const EditModal = ({
  Name,
  isOpen,
  onClose,
  selected,
  endpoint,
  onSuccess,
}) => {
  const [accountName, setAccountName] = useState("");
  const [secondField, setSecondField] = useState(""); // New state for second input
  const [errors, setErrors] = useState({
    accountName: false,
    secondField: false, // Add error state for second input
  });
  const [loading, setLoading] = useState(false); // To track loading state
  const [errorMessage, setErrorMessage] = useState(""); // To store error message

  // Pre-fill the data when 'selected' changes

  useEffect(() => {
    if (selected) {
      setAccountName(selected.accountName || selected.name ||""); // Pre-fill accountName
      setSecondField(selected.facebookAccountId || selected.id ||""); // Pre-fill facebookAccountId
    } else {
      setAccountName("");
      setSecondField(""); // Reset fields if no data
    }
  }, [selected]);

  const validateForm = () => {
    const newErrors = {
      accountName: accountName === "",
      secondField: secondField === "", // Validate second field
    };
    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      setErrorMessage(""); // Reset any previous errors

      try {
        // Make PUT request to the dynamic endpoint
        const response = await axios.put(endpoint, {
          accountName: accountName,
          facebookAccountId: secondField,
        });

        // Call the onSuccess callback if the update was successful
        onSuccess(response.data);
        onClose(); // Close the modal after successful submission
      } catch (error) {
        // Handle errors (e.g., network error or API error)
        setErrorMessage(error.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Please fill all the fields before submitting.");
    }
  };

  const footerContent = (
    <>
      <button className="modal-footer-btn" onClick={onClose} disabled={loading}>
        Close
      </button>
      <button
        className="modal-footer-btn save-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selected ? `Edit ${Name}` : `Add ${Name}`} // Change modal title based on 'selected'
      footer={footerContent}
    >
      <div className="modal-body-content">
        <label className="modal-label">
          Edit {Name}
          <input
            type="text"
            className={`modal-input ${errors.accountName ? "input-error" : ""}`}
            placeholder="Enter Account Name"
            value={accountName} // Prefill this field with state
            onChange={(e) => setAccountName(e.target.value)} // Handle change
          />
          {errors.accountName && (
            <span className="error-text">Account Name is required</span>
          )}
        </label>

        {/* Second input field */}
        <label className="modal-label">
          ID Field {/* Replace with more meaningful name if necessary */}
          <input
            type="text"
            className={`modal-input ${errors.secondField ? "input-error" : ""}`}
            placeholder="Enter Second Field"
            value={secondField} // Prefill this field with state
            onChange={(e) => setSecondField(e.target.value)} // Handle change
            disabled={Name === "Campaign" ||Name === "Adset" || Name==="Ads"} // Disable the input if Name equals "Campaign"
          />
          {errors.secondField && (
            <span className="error-text">Second Field is required</span>
          )}
        </label>

        {/* Conditionally render select field if the Name is "Source" */}
        {Name === "Source" && (
          <label className="modal-label">
            Select Source
            <select className="modal-input">
              <option value="yesloans">Yesloans</option>
              <option value="singledebt">SingleDebt</option>
              <option value="taurus_collection">Taurus Collection</option>
              <option value="loan_sanction">Loan Sanction</option>
            </select>
          </label>
        )}

        {/* Display error message if the API call failed */}
        {errorMessage && (
          <div
            className="error-text"
            style={{ color: "red", marginTop: "10px" }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditModal;
