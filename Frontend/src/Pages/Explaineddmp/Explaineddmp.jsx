import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { MdFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
import { ApiTokenContext } from "../../context/Apicontext";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";
import FilterModal from "../../Components/CustomModal/FilterModal";
import Export from "../../Components/CustomModal/Export";

const Explaineddmp = () => {
  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  //
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [paginatedDetails, setPaginatedDetails] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState([]);
  //
  const [mongoData, setMongoData] = useState({});
  const [loading, setLoading] = useState(false);
  //
  const [totalPages, setTotalPages] = useState(0);
  //
  const [selectedUser, setSelectedUser] = useState(null);

  //

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);

  const appSecretProof = appsecret_proof;
  const accessToken = access_token;

  // Function to save campaign data to MongoDB
  const saveCampaignData = async (campaignData) => {
    try {
      const campaignsWithAccountId = campaignData.map((campaign) => ({
        ...campaign,
        account_id: selectedAccount?.id || null,
      }));

      const saveResponse = await axios.post(
        `${MONGO_URI}/api/dmp`,
        campaignsWithAccountId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (saveError) {
      console.error(
        "Error saving campaign data:",
        saveError.response ? saveError.response.data : saveError.message
      );
    }
  };

  // Function to fetch all campaign data from the API
  const fetchAllCampaignData = async (url) => {
    setLoading(false);
    let allData = [];
    let currentPageUrl = url;

    try {
      while (currentPageUrl) {
        const { data } = await axios.get(
          ``
          // `${currentPageUrl}&access_token=${accessToken}&appsecret_proof=${appSecretProof}`
        );
        setLoading(false);
        if (data.data) {
          // Directly save all fetched campaign data to MongoDB
          await saveCampaignData(data.data);

          allData = [...allData, ...data.data];
        }

        currentPageUrl = data.paging?.next || null;
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

  const loadCampaignData = async () => {
    let accountId = null;

    if (typeof selectedAccount === "string") {
      accountId = selectedAccount;
    } else if (typeof selectedAccount === "object") {
      accountId = selectedAccount.id || selectedAccount.accountId;
    }

    if (accountId) {
      const initialUrl = ``;
      // const initialUrl = `https://graph.facebook.com/v17.0/act_${accountId}/campaigns?fields=id,name,status,objective,start_time`;
      const allCampaignData = await fetchAllCampaignData(initialUrl);

      setData(allCampaignData);
      setCampaignDetails(allCampaignData);
    } else {
      console.error("Invalid selectedAccount:", selectedAccount);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      loadCampaignData();
    }
  }, [selectedAccount]);

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

  const filterData = (data, searchQuery) => {
    if (!searchQuery) return data;

    const searchTerm = searchQuery.toLowerCase();

    return data.filter((row) => {
      return (
        (row.phone && row.phone.toLowerCase().includes(searchTerm)) ||
        (row.source && row.source.toLowerCase().includes(searchTerm)) ||
        (row.cust_name && row.cust_name.toLowerCase().includes(searchTerm)) ||
        (row.agent_username && row.agent_username.toLowerCase().includes(searchTerm)) 
      );
    });
  };

  const totalCount = campaignDetails.length;

  const updatePaginatedDetails = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageDetails = campaignDetails.slice(startIndex, endIndex);
    setPaginatedDetails(currentPageDetails);
  };

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }

    if (campaignDetails.length > 0 && currentPage < totalPages) {
      updatePaginatedDetails();
    } else {
      setCurrentPage(0);
      updatePaginatedDetails();
    }
  }, [currentPage, rowsPerPage, campaignDetails, totalPages]);

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

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${MONGO_URI}/api/dmp`, {
          params: {
            page: currentPage + 1,
            pageSize: rowsPerPage,
            search: search,
            sortOrder: "asc",
            startDate: startDate,
            endDate: endDate,
          },
        });

        if (response.data.dmps) {
          setMongoData(response.data);
          setCampaignDetails(response.data.dmps);
          setCurrentPage(response.data.currentPage - 1);
          setTotalPages(response.data.totalPages);
        } else {
          console.error("No dmp found in the response");
        }
      } catch (error) {
        console.error("Error fetching dmp data:", error);
      }
    };

    fetchCampaigns();
  }, [currentPage, rowsPerPage, startDate, endDate]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  //

  const [filters, setFilters] = useState({
    datePreset: "",
    format: "",
  });

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const openExportModal = () => setIsExportModalOpen(true); // Open modal
  const closeExportModal = () => setIsExportModalOpen(false); // Close modal

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const { datePreset, format } = filters;

  const filterByDate = (details, preset) => {
    const currentDate = new Date();
    let filteredData = [];

    if (!Array.isArray(details) || details.length === 0) {
      console.warn("No details available to filter");
      return [];
    }

    switch (preset) {
      case "last-7-days": {
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        filteredData = details.filter((detail) => {
          const createdDate = detail.createdOn
            ? new Date(detail.createdOn)
            : null;
          if (createdDate) createdDate.setHours(0, 0, 0, 0);
          return createdDate && createdDate >= last7Days;
        });
        break;
      }

      case "last-14-days": {
        const last14Days = new Date();
        last14Days.setDate(currentDate.getDate() - 14);
        last14Days.setHours(0, 0, 0, 0);

        filteredData = details.filter((detail) => {
          const createdDate = detail.createdOn
            ? new Date(detail.createdOn)
            : null;
          if (createdDate) createdDate.setHours(0, 0, 0, 0);
          return createdDate && createdDate >= last14Days;
        });
        break;
      }

      //

      case "last-30-days": {
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);

        filteredData = details.filter((detail) => {
          const createdDate = detail.createdOn
            ? new Date(detail.createdOn)
            : null;
          if (createdDate) createdDate.setHours(0, 0, 0, 0);
          return createdDate && createdDate >= last30Days;
        });
        break;
      }

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        filteredData = details.filter((detail) => {
          const createdDate = detail.createdOn
            ? new Date(detail.createdOn)
            : null;
          if (createdDate) createdDate.setHours(0, 0, 0, 0);
          return createdDate && createdDate >= yesterday;
        });
        break;
      }

      case "last-day": {
        const lastDay = new Date();
        lastDay.setDate(currentDate.getDate() - 1);
        lastDay.setHours(0, 0, 0, 0);

        filteredData = details.filter((detail) => {
          const createdDate = detail.createdOn
            ? new Date(detail.createdOn)
            : null;
          if (createdDate) createdDate.setHours(0, 0, 0, 0);
          return createdDate && createdDate >= lastDay;
        });
        break;
      }

      //

      case "custom-range": {
        if (startDate && endDate) {
          const customStartDate = new Date(startDate);
          const customEndDate = new Date(endDate);
          customStartDate.setHours(0, 0, 0, 0);
          customEndDate.setHours(23, 59, 59, 999);

          filteredData = details.filter((detail) => {
            const createdDate = detail.createdOn
              ? new Date(detail.createdOn)
              : null;
            return (
              createdDate &&
              createdDate >= customStartDate &&
              createdDate <= customEndDate
            );
          });
        }
        break;
      }

      default:
        filteredData = details;
        break;
    }

    return filteredData;
  };

  const getFilteredData = () => {
    let dataToFilter = [];

    if (Array.isArray(mongoData?.dmps) && mongoData?.dmps.length > 0) {
      dataToFilter = mongoData.dmps;
    } else if (Array.isArray(mydata) && mydata.length > 0) {
      dataToFilter = mydata;
    }

    const searchFilteredData = filterData(dataToFilter, search);

    const finalFilteredData = filterByDate(
      searchFilteredData,
      datePreset,
      startDate,
      endDate
    );

    return finalFilteredData;
  };

  const filteredData = getFilteredData();

  const filteredCampaignDetails = filterByDate(
    campaignDetails,
    filters.datePreset
  );

  return (
    <div className="home">
      <ChooseFileModal
        Name={"Dmp"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFileChange={handleFileChange}
        onFileSave={handleFileSave}
        errorMessage={error}
        apiEndpoint={`${MONGO_URI}/api/dmp`}
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
      {/*  */}
      <Export
        isOpen={isExportModalOpen}
        onClose={closeExportModal} // Close handler
        data={filteredData}
        filename={`campaign_data_${new Date().toISOString()}.csv`}
        filters={filters}
      />
      {/*  */}

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            DMP
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsAddModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import DMP</span>
            </button>

            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsExportModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Export DMP</span>
            </button>

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
          className={` md:w-[90%]   bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
            name="dmp"
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
            <table className="min-w-max table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Agent ID</th>
                  <th>Agent Username</th>
                  <th>Agent Name</th>
                  <th>Campaign ID</th>
                  <th>Campaign Name</th>
                  <th>Process Name</th>
                  <th>Process ID</th>
                  <th>First Disposition</th>
                  <th>Second Disposition</th>
                  <th>Call Start Time</th>
                  <th>Call End Time</th>
                  <th>Record URL</th>
                  <th>Call Type</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="18" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : Array.isArray(filteredData) && filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={row._id}>
                      <td>{index + 1 + currentPage * rowsPerPage}</td>
                      <td>{row.cust_name || "N/A"}</td>
                      <td>{row.phone || "N/A"}</td>
                      <td>{row.email || "N/A"}</td>
                      <td>{row.agent_id || "N/A"}</td>
                      <td>{row.agent_username || "N/A"}</td>
                      <td>{row.agent_name || "N/A"}</td>
                      <td>{row.campaign_id || "N/A"}</td>
                      <td>{row.campaign_name || "N/A"}</td>
                      <td>{row.process_name || "N/A"}</td>
                      <td>{row.process_id || "N/A"}</td>
                      <td>{row.first_disposition || "N/A"}</td>
                      <td>{row.second_disposition || "N/A"}</td>
                      <td>
                        {row.call_start_time
                          ? new Date(row.call_start_time).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {row.call_end_time
                          ? new Date(row.call_end_time).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {row.record_url ? (
                          <a
                            href={row.record_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Recording
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{row.call_type || "N/A"}</td>
                      <td>{row.source || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="18" className="text-center py-4">
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

export default Explaineddmp;
