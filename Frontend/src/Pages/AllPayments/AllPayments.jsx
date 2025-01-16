// import React, { useEffect, useState } from "react";
// import { IoFilterSharp } from "react-icons/io5";
// import FilterModal from "../../Components/CustomModal/FilterModal";
// import { GET_PAYMENT_DETAILS_INTEGRATION } from "../../Services/ApiService";
// import "./AllPayments.css";
// import Pagination from "../../Components/Pagination/Pagination";
// import SelectInputs from "../../Components/SelectInput/SelectInputs";
// import axios from "axios";
// import AxiosInstance, { refreshToken } from "../../Services/Axios";
// import { MONGO_URI } from "../../Variables/Variables";
// import { ApiTokenContext } from "../../context/Apicontext";
// import { useContext } from "react";
// import { IoMdAdd } from "react-icons/io";

// const AllPayments = () => {
//   const { allPayment, setAllPayment } = useContext(ApiTokenContext);

//   const [mydata, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isFilterModalOpen, setFilterModalOpen] = useState(false);
//   const [paginatedDetails, setPaginatedDetails] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [campaignDetails, setCampaignDetails] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1); // Pagination

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     datePreset: "",
//     format: "",
//   });

//   useEffect(() => {
//     fetchData(); // Fetch data when the component mounts
//   }, []);
//   const fetchData = async () => {
//     const perPage = rowsPerPage; // Records per page set by the user
//     let page = 1; // Start with the first page
//     let allData = []; // Array to store all fetched records
//     const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))"; // Example criteria
//     const encodedCriteria = encodeURIComponent(criteria); // Ensure criteria is encoded

//     setLoading(true); // Start loading

//     try {
//       let totalCount = 0; // Track the total number of records fetched across all pages

//       // Loop until there's no more data to fetch (i.e., we reach the last page)
//       while (true) {
//         // Construct the API URL with the page number
//         const zohoApiUrl = `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;

//         // let accessToken = await localStorage.getItem("accessToken");
//         // if (!accessToken) {
//         // let accessToken = await refreshToken(); // Assume refreshToken() gets and stores a new token
//         // setAllPayment(accessToken);
//         // }
//         const accessToken = await refreshToken(); // Get a fresh token from the refreshToken function
//         setAllPayment(accessToken); // Store the new token in the context

//         console.log("accessToken", accessToken);
//         console.log("allPayment", allPayment);

//         // Make a GET request to your custom proxy endpoint
//         const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
//           params: { url: zohoApiUrl },
//           headers: {
//             Authorization: `Zoho-oauthtoken ${accessToken}`, // Add token in headers
//           },
//         });
//         console.log("allPayment", allPayment);

//         const data = response.data?.data || []; // Get the data array from the response

//         if (data.length > 0) {
//           // Filter out duplicates by checking if the record already exists in allData
//           allData = [
//             ...allData,
//             ...data.filter(
//               (item) =>
//                 !allData.some((existingItem) => existingItem.id === item.id) // Replace 'id' with the unique identifier
//             ),
//           ];

//           setData(allData); // Update the state to display the data

//           totalCount += data.length; // Update the totalCount with the newly fetched data

//           // Update the total pages dynamically based on the total number of records
//           setTotalPages(Math.ceil(totalCount / perPage)); // Calculate total pages dynamically
//         }

//         // Check if there are more records to fetch (based on the response info)
//         const moreRecords = response.data?.info?.more_records;
//         if (!moreRecords) {
//           break; // Stop fetching more data
//         }

//         page++; // Move to the next page
//       }
//     } catch (error) {
//       console.error("Failed to fetch payment details:", error);
//       setData([]); // Set empty array in case of error
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   // Pagination Logic
//   const startIndex = currentPage * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;

//   const updatePaginatedDetails = () => {
//     const startIndex = currentPage * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const currentPageDetails = mydata.slice(startIndex, endIndex);
//     setPaginatedDetails(currentPageDetails);
//   };

//   useEffect(() => {
//     if (currentPage >= totalPages) {
//       setCurrentPage(totalPages - 1); // Reset to the last page
//     }

//     if (mydata.length > 0 && currentPage < totalPages) {
//       updatePaginatedDetails();
//     } else {
//       setCurrentPage(0); // Reset to the first page if no data
//       updatePaginatedDetails();
//     }
//   }, [currentPage, rowsPerPage, mydata, totalPages]);

//   // Handle navigation to the next page
//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   // Handle navigation to the previous page
//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   // Determine if pagination buttons should be disabled
//   const isNextButtonDisabled = currentPage >= totalPages - 1;
//   const isPrevButtonDisabled = currentPage <= 0;

//   // Handle rows per page change
//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };
//   // filter
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
//           (detail) => new Date(detail.Payment_Date) >= last7Days
//         );
//         break;

//       case "last-14-days":
//         const last14Days = new Date();
//         last14Days.setDate(currentDate.getDate() - 14);
//         filteredData = details.filter(
//           (detail) => new Date(detail.Payment_Date) >= last14Days
//         );
//         break;

//       case "last-30-days":
//         const last30Days = new Date();
//         last30Days.setDate(currentDate.getDate() - 30);
//         filteredData = details.filter(
//           (detail) => new Date(detail.Payment_Date) >= last30Days
//         );
//         break;

//       case "yesterday":
//         const yesterday = new Date();
//         yesterday.setDate(currentDate.getDate() - 1);
//         filteredData = details.filter(
//           (detail) =>
//             new Date(detail.Payment_Date).toDateString() ===
//             yesterday.toDateString()
//         );
//         break;

//       case "last-day":
//         const lastDay = new Date();
//         lastDay.setDate(currentDate.getDate() - 1);
//         filteredData = details.filter(
//           (detail) =>
//             new Date(detail.Payment_Date).toDateString() ===
//             lastDay.toDateString()
//         );
//         break;

//       case "all-time":
//       default:
//         filteredData = details; // No filtering for all-time
//         break;
//     }

//     return filteredData;
//   };

// const filteredData = filterByDate(mydata, datePreset) // Apply the date filter
//   .filter((item) => {
//     const searchLower = search.toLowerCase();

//     return (
//       item.Owner.name.toLowerCase().includes(searchLower) ||
//       item.Owner.email.toLowerCase().includes(searchLower) ||
//       item.Lead_Name?.name.toLowerCase().includes(searchLower) ||
//       item.id.toLowerCase().includes(searchLower)
//     );
//   })
//   .slice(startIndex, endIndex); // Apply pagination

import React, { useEffect, useState, useContext } from "react";
import { IoFilterSharp } from "react-icons/io5";
import FilterModal from "../../Components/CustomModal/FilterModal";
import { GET_PAYMENT_DETAILS_INTEGRATION } from "../../Services/ApiService";
import "./AllPayments.css";
import Pagination from "../../Components/Pagination/Pagination";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import axios from "axios";
import AxiosInstance, { refreshToken } from "../../Services/Axios";
import { MONGO_URI } from "../../Variables/Variables";
import { ApiTokenContext } from "../../context/Apicontext";
import { IoMdAdd } from "react-icons/io";
import { IoMdRefresh } from "react-icons/io";

const AllPayments = () => {
  const { allPayment, setAllPayment } = useContext(ApiTokenContext);

  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [paginatedDetails, setPaginatedDetails] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Pagination

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    datePreset: "",
    format: "",
  });

  useEffect(() => {
    // Try to fetch data from localStorage
    const cachedData = localStorage.getItem("paymentDetails");

    if (cachedData) {
      // If cached data exists, use it
      setData(JSON.parse(cachedData));
      setLoading(false); // Stop loading
    } else {
      // If no cached data, make the API call
      fetchData();
    }
  }, []);

  // const fetchData = async () => {
  //   const perPage = rowsPerPage;
  //   let page = 1;
  //   let allData = [];
  //   const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))";
  //   const encodedCriteria = encodeURIComponent(criteria);

  //   setLoading(true);

  //   try {
  //     let totalCount = 0;

  //     while (true) {
  //       const zohoApiUrl = ``;
  //       // https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}
  //       const accessToken = await refreshToken();

  //       // Make the API call
  //       const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
  //         params: { url: zohoApiUrl },
  //         headers: {
  //           Authorization: `Zoho-oauthtoken ${accessToken}`,
  //         },
  //       });

  //       const data = response.data?.data || [];

  //       if (data.length > 0) {
  //         allData = [
  //           ...allData,
  //           ...data.filter(
  //             (item) =>
  //               !allData.some((existingItem) => existingItem.id === item.id)
  //           ),
  //         ];

  //         setData(allData);
  //         totalCount += data.length;
  //         setTotalPages(Math.ceil(totalCount / perPage));
  //       }

  //       const moreRecords = response.data?.info?.more_records;
  //       if (!moreRecords) {
  //         break;
  //       }

  //       page++;
  //     }

  //     // Cache the fetched data
  //     localStorage.setItem("paymentDetails", JSON.stringify(allData));
  //   } catch (error) {
  //     console.error("Failed to fetch payment details:", error);
  //     setData([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchData = async () => {
  //   const perPage = 200; // Fetch 200 records per page
  //   const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))";
  //   const encodedCriteria = encodeURIComponent(criteria);

  //   const accessToken = await refreshToken();
  //   let allData = [];

  //   setLoading(true);

  //   try {
  //     // Fetch data from the API
  //     for (let page = 1; page <= 3; page++) {
  //       const baseUrl = `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;

  //       const zohoApiUrl = `${baseUrl}`; // No need to worry about pagination here, it's handled by the backend
  //       const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
  //         params: { url: zohoApiUrl },
  //         headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  //       });
  //       console.log("zoho response", response.data);

  //       const data = response.data || [];
  //       if (data.length > 0) {
  //         allData.push(...data);
  //       }

  //       // Fetch data from cache (if available)
  //   const cachedData =
  //     JSON.parse(localStorage.getItem("paymentDetails")) || [];

  //   // Combine cachedData and new data, ensuring no duplicates
  //   const combinedData = [
  //     ...cachedData,
  //     ...data.filter(
  //       (item) =>
  //         !cachedData.some((cachedItem) => cachedItem.id === item.id)
  //     ), // Assuming 'id' is the unique identifier
  //   ];
  //   // Update allData with combined data
  //   allData = combinedData;
  // }

  //     // Update state with all data
  //     setData(allData);

  //     // Store updated data in localStorage
  //     localStorage.setItem("paymentDetails", JSON.stringify(allData));
  //   } catch (error) {
  //     console.error("Failed to fetch payment details:", error);
  //     setData([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    const perPage = 200; // Fetch 200 records per page
    const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))";
    const encodedCriteria = encodeURIComponent(criteria);

    const accessToken = await refreshToken();
    let allData = [];

    setLoading(true);

    try {
      // Fetch data for each page
      for (let page = 1; page <= 3; page++) {
        const baseUrl = `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;
        const zohoApiUrl = `${baseUrl}`;

        console.log(`Fetching data for page ${page}...`);

        // Fetch data from the API
        const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
          params: { url: zohoApiUrl },
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        });

        console.log(`Response for page ${page}:`, response.data);

        // Ensure response data exists
        const data = response.data || [];

        if (data.length > 0) {
          allData.push(...data); // Add new data to allData
        }
      }

      // Fetch cached data from localStorage
      const cachedData =
        JSON.parse(localStorage.getItem("paymentDetails")) || [];

      console.log("Cached data from localStorage:", cachedData);

      // Combine cached data with fetched data, ensuring no duplicates
      const combinedData = [
        ...cachedData,
        ...allData.filter(
          (item) => !cachedData.some((cachedItem) => cachedItem.id === item.id)
        ),
      ];

      console.log("Combined data before saving:", combinedData);
      console.log("Combined allData:", allData);

      // Update the state with combined data
      setData(combinedData);

      // Store the combined data in localStorage
      localStorage.setItem("paymentDetails", JSON.stringify(combinedData));

      console.log("Data stored in localStorage:", combinedData);
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  //   const perPage = 200; // Fetch 200 records per page
  //   const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))";
  //   const encodedCriteria = encodeURIComponent(criteria);

  //   const accessToken = await refreshToken();  // Make sure the token is valid
  //   let allData = [];  // Initialize an array to store all the data

  //   setLoading(true);  // Set loading state to true

  //   try {
  //     // Fetch data for 3 pages
  //     for (let page = 1; page <= 3; page++) {
  //       const baseUrl = `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;
  //       const zohoApiUrl = `${baseUrl}`;

  //       console.log(`Fetching data for page ${page}...`);  // Debug log to check page number

  //       // Send the request to the proxy server to get data from Zoho
  //       const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
  //         params: { url: zohoApiUrl },
  //         headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  //       });

  //       console.log(`Response for page ${page}:`, response.data);  // Log the response

  //       // Ensure that the response contains data in the expected format
  //       const data = response.data?.data || [];  // Make sure you're accessing the correct property

  //       // Log data for debugging
  //       console.log(`Data fetched for page ${page}:`, data);

  //       // If data is available, push it to the allData array
  //       if (data.length > 0) {
  //         allData.push(...data);
  //       } else {
  //         console.warn(`No data found for page ${page}`);  // If no data found for the page
  //       }
  //     }

  //     // Fetch data from localStorage (if available)
  //     const cachedData = JSON.parse(localStorage.getItem("paymentDetails")) || [];
  //     console.log("Cached data from localStorage:", cachedData);  // Log cached data

  //     // Combine cachedData and new data, ensuring no duplicates
  //     const combinedData = [
  //       ...cachedData,
  //       ...allData.filter(
  //         (item) => !cachedData.some((cachedItem) => cachedItem.id === item.id)
  //       ),
  //     ];

  //     // Log combined data before saving to localStorage
  //     console.log("Combined data before saving:", combinedData);

  //     // Update the state with the combined data
  //     setData(combinedData);

  //     // Store the updated combined data in localStorage
  //     localStorage.setItem("paymentDetails", JSON.stringify(combinedData));

  //     // Verify if the data was successfully stored in localStorage
  //     const storedData = localStorage.getItem("paymentDetails");
  //     console.log("Stored data in localStorage:", storedData);

  //   } catch (error) {
  //     console.error("Failed to fetch payment details:", error);
  //     setData([]);  // Clear data in case of error
  //   } finally {
  //     setLoading(false);  // Set loading state to false after the operation
  //   }
  // };

  // setTotalPages(Math.ceil(200 / 10));
  const totalPages = Math.ceil(mydata.length / rowsPerPage);
  console.log("totalPages", totalPages);
  console.log("rowsPerPage", rowsPerPage);

  // Pagination Logic
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const updatePaginatedDetails = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageDetails = mydata.slice(startIndex, endIndex);
    setPaginatedDetails(currentPageDetails);
  };

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1); // Reset to the last page
    }

    if (mydata.length > 0 && currentPage < totalPages) {
      updatePaginatedDetails();
    } else {
      setCurrentPage(0); // Reset to the first page if no data
      updatePaginatedDetails();
    }
  }, [currentPage, rowsPerPage, mydata, totalPages]);

  // Handle navigation to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle navigation to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Determine if pagination buttons should be disabled
  const isNextButtonDisabled = currentPage >= totalPages - 1;
  const isPrevButtonDisabled = currentPage <= 0;

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to the first page when rows per page changes
  };

  // Filter Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const { datePreset, format } = filters;

  const filterByDate = (details, preset) => {
    const currentDate = new Date();
    let filteredData = [];

    switch (preset) {
      case "last-7-days":
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        filteredData = details.filter(
          (detail) => new Date(detail.Payment_Date) >= last7Days
        );
        break;

      case "last-14-days":
        const last14Days = new Date();
        last14Days.setDate(currentDate.getDate() - 14);
        filteredData = details.filter(
          (detail) => new Date(detail.Payment_Date) >= last14Days
        );
        break;

      case "last-30-days":
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        filteredData = details.filter(
          (detail) => new Date(detail.Payment_Date) >= last30Days
        );
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        filteredData = details.filter(
          (detail) =>
            new Date(detail.Payment_Date).toDateString() ===
            yesterday.toDateString()
        );
        break;

      case "last-day":
        const lastDay = new Date();
        lastDay.setDate(currentDate.getDate() - 1);
        filteredData = details.filter(
          (detail) =>
            new Date(detail.Payment_Date).toDateString() ===
            lastDay.toDateString()
        );
        break;

      case "all-time":
      default:
        filteredData = details; // No filtering for all-time
        break;
    }

    return filteredData;
  };

  const filteredData = filterByDate(mydata, datePreset) // Apply the date filter
    .filter((item) => {
      const searchLower = search.toLowerCase();

      return (
        item.Owner.name.toLowerCase().includes(searchLower) ||
        item.Owner.email.toLowerCase().includes(searchLower) ||
        item.Lead_Name?.name.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      );
    })
    .slice(startIndex, endIndex); // Apply pagination

  const clearCache = async (key) => {
    try {
      // Call the API to clear the server-side cache
      const response = await axios.get(`${MONGO_URI}/clear-cache`);

      // Clear the localStorage data for 'paymentDetails'
      localStorage.removeItem("paymentDetails");

      // Notify the user about the result
      alert(response.data);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cache:", error);
      alert("Failed to clear cache.");
    }
  };

  return (
    <div className="flex">
      <div
        className={`flex flex-col min-w-1 min-h-screen bg-gray-100 transition-all duration-300 `}
      >
        {/* <Navbar /> */}
        <FilterModal
          isOpen={isModalOpen}
          onClose={closeModal}
          Base={false}
          onApplyFilters={handleApplyFilters}
        />

        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center md:text-left w-3/4">
            All Payments
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

          {/*  */}
          <button
            className="filter-btn flex items-center justify-center bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition duration-200 w-full md:w-auto"
            onClick={clearCache}
          >
            <IoMdRefresh className="mr-2" />Refresh
          </button>
          {/*  */}
        </div>

        <div
          className={` w-[90%] bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "ml-16 lg:ml-16" : "ml-20"
          }`}
        >
          <SelectInputs
            name="allpayments"
            rowsPerPage={rowsPerPage}
            setSearch={setSearch}
            search={search}
            handleRowsPerPageChange={handleRowsPerPageChange}
            setCurrentPage={setCurrentPage}
          />
          <div className="overflow-x-auto">
            <table className="min-w-max table-auto">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th>#</th>
                  <th className="px-4 py-2">Payment Number</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Account Manager</th>
                  <th className="px-4 py-2">Agent</th>
                  <th className="px-4 py-2">Client</th>

                  <th className="px-4 py-2">Contact No</th>

                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Payment Mode</th>
                  <th className="px-4 py-2">Disposable Income</th>
                  <th className="px-4 py-2">GST</th>
                  <th className="px-4 py-2">NET</th>
                  <th className="px-4 py-2">Creditor Amount</th>
                  <th className="px-4 py-2">New Creditor Amount</th>
                  <th className="px-4 py-2">Management Fees</th>
                  <th className="px-4 py-2">Lead Status</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(mydata) && mydata.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td data-label="#">
                        {index + 1 + currentPage * rowsPerPage}
                      </td>
                      <td className="px-4 py-2 ">{row.Payment_Number}</td>
                      <td className="px-4 py-2">{row.Payment_Date}</td>
                      <td className="px-4 py-2">{row.fbAccountName}</td>
                      <td className="px-4 py-2">{row?.Owner?.name}</td>
                      <td className="px-4 py-2">{row.agent}</td>

                      <td className="px-4 py-2">{row.Lead_Name?.name}</td>
                      <td className="px-4 py-2">{row.contactNo}</td>

                      <td className="px-4 py-2">{row.city}</td>
                      <td className="px-4 py-2">{row.email}</td>
                      <td className="px-4 py-2">{row.Payment_Mode}</td>
                      <td className="px-4 py-2">{row.DI}</td>
                      <td className="px-4 py-2">{row.Tax}</td>
                      <td className="px-4 py-2">{row.Sub_Total}</td>
                      <td className="px-4 py-2">{row.Creditors_Amount}</td>
                      <td className="px-4 py-2">{row.New_Creditor_Amount}</td>
                      <td className="px-4 py-2">
                        {row.Managemnet_Fee_Exclusive_of_taxes}
                      </td>
                      <td className="px-4 py-2">{row.Lead_Status}</td>
                      <td className="px-4 py-2">{row.Status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="18" className="text-center py-2">
                      No payment data available
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

export default AllPayments;
