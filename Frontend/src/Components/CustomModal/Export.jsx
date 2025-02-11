import React, { useState } from "react";
import Modal from "./Modal";
import * as XLSX from "xlsx"; 

const Export = ({
  isOpen,
  onClose,
  data,
  filename,
  filters, 
  name,
}) => {
  const [startDate, setStartDate] = useState(filters?.startDate || ""); 
  const [endDate, setEndDate] = useState(filters?.endDate || ""); 
  

  const applyFilters = (data, filters, name) => {
    let filteredData = data;

    
    const dateField = name === "lead" ? "createdOn" : name === "dmp" ? "call_start_time" : name === "enrolle" ? "date" : null;


    
    if (filters?.startDate && filters?.endDate && dateField) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        filteredData = filteredData.filter((item) => {
            const itemDateField = item[dateField];
            if (!itemDateField) {
                console.error(`Item ${dateField} is missing:`, item); 
                return false; 
            }

            const itemDate = new Date(itemDateField); 

            if (isNaN(itemDate)) {
                console.error(`Invalid Date for item:`, itemDateField); 
                return false; 
            }

            const isInDateRange = itemDate >= start && itemDate <= end;
            return isInDateRange;
        });
    }

    return filteredData;
};


const handleExport = () => {
 

    
    const filteredData = applyFilters(data, { startDate, endDate }, name);

    if (filteredData.length === 0) {
        alert("No data available for the selected filters.");
        return; 
    }

    
    const ws = XLSX.utils.json_to_sheet(filteredData);

    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");

    
    XLSX.writeFile(wb, filename, {
        bookType: "xlsx",
        type: "binary",
        bom: false,
    });
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Data"
      footer={
        <>
          <button className="modal-footer-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-footer-btn save-btn" onClick={handleExport}>
            Export
          </button>
        </>
      }
    >
      <div className="modal-body-content">
        {/* Date filter inputs */}
        <div className="date-filter">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        <p>Click "Export" to download the filtered data as an Excel file.</p>
      </div>
    </Modal>
  );
};

export default Export;

