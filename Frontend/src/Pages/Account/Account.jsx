import React, { useState, useEffect } from "react";
import "./accounts.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AddAccountModal from "../../Components/CustomModal/AddAccountModal";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import EditModal from "../../Components/CustomModal/EditModal";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";

const Account = () => {
  const [data, setData] = useState([]); // Default as an empty array
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SelectedAccount, setSelectedAccount] = useState("  ");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [campaignDetails, setCampaignDetails] = useState([]);
  //
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedDetails, setPaginatedDetails] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  // Fetch data directly from API
  const fetchCampaignData = async () => {
    try {
      const response = await axios.get(`${MONGO_URI}/api/account`);
      const apiData = response.data || []; // Directly use response.data if it's an array

      // Update the state with the fetched data
      setData(apiData);
      setCampaignDetails(apiData);
      const updatedTotalCount = apiData.length;
      setTotalPages(Math.ceil(updatedTotalCount / rowsPerPage));
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchCampaignData(); // Fetch data on component mount
  }, []);

  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await axios.delete(`${MONGO_URI}/api/account/${id}`);

      if (response.status === 200) {
        // If deletion is successful, re-fetch the data
        const updatedTotalCount = response.length;
       
        setTotalPages(Math.ceil(updatedTotalCount / rowsPerPage));
        fetchCampaignData(); // Re-fetch data
      } else {
        console.error(
          "Failed to delete item. Server returned:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
      alert("Failed to delete the item. Please try again.");
    }
  };

  const handleEdit = (accountId) => {
    // Find the account data by matching the accountId with _id
    const selectedAccountData = data.find(
      (account) => account._id === accountId
    );

    if (selectedAccountData) {
      // Set the selected account to the state
      setSelectedAccount(selectedAccountData); // Set the full account data here
      setIsAddModalOpen(true); // Open modal
    }
  };

  const filteredData = data
    ? data.filter(
        (item) =>
          (item.accountName &&
            item.accountName.toLowerCase().includes(search.toLowerCase())) || // Ensure item.accountName exists
          item.facebookAccountId.toLowerCase().includes(search.toLowerCase()) // Ensure item.accountName exists
      )
    : [];

    

  const updatePaginatedDetails = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageDetails = data.slice(startIndex, endIndex);
    setPaginatedDetails(currentPageDetails);
  };

  useEffect(() => {
    // Handle invalid currentPage or empty data
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1); // Reset to the last page
    }

    if (data.length > 0 && currentPage < totalPages) {
      updatePaginatedDetails();
    } else {
      setCurrentPage(0); // Reset to the first page if no data
      updatePaginatedDetails();
    }
  }, [currentPage, rowsPerPage, data, totalPages]);

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
  //
 
  //
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };
  return (
    <div className="home">
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        Selected={SelectedAccount}
        onSuccess={() => {
          fetchCampaignData(); // Re-fetch data after update
        }} // Trigger data reload on success
      />

      <EditModal
        Name="Account"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selected={SelectedAccount}
        id={SelectedAccount.id} // Pass the correct dynamic ID (should be account ID, not facebookAccountId)
        endpoint={`${MONGO_URI}/api/account/${SelectedAccount._id}`} // Use dynamic endpoint with account ID
        onSuccess={() => {
          fetchCampaignData(); // Re-fetch data after update
        }}
      />

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Account
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn"
              onClick={openModal}
              style={{ padding: "8px 20px" }}
            >
              <span className="btn-text">New Account</span>
            </button>
          </div>
        </div>

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <SelectInputs
            name="account"
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
                  <th className="px-4 py-2">Account Name</th>
                  <th className="px-4 py-2">Facebook Account ID</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      currentPage * rowsPerPage,
                      (currentPage + 1) * rowsPerPage
                    )
                    .map((row, index) => (
                      <tr key={row._id} className="border-b hover:bg-gray-100">
                        <td data-label="#">
                          {index + 1 + currentPage * rowsPerPage}
                        </td>
                        <td className="px-4 py-2">{row.accountName}</td>
                        <td className="px-4 py-2">{row.facebookAccountId}</td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-2 text-center text-gray-600"
                    >
                      No accounts found.
                    </td>
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

export default Account;
