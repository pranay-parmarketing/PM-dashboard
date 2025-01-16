import React, { useState } from "react";
import Modal from "./Modal"; // Import the reusable Modal component
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs

const ChooseFileModal = ({
  isOpen,
  onClose,
  title,
  errorMessage,
  Name,
  providedId,
  apiEndpoint,
}) => {
  const [file, setFile] = useState(null); // State to hold the selected file
  const [error, setError] = useState(errorMessage);

  // Handler to capture file input
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Clear error when a new file is selected
  };

  // Handler to save the file and send it to the backend
  const onFileSave = async () => {
    if (!file) {
      setError("Please select a file before saving.");
      return;
    }

    const formData = new FormData();
    const uniqueId = providedId || uuidv4(); // Use provided ID or generate a new one
    formData.append("excelFile", file); // Attach the Excel file
    formData.append("uniqueId", uniqueId); // Attach the unique ID
    // formData.append("campaignData", JSON.stringify(jsonData)); // (Optional) Add JSON data

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      alert("File uploaded successfully!");
      onClose(); // Close the modal after successful upload
    } catch (err) {
      setError("Failed to upload the file. Please try again.");
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || `Import ${Name}`} // Default title if not provided
      footer={
        <>
          <button className="modal-footer-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-footer-btn save-btn" onClick={onFileSave}>
            Save
          </button>
        </>
      }
    >
      <div className="modal-body-content">
        <label className="modal-label">
          {Name} Import
          <input
            type="file"
            accept=".xls,.xlsx" // Accept only Excel files
            className={`modal-input ${error ? "input-error" : ""}`}
            onChange={onFileChange}
          />
        </label>
        {error && <span className="error-text">{error}</span>}
      </div>
    </Modal>
  );
};

export default ChooseFileModal;
