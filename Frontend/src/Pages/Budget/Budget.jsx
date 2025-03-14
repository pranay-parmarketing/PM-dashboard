// import { useState, useEffect, useContext } from "react";
// import { ApiTokenContext } from "../../context/Apicontext";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
// import AddModal from "../../Components/CustomModal/AddModal";
// import { MdFileUpload } from "react-icons/md";
// import { IoMdAdd } from "react-icons/io";
// import FilterModal from "../../Components/CustomModal/FilterModal";
// import axios from "axios";
// import { MONGO_URI } from "../../Variables/Variables";
// import SelectInputs from "../../Components/SelectInput/SelectInputs";
// import Pagination from "../../Components/Pagination/Pagination";
// import DetailsModal from "../../Components/CustomModal/DetailsModal";

// const Budget = () => {
//   const [mydata, setData1] = useState([]);
//   const { appsecret_proof, access_token, selectedAccount } =
//     useContext(ApiTokenContext);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [allIds, setAllIds] = useState([]);
//   const [campaignDetails, setCampaignDetails] = useState([]);
//   const [nextPage, setNextPage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(25);
//   const [paginatedDetails, setPaginatedDetails] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [error, setError] = useState("");
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [search, setSearch] = useState("");
//   //
//   const [startDate, setStartDate] = useState(""); // State for custom start date
//   const [endDate, setEndDate] = useState(""); // State for custom end date
//   const [mongoData, setMongoData] = useState({});

//   const accessToken = access_token;
//   const appSecretProof = appsecret_proof;

//   const dataKey = "campaign_data";
//   const expirationKey = "campaign_data_expiration";

//   // Function to save campaign data to MongoDB
//   const saveBudgetData = async (budgetData) => {
//     try {
//       const saveResponse = await axios.post(
//         `${MONGO_URI}/api/save-budget`,
//         [budgetData],
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     } catch (saveError) {
//       console.error(
//         "Error saving campaign data:",
//         saveError.response ? saveError.response?.data : saveError.message
//       );
//     }
//   };

//   const fetchAllIds = async (url) => {
//     setLoading(true);
//     let allFetchedIds = [];

//     try {
//       let currentUrl = url;
//       while (currentUrl) {
//         const finalUrl = `${currentUrl}`;
//         // const finalUrl = `${currentUrl}&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
//         const response = await fetch(finalUrl);
//         const result = await response.json();

//         // if (result?.data) {
//         //   const newIds = result?.data.map((item) => item.id);

//         if (result) {
//           const newIds = result?.map((item) => item.id);

//           allFetchedIds = [...allFetchedIds, ...newIds];
//         }

//         currentUrl = result?.paging?.next || null;
//       }

//       setAllIds(allFetchedIds);
//     } catch (error) {
//       console.error("Error fetching campaign data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const fetchDetailsForIds = async () => {
//     setLoading(true);
//     const newCampaignDetails = [];

//     try {
//       // Fetch data for all IDs concurrently
//       const fetchPromises = allIds.map(async (id) => {
//         const cachedData = localStorage.getItem(`campaign_${id}`);
//         const cacheTimestamp = localStorage.getItem(`campaign_${id}_timestamp`);

//         if (
//           cachedData &&
//           cacheTimestamp &&
//           Date.now() - cacheTimestamp < 3600000
//         ) {
//           return JSON.parse(cachedData);
//         } else {
//           const url = `https://graph.facebook.com/v17.0/${id}?fields=id,name,created_time,adsets{name,daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,daily_budget},ads{id,name}}&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
//           // const url = `https://graph.facebook.com/v17.0/${id}?fields=id,name,daily_budget,lifetime_budget,status,start_time,bid_strategy,created_time,updated_time&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
//           const response = await fetch(url);
//           const result = await response.json();

//           if (result && result?.id) {
//             localStorage.setItem(`campaign_${id}`, JSON.stringify(result));
//             localStorage.setItem(`campaign_${id}_timestamp`, Date.now());
//             await saveBudgetData(result); // Save data to MongoDB
//             return result;
//           }
//         }
//       });

//       const results = await Promise.all(fetchPromises);
//       newCampaignDetails.push(...results.filter(Boolean));
//       setCampaignDetails(newCampaignDetails);
//     } catch (error) {
//       console.error("Error fetching campaign details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStoredData = () => {
//     const storedData = localStorage.getItem(dataKey);
//     const storedExpiration = localStorage.getItem(expirationKey);

//     if (storedData && storedExpiration) {
//       const expirationTime = parseInt(storedExpiration, 10);
//       const currentTime = Date.now();

//       // Check if data is expired
//       if (currentTime < expirationTime) {
//         return JSON.parse(storedData);
//       } else {
//         // Clear expired data
//         localStorage.removeItem(dataKey);
//         localStorage.removeItem(expirationKey);
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (selectedAccount) {
//       const accountId =
//         typeof selectedAccount === "string"
//           ? selectedAccount
//           : selectedAccount.id || selectedAccount.accountId;

//       if (accountId) {
//         // const initialUrl = `https://graph.facebook.com/v17.0/act_${accountId}/campaigns?fields=id,name,status,objective,start_time,daily_budget`;
//         const initialUrl = `${MONGO_URI}/api/save-campaigns/${accountId}`;

//         const storedCampaignDetails = getStoredData();

//         if (storedCampaignDetails) {
//           setCampaignDetails(storedCampaignDetails);
//         } else {
//           fetchAllIds(initialUrl);
//         }
//       } else {
//         console.error(
//           "No valid accountId found in selectedAccount:",
//           selectedAccount
//         );
//       }
//     } else {
//       console.error("selectedAccount is not available.");
//     }
//   }, [selectedAccount]);

//   useEffect(() => {
//     if (allIds.length > 0) {
//       fetchDetailsForIds(); // Fetch campaign details whenever IDs are fetched
//     }
//   }, [allIds]);

//   const handleEdit = (detail) => {
//     setSelectedRow(detail);
//     setIsDetailModalOpen(true);
//   };

//   const totalPages = Math.ceil(campaignDetails?.length / rowsPerPage);

//   // Update paginated details when currentPage, rowsPerPage, or campaignDetails change
//   const updatePaginatedDetails = () => {
//     const startIndex = currentPage * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const currentPageDetails = campaignDetails.slice(startIndex, endIndex);

//     setPaginatedDetails(currentPageDetails);
//   };

//   useEffect(() => {
//     // If currentPage exceeds the available pages, reset to the last valid page
//     if (currentPage >= totalPages) {
//       setCurrentPage(totalPages - 1);
//     }

//     // Check if the current page has valid data; if not, set it to the last valid page
//     if (currentPage < totalPages && campaignDetails?.length > 0) {
//       updatePaginatedDetails();
//     } else {
//       setCurrentPage(0); // Reset to first page if no data for the current page
//       updatePaginatedDetails();
//     }
//   }, [currentPage, rowsPerPage, campaignDetails, totalPages]);

//   // Handle next page
//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   // Handle previous page
//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   const isNextButtonDisabled = currentPage >= totalPages - 1;
//   const isPrevButtonDisabled = currentPage <= 0;

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0);
//   };

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

//   const [filters, setFilters] = useState({
//     datePreset: "",
//     format: "",
//   });

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleApplyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const { datePreset, format } = filters;

//   const filterByDate = (details, preset) => {
//     const currentDate = new Date();
//     let filteredData = [];

//     switch (preset) {
//       case "last-7-days":
//         const last7Days = new Date();
//         last7Days.setDate(currentDate.getDate() - 7);
//         filteredData = details.filter(
//           (detail) => new Date(detail.created_time) >= last7Days
//         );
//         break;

//       case "last-14-days":
//         const last14Days = new Date();
//         last14Days.setDate(currentDate.getDate() - 14);
//         filteredData = details.filter(
//           (detail) => new Date(detail.created_time) >= last14Days
//         );
//         break;

//       case "last-30-days":
//         const last30Days = new Date();
//         last30Days.setDate(currentDate.getDate() - 30);
//         filteredData = details.filter(
//           (detail) => new Date(detail.created_time) >= last30Days
//         );
//         break;

//       case "yesterday":
//         const yesterday = new Date();
//         yesterday.setDate(currentDate.getDate() - 1);
//         filteredData = details.filter(
//           (detail) =>
//             new Date(detail.created_time).toDateString() ===
//             yesterday.toDateString()
//         );
//         break;

//       case "last-day":
//         const lastDay = new Date();
//         lastDay.setDate(currentDate.getDate() - 1);
//         filteredData = details.filter(
//           (detail) =>
//             new Date(detail.created_time).toDateString() ===
//             lastDay.toDateString()
//         );
//         break;

//       case "all-time":
//       default:
//         filteredData = details; // No filtering for all-time
//         break;
        
//         case "custom-range": {
//           if (startDate && endDate) {
//             const customStartDate = new Date(startDate);
//             const customEndDate = new Date(endDate);
//             customStartDate.setHours(0, 0, 0, 0);
//             customEndDate.setHours(23, 59, 59, 999);
        
//             console.log("Filtering from:", customStartDate, "to", customEndDate);
        
//             filteredData = details.filter((detail) => {
//               const createdDate = detail.created_time
//                 ? new Date(detail.created_time) // Explicitly parse ISO string
//                 : null;
        
//               console.log("Checking:", createdDate);
        
//               return (
//                 createdDate &&
//                 createdDate >= customStartDate &&
//                 createdDate <= customEndDate
//               );
//             });
        
//             console.log("Filtered Data:", filteredData);
//           }
//           break;
//         }
        
//     }

//     return filteredData;
//   };

//   const filteredData = filterByDate(paginatedDetails, datePreset);

//   //

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const campaignData = [];
//         for (let id of allIds) {
//           const response = await axios.get(
//             `${MONGO_URI}/api/save-budget/${id}`
//           );

//           if (response?.data.length > 0) {
//             campaignData.push(...response?.data);
//           } else {
//             console.warn(`No budget found for ID: ${id}`);
//           }
//         }

//         setMongoData(campaignData);
//       } catch (error) {
//         console.error("Error fetching campaigns:", error);
//       }
//     };

//     if (selectedAccount && allIds?.length > 0) {
//       fetchCampaigns();
//     } else {
//       console.warn("Missing selectedAccount or allIds, skipping fetch.");
//     }
//   }, [selectedAccount, allIds]);

//   return (
//     <div className="home">
//       <ChooseFileModal
//         Name={"Budget"}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onFileChange={handleFileChange}
//         onFileSave={handleFileSave}
//         errorMessage={error}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
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

//       <DetailsModal
//         Name="Budget"
//         isOpen={isDetailModalOpen}
//         onClose={() => setIsDetailModalOpen(false)}
//         selected={selectedRow}
//         id={selectedRow?.id}
//         paginatedDetails={paginatedDetails}
//       />
//       {/*  */}

//       <div className="homeContainer">
//         <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
//           <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
//             Budget
//           </h1>

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
//           <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
//             <button
//               className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
//               onClick={openModal}
//             >
//               <IoMdAdd className="mr-2" />
//               <span className="btn-text">New Filter</span>
//             </button>
//           </div>
//         </div>
//         {/*  */}

//         <div
//           className={` md:w-[90%]   bg-white shadow-md rounded-lg p-4 ${
//             isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
//           }`}
//         >
//           <SelectInputs
//             name="budget"
//             rowsPerPage={rowsPerPage}
//             setSearch={setSearch}
//             search={search}
//             handleRowsPerPageChange={handleRowsPerPageChange}
//             setCurrentPage={setCurrentPage}
//           />

//           {/*  */}

//           <div className="overflow-x-auto">
//             <table className="min-w-max table-auto">
//               <thead>
//                 <tr className="bg-gray-800 text-white text-left">
//                   <th>#</th>
//                   <th>Date</th>
//                   <th>campaign Name</th>
//                   <th>Total Budget</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : filteredData.length > 0 ? (
//                   filteredData
//                     .sort(
//                       (a, b) =>
//                         new Date(b.created_time) - new Date(a.created_time)
//                     ) // Sort by `created_time` in descending order
//                     .map((detail, index) => (
//                       <tr key={detail.id} className="border-b">
//                         <td data-label="#">
//                           {index + 1 + currentPage * rowsPerPage}
//                         </td>
//                         <td data-label="Date" className="px-4 py-2">
//                           {/* Format the date */}
//                           {new Date(detail.created_time).toLocaleDateString()}
//                         </td>

//                         <td data-label="Name" className="px-4 py-2">
//                           {/* Format the date */}
//                           {detail.name}
//                         </td>

//                         {/* <td data-label="Total Budget" className="px-4 py-2">
//                           {detail?.adsets?.data?.[0]?.campaign?.daily_budget
//                             ? parseInt(
//                                 detail.adsets.data[0].campaign.daily_budget,
//                                 10
//                               ) / 100
//                             : Array.isArray(detail?.adsets?.data) &&
//                               detail?.adsets?.data.length > 0
//                             ? detail?.adsets?.data.reduce((total, adset) => {
//                                 const budget =
//                                   parseInt(adset?.daily_budget, 10) || 0; // Use a fallback value if `daily_budget` is undefined
//                                 return total + budget;
//                               }, 0) / 100 // Divide by 100 if needed
//                             : "Data not available"}
//                         </td> */}

//                         <td data-label="Total Budget" className="px-4 py-2">
//                           {detail?.adsets?.data?.[0]?.campaign?.daily_budget
//                             ? parseInt(
//                                 detail.adsets.data[0].campaign.daily_budget,
//                                 10
//                               ) / 100
//                             : detail?.adsets?.data?.[0]?.campaign
//                                 ?.lifetime_budget
//                             ? parseInt(
//                                 detail.adsets.data[0].campaign.lifetime_budget,
//                                 10
//                               ) / 100
//                             : Array.isArray(detail?.adsets?.data) &&
//                               detail?.adsets?.data.length > 0
//                             ? detail?.adsets?.data.reduce((total, adset) => {
//                                 const budget =
//                                   parseInt(adset?.daily_budget, 10) ||
//                                   parseInt(adset?.lifetime_budget, 10) ||
//                                   0; // Use lifetime_budget if daily_budget is undefined
//                                 return total + budget;
//                               }, 0) / 100 // Divide by 100 if needed
//                             : "Data not available"}
//                         </td>

//                         <td
//                           data-label="Actions"
//                           className="px-4 py-2 text-center"
//                         >
//                           <button
//                             onClick={() => handleEdit(detail)}
//                             className="edit-button mx-2 text-blue-500 hover:text-blue-700"
//                           >
//                             <FaEdit />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4">
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Controls */}
//           <Pagination
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

// export default Budget;




import { useState, useEffect, useContext } from "react";
import { ApiTokenContext } from "../../context/Apicontext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
import AddModal from "../../Components/CustomModal/AddModal";
import { MdFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import FilterModal from "../../Components/CustomModal/FilterModal";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";
import DetailsModal from "../../Components/CustomModal/DetailsModal";

const Budget = () => {
  const [mydata, setData1] = useState([]);
  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allIds, setAllIds] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [paginatedDetails, setPaginatedDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(""); // State for custom start date
  const [endDate, setEndDate] = useState(""); // State for custom end date
  const [mongoData, setMongoData] = useState({});
  const [filters, setFilters] = useState({
    datePreset: "",
    format: "",
  });

  const accessToken = access_token;
  const appSecretProof = appsecret_proof;

  const dataKey = "campaign_data";
  const expirationKey = "campaign_data_expiration";

  // Function to save campaign data to MongoDB
  const saveBudgetData = async (budgetData) => {
    try {
      const saveResponse = await axios.post(
        `${MONGO_URI}/api/save-budget`,
        [budgetData],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (saveError) {
      console.error(
        "Error saving campaign data:",
        saveError.response ? saveError.response?.data : saveError.message
      );
    }
  };

  const fetchAllIds = async (url) => {
    setLoading(true);
    let allFetchedIds = [];

    try {
      let currentUrl = url;
      while (currentUrl) {
        const finalUrl = `${currentUrl}`;
        const response = await fetch(finalUrl);
        const result = await response.json();

        if (result) {
          const newIds = result?.map((item) => item.id);
          allFetchedIds = [...allFetchedIds, ...newIds];
        }

        currentUrl = result?.paging?.next || null;
      }

      setAllIds(allFetchedIds);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchDetailsForIds = async () => {
    setLoading(true);
    const newCampaignDetails = [];

    try {
      const fetchPromises = allIds.map(async (id) => {
        const cachedData = localStorage.getItem(`campaign_${id}`);
        const cacheTimestamp = localStorage.getItem(`campaign_${id}_timestamp`);

        if (
          cachedData &&
          cacheTimestamp &&
          Date.now() - cacheTimestamp < 3600000
        ) {
          return JSON.parse(cachedData);
        } else {
          const url = `https://graph.facebook.com/v17.0/${id}?fields=id,name,created_time,adsets{name,daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,daily_budget},ads{id,name}}&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
          const response = await fetch(url);
          const result = await response.json();

          if (result && result?.id) {
            localStorage.setItem(`campaign_${id}`, JSON.stringify(result));
            localStorage.setItem(`campaign_${id}_timestamp`, Date.now());
            await saveBudgetData(result); // Save data to MongoDB
            return result;
          }
        }
      });

      const results = await Promise.all(fetchPromises);
      newCampaignDetails.push(...results.filter(Boolean));
      setCampaignDetails(newCampaignDetails);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStoredData = () => {
    const storedData = localStorage.getItem(dataKey);
    const storedExpiration = localStorage.getItem(expirationKey);

    if (storedData && storedExpiration) {
      const expirationTime = parseInt(storedExpiration, 10);
      const currentTime = Date.now();

      if (currentTime < expirationTime) {
        return JSON.parse(storedData);
      } else {
        localStorage.removeItem(dataKey);
        localStorage.removeItem(expirationKey);
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedAccount) {
      const accountId =
        typeof selectedAccount === "string"
          ? selectedAccount
          : selectedAccount.id || selectedAccount.accountId;

      if (accountId) {
        const initialUrl = `${MONGO_URI}/api/save-campaigns/${accountId}`;
        const storedCampaignDetails = getStoredData();

        if (storedCampaignDetails) {
          setCampaignDetails(storedCampaignDetails);
        } else {
          fetchAllIds(initialUrl);
        }
      } else {
        console.error(
          "No valid accountId found in selectedAccount:",
          selectedAccount
        );
      }
    } else {
      console.error("selectedAccount is not available.");
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (allIds.length > 0) {
      fetchDetailsForIds(); // Fetch campaign details whenever IDs are fetched
    }
  }, [allIds]);

  const handleEdit = (detail) => {
    setSelectedRow(detail);
    setIsDetailModalOpen(true);
  };

  const filterByDate = (details, preset) => {
    const currentDate = new Date();
    let filteredData = [];

    switch (preset) {
      case "last-7-days":
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        filteredData = details.filter(
          (detail) => new Date(detail.created_time) >= last7Days
        );
        break;

      case "last-14-days":
        const last14Days = new Date();
        last14Days.setDate(currentDate.getDate() - 14);
        filteredData = details.filter(
          (detail) => new Date(detail.created_time) >= last14Days
        );
        break;

      case "last-30-days":
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        filteredData = details.filter(
          (detail) => new Date(detail.created_time) >= last30Days
        );
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        filteredData = details.filter(
          (detail) =>
            new Date(detail.created_time).toDateString() ===
            yesterday.toDateString()
        );
        break;

      case "last-day":
        const lastDay = new Date();
        lastDay.setDate(currentDate.getDate() - 1);
        filteredData = details.filter(
          (detail) =>
            new Date(detail.created_time).toDateString() ===
            lastDay.toDateString()
        );
        break;

      case "custom-range":
        if (startDate && endDate) {
          const customStartDate = new Date(startDate);
          const customEndDate = new Date(endDate);
          customStartDate.setHours(0, 0, 0, 0);
          customEndDate.setHours(23, 59, 59, 999);

          filteredData = details.filter((detail) => {
            const createdDate = new Date(detail.created_time);
            return createdDate >= customStartDate && createdDate <= customEndDate;
          });
        }
        break;

      case "all-time":
      default:
        filteredData = details; // No filtering for all-time
        break;
    }

    return filteredData;
  };

  const filteredData = filterByDate(campaignDetails, filters.datePreset);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const isNextButtonDisabled = currentPage >= totalPages - 1;
  const isPrevButtonDisabled = currentPage <= 0;

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
    setError("");
  };

  const handleFileSave = () => {
    if (!selectedFile) {
      setError("Please choose a valid file.");
    } else {
      setIsModalOpen(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignData = [];
        for (let id of allIds) {
          const response = await axios.get(
            `${MONGO_URI}/api/save-budget/${id}`
          );

          if (response?.data.length > 0) {
            campaignData.push(...response?.data);
          } else {
            console.warn(`No budget found for ID: ${id}`);
          }
        }

        setMongoData(campaignData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    if (selectedAccount && allIds?.length > 0) {
      fetchCampaigns();
    } else {
      console.warn("Missing selectedAccount or allIds, skipping fetch.");
    }
  }, [selectedAccount, allIds]);

  return (
    <div className="home">
      <ChooseFileModal
        Name={"Budget"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileChange={handleFileChange}
        onFileSave={handleFileSave}
        errorMessage={error}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <FilterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        Base={false}
        onApplyFilters={handleApplyFilters}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <DetailsModal
        Name="Budget"
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selected={selectedRow}
        id={selectedRow?.id}
        paginatedDetails={paginatedData}
      />

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center">
            Budget
          </h1>

          <div
            className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center"
            style={{ visibility: "hidden" }}
          >
            <button className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto">
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import Adset</span>
            </button>
            <button className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto">
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Adset</span>
            </button>
          </div>
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

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
            name="budget"
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
                  <th>Date</th>
                  <th>Campaign Name</th>
                  <th>Total Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData
                    .sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
                    .map((detail, index) => (
                      <tr key={detail.id} className="border-b">
                        <td data-label="#">{index + 1 + currentPage * rowsPerPage}</td>
                        <td data-label="Date" className="px-4 py-2">
                          {new Date(detail.created_time).toLocaleDateString()}
                        </td>
                        <td data-label="Name" className="px-4 py-2">
                          {detail.name}
                        </td>
                        <td data-label="Total Budget" className="px-4 py-2">
                          {detail?.adsets?.data?.[0]?.campaign?.daily_budget
                            ? parseInt(detail.adsets.data[0].campaign.daily_budget, 10) / 100
                            : detail?.adsets?.data?.[0]?.campaign?.lifetime_budget
                            ? parseInt(detail.adsets.data[0].campaign.lifetime_budget, 10) / 100
                            : Array.isArray(detail?.adsets?.data) &&
                              detail?.adsets?.data.length > 0
                            ? detail?.adsets?.data.reduce((total, adset) => {
                                const budget =
                                  parseInt(adset?.daily_budget, 10) ||
                                  parseInt(adset?.lifetime_budget, 10) ||
                                  0;
                                return total + budget;
                              }, 0) / 100
                            : "Data not available"}
                        </td>
                        <td data-label="Actions" className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleEdit(detail)}
                            className="edit-button mx-2 text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            handlePreviousPage={handlePreviousPage}
            isPrevButtonDisabled={isPrevButtonDisabled}
            currentPage={currentPage}
            campaignDetails={campaignDetails}
            rowsPerPage={rowsPerPage}
            handleNextPage={handleNextPage}
            isNextButtonDisabled={isNextButtonDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Budget;
