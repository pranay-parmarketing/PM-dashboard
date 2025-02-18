import React, { useEffect, useState, useContext } from "react";
import FilterModal from "../../Components/CustomModal/FilterModal";
import Pagination from "../../Components/Pagination/Pagination";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import axios from "axios";
import { ApiTokenContext } from "../../context/Apicontext";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import { MONGO_URI } from "../../Variables/Variables";

const PackSent = () => {
  const { setAllPayment } = useContext(ApiTokenContext);

  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Start from page 0
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ datePreset: "", format: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, search, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${MONGO_URI}/api/packsent`, {
        params: {
          page: Math.max(1, currentPage + 1),
          limit: rowsPerPage,
          search,
          sort: "sentDate",
          order: "desc",
          datePreset: filters.datePreset,
          startDate,
          endDate,
        },
      });

      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to first page
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  return (
    <div className="home">
      <FilterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApplyFilters={handleApplyFilters}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        endDate={endDate}
        startDate={startDate}
      />

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            {" "}
            Pack Sent
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
              onClick={openModal}
            >
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Filter</span>
            </button>
          </div>
        </div>

        <div className="w-[90%] bg-white shadow-md rounded-lg p-4 ml-16 lg:ml-16">
          <SelectInputs
            name="packsent"
            rowsPerPage={rowsPerPage}
            setSearch={setSearch}
            search={search}
            handleRowsPerPageChange={handleRowsPerPageChange}
            setCurrentPage={setCurrentPage}
          />
          <div className="overflow-x-auto">
            <table className="min-w-max table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th>#</th>
                  <th>Lead Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Sent Date</th>
                  <th>Completed Date</th>
                  <th>Status</th>
                  <th>Agent Name</th>
                  <th>DI</th>
                </tr>
              </thead>
              <tbody>
                {mydata.length > 0 ? (
                  mydata.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td>{currentPage * rowsPerPage + index + 1}</td>
                      <td className="px-4 py-2">{row.leadDate || "N/A"}</td>
                      <td className="px-4 py-2">{row.name || "N/A"}</td>
                      <td className="px-4 py-2">{row.phone || "N/A"}</td>
                      <td className="px-4 py-2">{row.email || "N/A"}</td>
                      <td className="px-4 py-2">{row.source || "N/A"}</td>
                      <td className="px-4 py-2">{row.sentDate || "N/A"}</td>
                      <td className="px-4 py-2">
                        {row.completedDate || "N/A"}
                      </td>
                      <td className="px-4 py-2">{row.status || "N/A"}</td>
                      <td className="px-4 py-2">{row.agentname || "N/A"}</td>
                      <td className="px-4 py-2">N/A</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-2">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            name="packsent"
            handlePreviousPage={handlePreviousPage}
            isPrevButtonDisabled={currentPage <= 0}
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            isNextButtonDisabled={currentPage >= totalPages - 1}
            apitotalpage={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default PackSent;
