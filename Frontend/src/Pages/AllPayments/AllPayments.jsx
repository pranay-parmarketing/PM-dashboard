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

 
  const fetchData = async () => {
    const perPage = 200; // Fetch 200 records per page
    const criteria = "((Payment_Number:equals:1)and(Status:equals:paid))";
    const encodedCriteria = encodeURIComponent(criteria);

    // const accessToken = '';
    const accessToken = await refreshToken();
    let allData = [];

    setLoading(true);

    try {
      // Fetch data for each page
      for (let page = 1; page <= 3; page++) {
        const baseUrl = `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;
        const zohoApiUrl = `${baseUrl}`;

     
        // Fetch data from the API
        const response = await axios.get(`${MONGO_URI}/custom-proxy`, {
          params: { url: zohoApiUrl },
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        });

       
        // Ensure response data exists
        const data = response.data || [];

        if (data.length > 0) {
          allData.push(...data); // Add new data to allData
        }
      }

      // Fetch cached data from localStorage
      const cachedData =
        JSON.parse(localStorage.getItem("paymentDetails")) || [];

     
      const combinedData = [
        ...cachedData,
        ...allData.filter(
          (item) => !cachedData.some((cachedItem) => cachedItem.id === item.id)
        ),
      ];

 
      setData(combinedData);

      // Store the combined data in localStorage
      localStorage.setItem("paymentDetails", JSON.stringify(combinedData));

   
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(mydata.length / rowsPerPage);
 

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
