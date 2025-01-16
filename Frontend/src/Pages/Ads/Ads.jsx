import React, { useContext, useEffect, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
import AddModal from "../../Components/CustomModal/AddModal";

import { ApiTokenContext } from "../../context/Apicontext";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import EditModal from "../../Components/CustomModal/EditModal";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";

const Ads = () => {
  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  //
  const [mongoData, setMongoData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedDetails, setPaginatedDetails] = useState([]);
  //
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);
  const appSecretProof = appsecret_proof;
  const accessToken = access_token;
  const saveCampaignData = async (campaignData) => {
    try {
      const saveResponse = await axios.post(
        `${MONGO_URI}/api/save-ads`,
        campaignData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Campaign data saved successfully:", saveResponse);
    } catch (saveError) {
      console.error(
        "Error saving campaign data:",
        saveError.response ? saveError.response.data : saveError.message
      );
    }
  };

  // Function to fetch all campaign data from Facebook API
  const fetchAllCampaignData = async (url) => {
    setLoading(true);
    let allData = [];
    let currentPageUrl = url;

    try {
      while (currentPageUrl) {
        const { data } = await axios.get(
          `${currentPageUrl}&access_token=${accessToken}&appsecret_proof=${appSecretProof}`
        );
        setLoading(false);
        if (data.data) {
          // Directly save all fetched campaign data to MongoDB
          await saveCampaignData(data.data); // Save all campaigns from this page

          allData = [...allData, ...data.data]; // Add campaigns to the array
        }

        currentPageUrl = data.paging?.next || null; // Get the next page URL, if available
      }

      return allData;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error fetching campaign data:",
        error.response ? error.response.data : error.message
      );
      return [];
    }
  };

  // Function to load campaign data on component mount or when selectedAccount changes
  // const loadCampaignData = async () => {
  //   let accountId = null;

  //   // Determine the correct accountId from selectedAccount
  //   if (typeof selectedAccount === "string") {
  //     accountId = selectedAccount;
  //   } else if (typeof selectedAccount === "object") {
  //     accountId = selectedAccount.id || selectedAccount.accountId;
  //   }

  //   if (accountId) {
  //     const initialUrl = `https://graph.facebook.com/v17.0/act_${accountId}/ads?fields=id,name,status,created_time,updated_time,adset_id,campaign_id,targeting,custom_audiences,flexible_spec,geo_locations,adset{name},account_id`;
  //     const allCampaignData = await fetchAllCampaignData(initialUrl);

  //     setData(allCampaignData); // Store fetched data in state
  //     setCampaignDetails(allCampaignData); // Store campaign details
  //   } else {
  //     console.error("Invalid selectedAccount:", selectedAccount);
  //   }
  // };

  const loadCampaignData = async () => {
    try {
      let accountId = null;

      // Determine accountId
      if (typeof selectedAccount === "string") {
        accountId = selectedAccount;
      } else if (typeof selectedAccount === "object") {
        accountId = selectedAccount.id || selectedAccount.accountId;
      }

      if (accountId) {
        const initialUrl = `https://graph.facebook.com/v17.0/act_${accountId}/ads?fields=id,name,status,created_time,updated_time,adset_id,campaign_id,targeting,custom_audiences,flexible_spec,geo_locations,adset{name},account_id`;

        const allCampaignData = await fetchAllCampaignData(initialUrl);
        console.log("All Campaign Data:", allCampaignData);

        setData(allCampaignData);
        setCampaignDetails(allCampaignData);
      } else {
        console.error("Invalid selectedAccount:", selectedAccount);
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      loadCampaignData(); // Trigger the loading of campaign data when selectedAccount changes
    }
  }, [selectedAccount, accessToken, appSecretProof]); // Trigger the effect when selectedAccount, accessToken, or appSecretProof changes

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };

  const handleAddNewCampaign = () => {
    setSelectedRow(null);
    setIsAddModalOpen(true);
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

  const filteredData = Array.isArray(mongoData[0]?.data) // Check if mongoData[0].data is an array
    ? mongoData[0].data.filter(
        (row) =>
          (row.name && row.name.toLowerCase().includes(search.toLowerCase())) ||
          (row.id && row.id.toLowerCase().includes(search.toLowerCase()))
      )
    : []; // Return an empty array if mongoData[0].data is not an array

  // Calculate total pages dynamically
  const totalPages = Math.ceil(mongoData[0]?.data.length / rowsPerPage);
  console.log('totalPages',totalPages,mongoData.length,rowsPerPage,mongoData.length / rowsPerPage);
  

  // Update paginated details when currentPage, rowsPerPage, or campaignDetails change
  const updatePaginatedDetails = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageDetails = Array.isArray(mongoData)
      ? mongoData.slice(startIndex, endIndex)
      : []; // Return an empty array if mongoData is not an array

    setPaginatedDetails(currentPageDetails);
  };

  useEffect(() => {
    // If currentPage exceeds the available pages, reset to the last valid page  
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }

    // Check if the current page has valid data; if not, set it to the last valid page
    if (currentPage < totalPages && mongoData.length > 0) {
      updatePaginatedDetails();
    } else {
      setCurrentPage(0); // Reset to first page if no data for the current page
      updatePaginatedDetails();
    }
  }, [currentPage, rowsPerPage, mongoData, totalPages]);

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  console.log('currentPage',currentPage,totalPages,currentPage < totalPages - 1);
  

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const isNextButtonDisabled = currentPage >= totalPages - 1;
  const isPrevButtonDisabled = currentPage <= 0;

  //
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          `${MONGO_URI}/api/save-ads/${selectedAccount.id}`
        );

        setMongoData(
          Array.isArray(response.data) ? response.data : [response.data]
        ); // Wrap in array if needed
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [selectedAccount]);
  console.log("this is mongodb data", mongoData);

  //
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };
  return (
    <div className="home">
      <ChooseFileModal
        Name={"Ads"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileChange={handleFileChange}
        onFileSave={handleFileSave}
        errorMessage={error}
        apiEndpoint={`${MONGO_URI}/api/save-ads`}
      />
      <AddModal
        Name={"Ads"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selected={selectedRow}
        apiEndpoint={`${MONGO_URI}/api/save-ads`}
      />
      {/*  */}
      <EditModal
        Name="Ads"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selected={selectedRow} // Pass only the selected user data here
        id={selectedRow?.id} // Pass the user ID dynamically
        endpoint={`${MONGO_URI}/api/save-ads/${selectedRow?._id}`} // Use dynamic endpoint with user ID
        onSuccess={() => {
          loadCampaignData(); // Re-fetch data after update
        }}
      />
      {/*  */}
      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Ads
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import Ads</span>
            </button>
            <button
              className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
              onClick={handleAddNewCampaign}
            >
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Ads</span>
            </button>
          </div>
        </div>

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
          name="ads"
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
                  <th>Name</th>
                  <th>Facebook Ads ID</th>
                  <th>Adset</th>
                  <th>Account</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : Array.isArray(filteredData) && filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      currentPage * rowsPerPage,
                      (currentPage + 1) * rowsPerPage
                    )
                    .map((row, index) => (
                      <tr key={row.id}>
                        <td data-label="#">
                          {index + 1 + currentPage * rowsPerPage}
                        </td>
                        <td data-label="Name">{row.name}</td>
                        <td data-label="Facebook Campaign ID">{row.id}</td>
                        <td data-label="Facebook Status">
                          {row.adset?.name || "N/A"}
                          {console.log("Row data:", row)}
                        </td>
                        <td data-label="Account">{selectedAccount.name}</td>
                        <td data-label="Actions">
                          <button
                            className="text-blue-500 mr-2"
                            onClick={() => handleEdit(row)}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

export default Ads;
