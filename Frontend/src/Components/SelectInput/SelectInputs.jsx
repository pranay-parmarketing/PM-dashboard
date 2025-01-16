import React, { useCallback } from "react";
import Brands from "../BrandFilter/Brands";

const SelectInputs = ({
  rowsPerPage,
  setSearch,
  search,
  handleRowsPerPageChange,
  setCurrentPage,
  name,
}) => {
 

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value); // Update the search term
      setCurrentPage(0); // Reset to the first page
     
    },
    [setSearch, setCurrentPage]
  );

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

      {name === "campaign" || name === "adset" || name === "ads" || name === "lead" ? (
        <Brands setSearch={setSearch} setCurrentPage={setCurrentPage} />
      ) : null}

      {["campaign", "adset", "ads", "account", "allpayments","lead"].includes(name) && (
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
