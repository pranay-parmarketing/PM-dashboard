// import React, { useState, useEffect } from "react";

// function FilterModal({ isOpen, onClose, Base, onApplyFilters }) {
//   const [datePreset, setDatePreset] = useState("");
//   const [format, setFormat] = useState("");

//   // Handle changes to the date preset
//   const handleDatePresetChange = (e) => setDatePreset(e.target.value);

//   // Handle changes to the format
//   const handleFormatChange = (e) => setFormat(e.target.value);

//   const handleApplyFilters = () => {
//     // Ensure the format is passed correctly
//     onApplyFilters({
//       datePreset,
//       format: Base ? format : format, // For Base, it will use the format value; else the selected format
//     });
//     // Close the modal after applying the filters
//     onClose();
//   };

//   // If the modal isn't open, return null
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Filter</h2>
//           <button className="modal-close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="modal-body">
//           <label className="modal-label">
//             Date Preset
//             <select
//               value={datePreset}
//               onChange={handleDatePresetChange}
//               className="modal-select"
//             >
//               <option value="all-time">All Time</option>
//               <option value="last-7-days">Last 7 Days</option>
//               <option value="last-14-days">Last 14 Days</option>
//               <option value="last-30-days">Last 30 Days</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last-day">Last Day</option>
//             </select>
//           </label>
          
//           {/* Conditional rendering of the format select */}
//           {!Base && (
//             <label className="modal-label">
//               Format
//               <select
//                 value={format}
//                 onChange={handleFormatChange}
//                 className="modal-select"
//               >
//                 <option value="">Select a format</option>
//                 <option value="all-time">All Time</option>
//                 <option value="Yearly">Yearly</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Daily">Daily</option>
//               </select>
//             </label>
//           )}

//           {Base && (
//             <label className="modal-label">
//               Base
//               <select
//                 value={format}
//                 onChange={handleFormatChange}
//                 className="modal-select"
//               >
//                 <option value="">Select a format</option>
//                 <option value="all-time">All</option>
//                 <option value="2nd">2nd Base</option>
//                 <option value="3rd">3rd+ Base</option>
//               </select>
//             </label>
//           )}
//         </div>
//         <div className="modal-footer">
//           <button className="modal-footer-btn" onClick={onClose}>
//             Close
//           </button>
//           <button
//             className="modal-footer-btn save-btn"
//             onClick={handleApplyFilters}
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FilterModal;


import React, { useState } from "react";

function FilterModal({ isOpen, onClose, Base, onApplyFilters,startDate,setStartDate,endDate,setEndDate }) {
  const [datePreset, setDatePreset] = useState("");
 
  const [format, setFormat] = useState("");

  // Handle changes to the date preset
  const handleDatePresetChange = (e) => {
    setDatePreset(e.target.value);
    // Reset custom date fields when date preset is selected
    if (e.target.value !== "custom-range") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Handle changes to the custom start and end date
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value); // Ensure this sets the correct value
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value); // Ensure this sets the correct value
  };

  // Handle changes to the format
  const handleFormatChange = (e) => setFormat(e.target.value);

  const handleApplyFilters = () => {
    // Pass the selected filters including custom date range if applicable
    onApplyFilters({
      datePreset,
      startDate,
      endDate,
      format: Base ? format : format, // For Base, it will use the format value; else the selected format
    });
    // Close the modal after applying the filters
    onClose();
  };

  // If the modal isn't open, return null
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Filter</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <label className="modal-label">
            Date Preset
            <select
              value={datePreset}
              onChange={handleDatePresetChange}
              className="modal-select"
            >
              <option value="all-time">All Time</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-14-days">Last 14 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-day">Last Day</option>
              <option value="custom-range">Custom Range</option> {/* Added option for custom date range */}
            </select>
          </label>

          {/* Conditional rendering for custom date range inputs */}
          {datePreset === "custom-range" && (
            <div>
              <label className="modal-label">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="modal-input"
                />
              </label>
              <label className="modal-label">
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="modal-input"
                />
              </label>
            </div>
          )}

          {/* Conditional rendering of the format select */}
          {!Base && (
            <label className="modal-label">
              Format
              <select
                value={format}
                onChange={handleFormatChange}
                className="modal-select"
              >
                <option value="">Select a format</option>
                <option value="all-time">All Time</option>
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Daily">Daily</option>
              </select>
            </label>
          )}

          {Base && (
            <label className="modal-label">
              Base
              <select
                value={format}
                onChange={handleFormatChange}
                className="modal-select"
              >
                <option value="">Select a format</option>
                <option value="all-time">All</option>
                <option value="2nd">2nd Base</option>
                <option value="3rd">3rd+ Base</option>
              </select>
            </label>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-footer-btn" onClick={onClose}>
            Close
          </button>
          <button
            className="modal-footer-btn save-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
