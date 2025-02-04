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

const Source = () => {
  // const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [data, setData] = useState([]);

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
        account_id: selectedAccount?.id || null, // Add accountId from selectedAccount context
      }));

      const saveResponse = await axios.post(
        `${MONGO_URI}/api/save-campaigns`,
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

  const filteredData =
    Array.isArray(data) && data.length > 0
      ? data.filter(
          (row) =>
            (row.campaignName &&
              row.campaignName.toLowerCase().includes(search.toLowerCase())) ||
            (row.sourceMain &&
              row.sourceMain.toLowerCase().includes(search.toLowerCase()))
        )
      : Array.isArray(data)
      ? data.filter(
          (row) =>
            (row.campaignName &&
              row.campaignName.toLowerCase().includes(search.toLowerCase())) ||
            (row.sourceMain &&
              row.sourceMain.toLowerCase().includes(search.toLowerCase()))
        )
      : [];

  // Calculate total pages based on data length and rows per page
  const totalCount = campaignDetails.length;

  // Update paginated details when currentPage, rowsPerPage, or campaignDetails change
  const updatePaginatedDetails = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageDetails = campaignDetails.slice(startIndex, endIndex);
    setPaginatedDetails(currentPageDetails);
  };

  useEffect(() => {
    // Handle invalid currentPage or empty data
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1); // Reset to the last page
    }

    if (campaignDetails.length > 0 && currentPage < totalPages) {
      updatePaginatedDetails();
    } else {
      setCurrentPage(0); // Reset to the first page if no data
      updatePaginatedDetails();
    }
  }, [currentPage, rowsPerPage, campaignDetails, totalPages]);

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

  useEffect(() => {
    // Fetch campaigns from MongoDB
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          `${MONGO_URI}/api/save-campaigns/${selectedAccount.id}`
        );

        const fetchedCampaigns = Array.isArray(response.data)
          ? response.data
          : [response.data]; // Ensure data is an array

        // Update state with fetched campaigns
        setMongoData(fetchedCampaigns);
        setCampaignDetails(fetchedCampaigns);

        // Reset pagination based on the new data
        setCurrentPage(0); // Start at the first page
        const updatedTotalCount = fetchedCampaigns.length;
        setTotalPages(Math.ceil(updatedTotalCount / rowsPerPage));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [selectedAccount, MONGO_URI, rowsPerPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  //

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          `${MONGO_URI}/api/save-campaigns/${selectedAccount.id}`
        );

        setCampaigns(response.data || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      }
    };

    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${MONGO_URI}/api/leads`, {
          params: {
            page: currentPage + 1,
            pageSize: rowsPerPage,
          },
        });

        setLeads(response.data.leads || []); // Ensure correct extraction
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
      }
    };

    fetchCampaigns();
    fetchLeads();
  }, [selectedAccount, currentPage]);

  //

  useEffect(() => {
    if (campaigns.length > 0 && leads.length > 0) {
      // Create a map for quick campaign lookup
      const campaignMap = new Map(
        campaigns.map((campaign) => [
          campaign.name.trim().toLowerCase(),
          campaign.name,
        ])
      );

      // Filter out leads that do not match any campaign
      const mappedData = leads
        .map((lead) => {
          const leadSource = lead.source.trim().toLowerCase();
          const matchingCampaignName = campaignMap.get(leadSource);

          if (!matchingCampaignName) return null; // Skip unmatched leads

          return {
            campaignName: matchingCampaignName,
            sourceMain: lead.source,
          };
        })
        .filter(Boolean); // Remove null entries

      // Add campaigns that don't match any lead sources
      campaigns.forEach((campaign) => {
        const campaignName = campaign.name.trim().toLowerCase();
        if (
          !mappedData.some(
            (data) => data.campaignName.toLowerCase() === campaignName
          )
        ) {
          mappedData.push({
            campaignName: campaign.name,
            sourceMain: "Organic",
          });
        }
      });

      // Set the mapped data
      setData(mappedData);
    }
  }, [campaigns, leads]);

  return (
    <div className="home">
      <ChooseFileModal
        Name={"Source"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileChange={handleFileChange}
        onFileSave={handleFileSave}
        errorMessage={error}
        apiEndpoint={`${MONGO_URI}/api/save-Source`}
      />

      <AddModal
        Name={"Source"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selected={selectedRow}
        apiEndpoint={`${MONGO_URI}/api/save-Source`}
      />

      {/*  */}

      <EditModal
        Name="Source"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selected={selectedRow} // Pass only the selected user data here
        id={selectedRow?.id} // Pass the user ID dynamically
        endpoint={`${MONGO_URI}/api/save-Source/${selectedRow?._id}`} // Use dynamic endpoint with user ID
      />

      {/*  */}

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Source
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import Source</span>
            </button>
            <button
              className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
              onClick={handleAddNewCampaign}
            >
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Source</span>
            </button>
          </div>
        </div>

        <div
          className={` md:w-[90%]   bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
            name="Source"
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
                  <th>Source Main</th>
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
                        <td>{row.campaignName}</td>
                        <td>{row.sourceMain}</td>
                        <td data-label="Account">
                          {selectedAccount?.name || "N/A"}
                        </td>
                        <td data-label="Actions">
                          <button
                            className="text-blue-500 mr-2"
                            // onClick={() => handleEdit(row)}
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

export default Source;
