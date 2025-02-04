import React from "react";

const Pagination = ({
  handlePreviousPage,
  isPrevButtonDisabled,
  currentPage,
  campaignDetails,
  rowsPerPage,
  handleNextPage,
  isNextButtonDisabled,
  apitotalpage,
  name
}) => {
  return (
    <div className="pagination-controls flex justify-between items-center mt-4">
      <button
        onClick={handlePreviousPage}
        disabled={isPrevButtonDisabled}
        className={`px-4 py-2 rounded-md ${
          isPrevButtonDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Previous
      </button>
      <span>
        Page {currentPage + 1} of{" "}
        {name === "leadsent" || name === "dmp" || name === "leads" || name === "campaign"
          ? apitotalpage
          : Math.ceil(campaignDetails?.length / rowsPerPage)}
      </span>

      <button
        onClick={handleNextPage}
        disabled={isNextButtonDisabled}
        className={`px-4 py-2 rounded-md ${
          isNextButtonDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
