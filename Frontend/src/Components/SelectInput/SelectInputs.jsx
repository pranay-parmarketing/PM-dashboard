// import React, { useCallback } from "react";
// import Brands from "../BrandFilter/Brands";

// const SelectInputs = ({
//   rowsPerPage,
//   setSearch,
//   search,
//   handleRowsPerPageChange,
//   setCurrentPage,
//   name,
// }) => {

//   const handleSearchChange = useCallback(
//     (e) => {
//       const value = e.target.value;
//       setSearch(value);
//       setCurrentPage(0);

//     },
//     [setSearch, setCurrentPage]
//   );

//   return (
//     <div className="table-header flex justify-between items-center mb-4">
//       <select
//         value={rowsPerPage}
//         onChange={handleRowsPerPageChange}
//         className="border p-2 rounded-md"
//       >
//         <option value={500}>Show 500 entries</option>
//         <option value={100}>Show 100 entries</option>
//         <option value={50}>Show 50 entries</option>
//         <option value={25}>Show 25 entries</option>
//         <option value={10}>Show 10 entries</option>
//       </select>

//       {name === "campaign" || name === "adset" || name === "ads" || name === "lead" ? (
//         <Brands setSearch={setSearch} setCurrentPage={setCurrentPage} />
//       ) : null}

//       {["campaign", "adset", "ads", "account", "allpayments","lead"].includes(name) && (
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={handleSearchChange}
//           className="border border-gray-300 p-2 rounded-md"
//         />
//       )}
//     </div>
//   );
// };

// export default SelectInputs;

import React, { useCallback, useEffect } from "react";
import Brands from "../BrandFilter/Brands";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";

const SelectInputs = ({
  rowsPerPage,
  setSearch,
  search,
  handleRowsPerPageChange,
  setCurrentPage,
  name,
  setMongoData,
  setCampaignDetails,
  setTotalPages,
}) => {
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      setCurrentPage(0); // Reset to page 1 when search is modified
    },
    [setSearch, setCurrentPage]
  );

  useEffect(() => {
    if (name !== "lead") return; // Only run the effect if the name is "lead"

    if (search === "") return; // Prevent fetching if search is empty

    // API call when search value or page changes
    const fetchDataFromAPI = async () => {
      try {
        const response = await axios.get(`${MONGO_URI}/api/leads`, {
          params: {
            page: 1, // Adjust based on your page logic
            pageSize: rowsPerPage,
            search: search,
            sortOrder: "asc",
            startDate: null, // Use your actual start date
            endDate: null, // Use your actual end date
          },
        });

        // Call the function passed in props to update data (setMongoData should be passed to parent)
        setMongoData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDataFromAPI();
  }, [search, rowsPerPage, setCurrentPage, MONGO_URI, name, setMongoData]);

  return (
    <div className="table-header flex justify-between items-center mb-4">
      <select
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        className="border p-2 rounded-md"
      >
        <option value={500}>Show 500 entries</option>
        <option value={100}>Show 100 entries</option>
        <option value={50}>Show 50 entries</option>
        <option value={25}>Show 25 entries</option>
        <option value={10}>Show 10 entries</option>
      </select>

      {name === "campaign" ||
      name === "adset" ||
      name === "ads" ||
      name === "lead" ? (
        <Brands setSearch={setSearch} setCurrentPage={setCurrentPage} />
      ) : null}

      {["campaign", "adset", "ads", "account", "allpayments", "lead"].includes(
        name
      ) && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 rounded-md"
        />
      )}
    </div>
  );
};

export default SelectInputs;
