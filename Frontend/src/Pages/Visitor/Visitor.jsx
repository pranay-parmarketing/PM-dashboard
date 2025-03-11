// import React, { useEffect, useState } from "react";
// import { IoMdAdd } from "react-icons/io";
// import { MdFileUpload } from "react-icons/md";
// import axios from "axios";
// import { MONGO_URI } from "../../Variables/Variables";

// const Visitor = () => {
//   const [visitorCount, setVisitorCount] = useState([]);
//   const [days, setDays] = useState(10); // Default value for days
//   const [loading, setLoading] = useState(false); // To track loading state

//   // Function to fetch visitor data
//   const fetchVisitorCount = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${MONGO_URI}/api/visitorcount`, {
//         params: { days: days }, // Pass the selected days as query parameter
//       });
//       setVisitorCount(response.data.analyticsData); // ✅ Fix: Access `response.data.analyticsData`
//     } catch (error) {
//       console.error("Error fetching visitor count:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect to fetch data when the component mounts
//   useEffect(() => {
//     fetchVisitorCount();
//   }, []); // Initial fetch on mount

//   // Handle change in days input
//   const handleDaysChange = (e) => {
//     setDays(e.target.value);
//   };

//   return (
//     <div className="home">
//       <div className="homeContainer">
//         <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
//           <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
//             Visitors
//           </h1>

//           {/* Input to select number of days */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="number"
//               value={days}
//               onChange={handleDaysChange}
//               className="p-2 border rounded-md"
//               min="1" // Minimum of 1 day
//               placeholder="Enter days"
//             />
//             <button
//               onClick={fetchVisitorCount}
//               className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
//             >
//               Fetch Data
//             </button>
//           </div>

//           <div
//             className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center"
//             style={{ visibility: "hidden" }}
//           >
//             <button className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto">
//               <MdFileUpload className="mr-2 my-3" />
//               <span className="btn-text">Import Adset</span>
//             </button>
//             <button className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto">
//               <IoMdAdd className="mr-2" />
//               <span className="btn-text">New Adset</span>
//             </button>
//           </div>
//         </div>

//         <div
//           className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 md:ml-16 lg:ml-16`}
//         >
//           <div className="overflow-x-auto">
//             <table className="min-w-max table-auto">
// <thead>
//   <tr className="bg-gray-800 text-white text-left">
//     <th className="px-4 py-2">#</th>
//     <th className="px-4 py-2">Date</th>

//     <th className="px-4 py-2">Active Users</th>
//   </tr>
// </thead>

//               <tbody className="text-gray-700">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="3" className="text-center px-4 py-2">
//                       Loading visitor data...
//                     </td>
//                   </tr>
//                 ) : visitorCount.length > 0 ? (
//                   visitorCount.map((item, index) => (
// <tr key={index} className="border-b border-gray-300">
//   <td className="px-4 py-2">{index + 1}</td>
//   <td className="px-4 py-2">{item.date}</td>

//   <td className="px-4 py-2">{item.activeUsers}</td>
// </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-center px-4 py-2">
//                       No data available for the selected period.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Visitor;

import React, { useEffect, useState, useContext } from "react";
import FilterModal from "../../Components/CustomModal/FilterModal";
import Pagination from "../../Components/Pagination/Pagination";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import axios from "axios";
import { ApiTokenContext } from "../../context/Apicontext";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import { MONGO_URI } from "../../Variables/Variables";

const Visitor = () => {
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

  const [days, setDays] = useState(10);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, search, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${MONGO_URI}/api/visitorcount/paginated`, {
        params: {
          page: Math.max(1, currentPage + 1),
          limit: rowsPerPage,
          search,
          sort: "sentDate",
          order: "desc",
          datePreset: filters.datePreset,
          startDate,
          endDate,

          days: days,
        },
      });

      setData(res.data.analyticsData || []);
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
            Visitors
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
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Date</th>

                  <th className="px-4 py-2">Active Users</th>
                </tr>
              </thead>

              <tbody>
                {mydata.length > 0 ? (
                  mydata.map((row, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td>{currentPage * rowsPerPage + index + 1}</td>
                      <td className="px-4 py-2">{row.date}</td>

                      <td className="px-4 py-2">{row.activeUsers}</td>
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

export default Visitor;
