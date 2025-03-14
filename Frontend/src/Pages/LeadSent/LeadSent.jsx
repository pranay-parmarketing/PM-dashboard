// import React, { useContext, useEffect, useState } from "react";
// import { MdFileUpload } from "react-icons/md";
// import { IoMdAdd } from "react-icons/io";
// import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
// import { ApiTokenContext } from "../../context/Apicontext";
// import axios from "axios";
// import { MONGO_URI } from "../../Variables/Variables";
// import SelectInputs from "../../Components/SelectInput/SelectInputs";
// import Pagination from "../../Components/Pagination/Pagination";
// import FilterModal from "../../Components/CustomModal/FilterModal";
// import Export from "../../Components/CustomModal/Export";

// const LeadSent = () => {
//   const [mydata, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [error, setError] = useState("");
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   //
//   const [currentPage, setCurrentPage] = useState(0);

//   const [paginatedDetails, setPaginatedDetails] = useState([]);
//   const [campaignDetails, setCampaignDetails] = useState([]);
//   //
//   const [mongoData, setMongoData] = useState({});
//   const [loading, setLoading] = useState(false);
//   //
//   const [totalPages, setTotalPages] = useState(0);

//   const [apitotalpage, setApitotalpage] = useState(0);
//   //

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files && event.target.files[0];
//     setSelectedFile(file);
//     setError("");
//   };

//   const handleFileSave = () => {
//     if (!selectedFile) {
//       setError("Please choose a valid file.");
//     } else {
//       setIsModalOpen(false);
//     }
//   };

//   const filterData = (data, searchQuery) => {
//     if (!searchQuery) return data;

//     const searchTerm = searchQuery.toLowerCase();

//     return data.filter((row) => {
//       return (
//         (row.phone && row.phone.toLowerCase().includes(searchTerm)) ||
//         (row.source && row.source.toLowerCase().includes(searchTerm)) ||
//         (row.cust_name && row.cust_name.toLowerCase().includes(searchTerm)) ||
//         (row.first_disposition &&
//           row.first_disposition.toLowerCase().includes(searchTerm)) ||
//         (row.agent_username &&
//           row.agent_username.toLowerCase().includes(searchTerm))
//       );
//     });
//   };

//   const updatePaginatedDetails = () => {
//     const startIndex = currentPage * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const currentPageDetails = campaignDetails.slice(startIndex, endIndex);
//     setPaginatedDetails(currentPageDetails);
//   };

//   useEffect(() => {
//     if (currentPage >= totalPages) {
//       setCurrentPage(totalPages - 1);
//     }

//     if (campaignDetails.length > 0 && currentPage < totalPages) {
//       updatePaginatedDetails();
//     } else {
//       setCurrentPage(0);
//       updatePaginatedDetails();
//     }
//   }, [currentPage, rowsPerPage, campaignDetails, totalPages]);

//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   const isNextButtonDisabled = currentPage >= totalPages - 1;
//   const isPrevButtonDisabled = currentPage <= 0;

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const response = await axios.get(`${MONGO_URI}/api/leadsent`, {
//           params: {
//             page: currentPage + 1,
//             pageSize: rowsPerPage,
//             search: search,
//             sortOrder: "asc",
//             startDate: startDate,
//             endDate: endDate,
//             filterPreset: filters.datePreset,
//           },
//         });

//         if (response.data.dmps) {
//           setMongoData(response.data);
//           setCampaignDetails(response.data.dmps);
//           setCurrentPage(response.data.currentPage - 1);
//           setTotalPages(response.data.totalPages);
//         } else {
//           console.error("No dmp found in the response");
//         }
//       } catch (error) {
//         console.error("Error fetching dmp data:", error);
//       }
//     };

//     fetchCampaigns();
//   }, [currentPage, rowsPerPage, startDate, endDate]);

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0);
//   };

//   //

//   const [filters, setFilters] = useState({
//     datePreset: "",
//     format: "",
//   });

//   const closeModal = () => setIsModalOpen(false);
//   const openModal = () => setIsModalOpen(true);

//   const openExportModal = () => setIsExportModalOpen(true); // Open modal
//   const closeExportModal = () => setIsExportModalOpen(false); // Close modal

//   const handleApplyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const { datePreset, format } = filters;

//   const filterByDate = (details, preset, startDate = null, endDate = null) => {
//     if (!Array.isArray(details) || details.length === 0) {
//       console.warn("No details available to filter");
//       return [];
//     }

//     const currentDate = new Date();
//     let filteredData = [];

//     // Helper function to get UTC start of the day
//     const getUTCDate = (date) => {
//       const d = new Date(date);
//       d.setUTCHours(0, 0, 0, 0); // Convert to start of the day in UTC
//       return d;
//     };

//     // Helper function to get UTC end of the day
//     const getUTCEndOfDay = (date) => {
//       const d = new Date(date);
//       d.setUTCHours(23, 59, 59, 999); // Convert to end of the day in UTC
//       return d;
//     };

//     console.log(
//       "Current Date (UTC Start of the Day):",
//       getUTCDate(currentDate)
//     );

//     switch (preset) {
//       case "last-7-days": {
//         const last7Days = getUTCDate(currentDate);
//         last7Days.setUTCDate(last7Days.getUTCDate() - 7);
//         filteredData = details.filter(({ call_start_time }) => {
//           const callDate = call_start_time ? new Date(call_start_time) : null;
//           return callDate && callDate >= last7Days;
//         });
//         break;
//       }

//       case "last-14-days": {
//         const last14Days = getUTCDate(currentDate);
//         last14Days.setUTCDate(last14Days.getUTCDate() - 14);
//         filteredData = details.filter(({ call_start_time }) => {
//           const callDate = call_start_time ? new Date(call_start_time) : null;
//           return callDate && callDate >= last14Days;
//         });
//         break;
//       }

//       case "last-30-days": {
//         const last30Days = getUTCDate(currentDate);
//         last30Days.setUTCDate(last30Days.getUTCDate() - 30);
//         filteredData = details.filter(({ call_start_time }) => {
//           const callDate = call_start_time ? new Date(call_start_time) : null;
//           return callDate && callDate >= last30Days;
//         });
//         break;
//       }

//       case "yesterday": {
//         const yesterdayStart = getUTCDate(currentDate);
//         yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1); // Start of yesterday in UTC
//         const yesterdayEnd = getUTCEndOfDay(yesterdayStart); // End of yesterday in UTC

//         console.log("Yesterday Start (UTC):", yesterdayStart);
//         console.log("Yesterday End (UTC):", yesterdayEnd);

//         filteredData = details.filter(({ call_start_time }) => {
//           const callDate = call_start_time ? new Date(call_start_time) : null;
//           console.log(
//             "Checking call_start_time:",
//             call_start_time,
//             "Parsed as:",
//             callDate
//           );

//           // Compare UTC dates
//           return (
//             callDate && callDate >= yesterdayStart && callDate <= yesterdayEnd
//           );
//         });
//         break;
//       }

//       case "custom-range": {
//         if (startDate && endDate) {
//           const customStartDate = getUTCDate(startDate); // Ensure start date is a Date object
//           const customEndDate = getUTCEndOfDay(endDate); // Ensure end date is a Date object

//           filteredData = details.filter(({ call_start_time }) => {
//             const callDate = call_start_time ? new Date(call_start_time) : null;
//             return (
//               callDate &&
//               callDate >= customStartDate &&
//               callDate <= customEndDate
//             );
//           });
//         }
//         break;
//       }

//       default:
//         filteredData = details;
//         break;
//     }

//     console.log(`Filtered Data (${preset}):`, filteredData);
//     return filteredData;
//   };
//   const getFilteredData = () => {
//     let dataToFilter = [];

//     if (Array.isArray(mongoData?.dmps) && mongoData?.dmps.length > 0) {
//       dataToFilter = mongoData.dmps;
//     } else if (Array.isArray(mydata) && mydata.length > 0) {
//       dataToFilter = mydata;
//     }

//     const searchFilteredData = filterData(dataToFilter, search);

//     const finalFilteredData = filterByDate(
//       searchFilteredData,
//       datePreset,
//       startDate,
//       endDate
//     );

//     return finalFilteredData;
//   };

//   useEffect(() => {
//     if (mongoData?.totalPages) {
//       setApitotalpage(mongoData.totalPages);
//     }
//   }, [mongoData]);

//   const filteredData = getFilteredData();

//   const filteredCampaignDetails = filterByDate(
//     campaignDetails,
//     filters.datePreset
//   );

//   return (
//     <div className="home">
//       <ChooseFileModal
//         Name={"leadsent"}
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onFileChange={handleFileChange}
//         onFileSave={handleFileSave}
//         errorMessage={error}
//         apiEndpoint={`${MONGO_URI}/api/leadsent`}
//       />

//       <FilterModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         Base={false}
//         onApplyFilters={handleApplyFilters}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
//       />
//       {/*  */}
//       <Export
//         name="leadsent"
//         isOpen={isExportModalOpen}
//         onClose={closeExportModal} // Close handler
//         data={filteredData}
//         filename={`leadsent_data_${new Date().toISOString()}.csv`}
//         filters={filters}
//       />
//       {/*  */}

//       <div className="homeContainer">
//         <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
//           <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
//             Lead Sent
//           </h1>
//           <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
//             <button
//               className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
//               onClick={() => setIsExportModalOpen(true)}
//             >
//               <MdFileUpload className="mr-2 my-3" />
//               <span className="btn-text">Export Lead Sent</span>
//             </button>

//             <button
//               className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
//               onClick={openModal}
//             >
//               <IoMdAdd className="mr-2" />
//               <span className="btn-text">New Filter</span>
//             </button>
//           </div>
//         </div>

//         <div
//           className={` md:w-[90%]   bg-white shadow-md rounded-lg p-4 ${
//             isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
//           }`}
//         >
          // <SelectInputs
          //   name="leadsent"
          //   rowsPerPage={rowsPerPage}
          //   setSearch={setSearch}
          //   search={search}
          //   handleRowsPerPageChange={handleRowsPerPageChange}
          //   setCurrentPage={setCurrentPage}
          //   setMongoData={setMongoData}
          //   setCampaignDetails={setCampaignDetails}
          //   setTotalPages={setTotalPages}
          // />

//           <div className="overflow-x-auto">
//             <table className="min-w-max table-auto">
//               <thead>
//                 <tr className="bg-gray-800 text-white text-left">
//                   <th>#</th>
//                   <th>Created On</th>

//                   <th>Customer Name </th>
//                   <th>Phone </th>
//                   <th>Email </th>
//                   <th>Source</th>

//                   <th>Transfer To</th>
//                   <th>LVT Agent</th>
//                   <th>Lead Date </th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="18" className="text-center py-4">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : Array.isArray(filteredData) && filteredData.length > 0 ? (
//                   filteredData.map((row, index) => (
//                     <tr key={row._id}>
//                       <td>{index + 1 + currentPage * rowsPerPage}</td>
//                       <td>
//                         {row.Created_On
//                           ? new Date(row.Created_On).toLocaleString("en-GB", {
//                               timeZone: "UTC",
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                             })
//                           : "" || "N/A"}
//                       </td>

//                       <td>{row.cust_name || "N/A"}</td>
//                       <td>{row.phone || "N/A"}</td>
//                       <td>{row.email || "N/A"}</td>
//                       <td>{row.source || "N/A"}</td>
//                       <td>{"N/A"}</td>
//                       <td>{row.agent_username || "N/A"}</td>
//                       <td>{row.lead_date || "N/A"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="18" className="text-center py-4">
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <Pagination
//             name={"leadsent"}
//             apitotalpage={apitotalpage}
//             handlePreviousPage={handlePreviousPage}
//             isPrevButtonDisabled={isPrevButtonDisabled}
//             currentPage={currentPage}
//             campaignDetails={campaignDetails}
//             rowsPerPage={rowsPerPage}
//             handleNextPage={handleNextPage}
//             isNextButtonDisabled={isNextButtonDisabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadSent;

// // transfer call i only want and the count of yesterday so i need build the backend work on this monday


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MdFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
import FilterModal from "../../Components/CustomModal/FilterModal";
import Export from "../../Components/CustomModal/Export";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import { debounce } from "lodash";

const LeadSent = () => {
  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [mongoData, setMongoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ datePreset: "", format: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Immediate search input update
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value); // Update search state immediately
    debouncedSearch(value); // Debounce the API call
  };

  // Debounced search function for API calls
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setCurrentPage(0); // Reset to first page on new search
    }, 500),
    []
  );

  // Fetch campaigns with filters and pagination
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${MONGO_URI}/api/leadsent`, {
        params: {
          page: currentPage + 1,
          pageSize: rowsPerPage,
          search: search,
          sortOrder: "asc",
          startDate: startDate,
          endDate: endDate,
          filterPreset: filters.datePreset,
        },
      });

      if (response.data.dmps) {
        setMongoData(response.data);
        setCampaignDetails(response.data.dmps);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("No dmp found in the response");
      }
    } catch (error) {
      console.error("Error fetching dmp data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, search, startDate, endDate, filters.datePreset]);

  // Fetch campaigns when filters or pagination change
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to first page when rows per page changes
  }, []);

  // Handle filter application
  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setStartDate(newFilters.startDate);
    setEndDate(newFilters.endDate);
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  // Filter data based on search and date
  const filteredData = useMemo(() => {
    let dataToFilter = Array.isArray(mongoData?.dmps) ? mongoData.dmps : mydata;

    if (!dataToFilter.length) return [];

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      dataToFilter = dataToFilter.filter((row) =>
        Object.values(row).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Date filter
    if (filters.datePreset) {
      const currentDate = new Date();
      let startDateFilter, endDateFilter;

      switch (filters.datePreset) {
        case "last-7-days":
          startDateFilter = new Date();
          startDateFilter.setDate(currentDate.getDate() - 7);
          break;
        case "last-14-days":
          startDateFilter = new Date();
          startDateFilter.setDate(currentDate.getDate() - 14);
          break;
        case "last-30-days":
          startDateFilter = new Date();
          startDateFilter.setDate(currentDate.getDate() - 30);
          break;
        case "custom-range":
          startDateFilter = new Date(startDate);
          endDateFilter = new Date(endDate);
          break;
        default:
          break;
      }

      if (startDateFilter) {
        dataToFilter = dataToFilter.filter((row) => {
          const createdDate = row.Created_On ? new Date(row.Created_On) : null;
          return (
            createdDate &&
            (!startDateFilter || createdDate >= startDateFilter) &&
            (!endDateFilter || createdDate <= endDateFilter)
          );
        });
      }
    }

    return dataToFilter;
  }, [mongoData?.dmps, mydata, search, filters.datePreset, startDate, endDate]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  const isNextButtonDisabled = currentPage >= totalPages - 1;
  const isPrevButtonDisabled = currentPage <= 0;

  return (
    <div className="home">
      <ChooseFileModal
        Name={"leadsent"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFileChange={(e) => setSelectedFile(e.target.files[0])}
        onFileSave={() => {
          if (!selectedFile) setError("Please choose a valid file.");
          else setIsModalOpen(false);
        }}
        errorMessage={error}
        apiEndpoint={`${MONGO_URI}/api/leadsent`}
      />

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <Export
        name="leadsent"
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredData}
        filename={`leadsent_data_${new Date().toISOString()}.csv`}
        filters={filters}
      />

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Lead Sent
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsExportModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Export Lead Sent</span>
            </button>

            <button
              className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Filter</span>
            </button>
          </div>
        </div>

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
            name="leadsent"
            rowsPerPage={rowsPerPage}
            setSearch={setSearch}
            search={search}
            handleRowsPerPageChange={handleRowsPerPageChange}
            setCurrentPage={setCurrentPage}
            setMongoData={setMongoData}
            setCampaignDetails={setCampaignDetails}
            setTotalPages={setTotalPages}
          />

          <div className="overflow-x-auto">
            <table className="min-w-max table-auto w-full">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th>#</th>
                  <th>Created On</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Transfer To</th>
                  <th>LVT Agent</th>
                  <th>Lead Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="flex justify-center items-center h-64">
                        <span className="text-lg">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={row._id}>
                      <td>{index + 1 + currentPage * rowsPerPage}</td>
                      <td>
                        {row.Created_On
                          ? new Date(row.Created_On).toLocaleString("en-GB", {
                              timeZone: "UTC",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td>{row.cust_name || "N/A"}</td>
                      <td>{row.phone || "N/A"}</td>
                      <td>{row.email || "N/A"}</td>
                      <td>{row.source || "N/A"}</td>
                      <td>{"N/A"}</td>
                      <td>{row.agent_username || "N/A"}</td>
                      <td>{row.lead_date || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            name={"leadsent"}
            apitotalpage={totalPages}
            handlePreviousPage={handlePreviousPage}
            isPrevButtonDisabled={isPrevButtonDisabled}
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            isNextButtonDisabled={isNextButtonDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadSent;