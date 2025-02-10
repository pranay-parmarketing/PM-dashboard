// import React, { useState } from "react";
// import Modal from "./Modal";
// import * as XLSX from "xlsx"; // Import xlsx library

// const Export = ({
//   isOpen,
//   onClose,
//   data,
//   filename,
//   filters, // filters passed as props
// }) => {
//   const [startDate, setStartDate] = useState(filters?.startDate || ""); // Start date for filtering
//   const [endDate, setEndDate] = useState(filters?.endDate || ""); // End date for filtering
// console.log('filters',filters)
//   // Function to apply filters to the data
// // Function to apply filters to the data
// const applyFilters = (data, filters) => {
//   console.log("Filters Passed:", filters); // Log the filters passed to the function
//   let filteredData = data;

//   // Apply date filter if provided
//   if (filters?.startDate && filters?.endDate) {
//     const start = new Date(filters.startDate);
//     const end = new Date(filters.endDate);

//     console.log("Start Date:", start, "End Date:", end); // Log start and end dates for debugging

//     // Set the start time of the start date to midnight and end time of the end date to just before midnight
//     start.setHours(0, 0, 0, 0);
//     end.setHours(23, 59, 59, 999);

//     // Filter the data based on the date range
//     filteredData = filteredData.filter((item) => {
//       if (!item.createdOn) { // Use 'createdOn' instead of 'date'
//         console.error("Item date is missing:", item); // Log item missing date
//         return false; // Skip items without a date
//       }

//       const itemDate = new Date(item.createdOn); // Parse 'createdOn' as a date

//       if (isNaN(itemDate)) {
//         console.error(`Invalid Date for item:`, item.createdOn); // Log invalid date values
//         return false; // Skip invalid dates
//       }

//       const isInDateRange = itemDate >= start && itemDate <= end;
//       console.log("Item Date:", itemDate, "Is in range:", isInDateRange); // Log each item's date and whether it matches the filter
//       return isInDateRange;
//     });
//   }

//   console.log("Filtered Data:", filteredData); // Log the filtered data before returning
//   return filteredData;
// };

//   // Function to handle exporting the data to Excel
//   const handleExport = () => {
//     console.log("Data before filtering:", data); // Log data before filtering
//     console.log('filters', filters);

//     // Apply the filters to the data only if filters are set
//     const filteredData = applyFilters(data, { startDate, endDate });

//     if (filteredData.length === 0) {
//       alert("No data available for the selected filters.");
//       return; // Exit if no data after applying filters
//     }

//     // Convert the filtered data to a worksheet
//     const ws = XLSX.utils.json_to_sheet(filteredData);

//     // Create a workbook and append the worksheet
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");

//     // Save the workbook as an Excel file without BOM
//     XLSX.writeFile(wb, filename, { bookType: "xlsx", type: "binary", bom: false });
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Export Data"
//       footer={
//         <>
//           <button className="modal-footer-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="modal-footer-btn save-btn" onClick={handleExport}>
//             Export
//           </button>
//         </>
//       }
//     >
//       <div className="modal-body-content">
//         {/* Date filter inputs */}
//         <div className="date-filter">
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label>
//         </div>

//         <p>Click "Export" to download the filtered data as an Excel file.</p>
//       </div>
//     </Modal>
//   );
// };

// export default Export;

import React, { useState } from "react";
import Modal from "./Modal";
import * as XLSX from "xlsx"; // Import xlsx library

const Export = ({
  isOpen,
  onClose,
  data,
  filename,
  filters, // filters passed as props
  name,
}) => {
  const [startDate, setStartDate] = useState(filters?.startDate || ""); // Start date for filtering
  const [endDate, setEndDate] = useState(filters?.endDate || ""); // End date for filtering
  

  const applyFilters = (data, filters, name) => {
    let filteredData = data;

    // Determine the date field based on the 'name' prop
    const dateField = name === "lead" ? "createdOn" : name === "dmp" ? "call_start_time" : name === "enrolle" ? "date" : null;


    // Apply date filter if provided
    if (filters?.startDate && filters?.endDate && dateField) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        // Set the start time of the start date to midnight and end time of the end date to just before midnight
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // Filter the data based on the date range
        filteredData = filteredData.filter((item) => {
            const itemDateField = item[dateField];
            if (!itemDateField) {
                console.error(`Item ${dateField} is missing:`, item); // Log item missing date field
                return false; // Skip items without the date field
            }

            const itemDate = new Date(itemDateField); // Parse the date field as a date

            if (isNaN(itemDate)) {
                console.error(`Invalid Date for item:`, itemDateField); // Log invalid date values
                return false; // Skip invalid dates
            }

            const isInDateRange = itemDate >= start && itemDate <= end;// Log each item's date and whether it matches the filter
            return isInDateRange;
        });
    }

    return filteredData;
};

// Function to handle exporting the data to Excel
const handleExport = () => {
 

    // Apply the filters to the data only if filters are set
    const filteredData = applyFilters(data, { startDate, endDate }, name);

    if (filteredData.length === 0) {
        alert("No data available for the selected filters.");
        return; // Exit if no data after applying filters
    }

    // Convert the filtered data to a worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");

    // Save the workbook as an Excel file without BOM
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

