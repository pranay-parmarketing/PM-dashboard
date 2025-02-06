import React, { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ApiTokenContext } from "../../context/Apicontext";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";
import SelectInputs from "../../Components/SelectInput/SelectInputs";
import Pagination from "../../Components/Pagination/Pagination";

const Source = () => {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [allSourceData, setAllSourceData] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const {
    appsecret_proof,
    access_token,
    selectedAccount: contextSelectedAccount,
  } = useContext(ApiTokenContext);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (contextSelectedAccount) {
      setSelectedAccount(contextSelectedAccount);
    }
  }, [contextSelectedAccount]);

  // Fetch the source data with caching and expiration logic
  useEffect(() => {
    if (!selectedAccount?.id) return;
  
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if account-specific data is in localStorage and valid (less than 6 hours old)
        const cacheKey = `allSourceData_${selectedAccount.id}`;
        const timestampKey = `allSourceDataTimestamp_${selectedAccount.id}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(timestampKey);
  
        const now = Date.now();
        const sixHoursInMs = 6 * 60 * 60 * 1000;
  
        if (cachedData && cachedTimestamp && now - cachedTimestamp < sixHoursInMs) {
          // Use cached data if valid
          const sourceData = JSON.parse(cachedData);
          setAllSourceData(sourceData);
          setFilteredData(sourceData);
        } else {
          // Fetch fresh data for the selected account
          const sourceRes = await axios.get(`${MONGO_URI}/api/source`, {
            params: { accountId: selectedAccount.id },  // Fetch only selected account data
          });
  
          const sourceData = sourceRes.data.leads || [];
          setAllSourceData(sourceData);
          setFilteredData(sourceData);
  
          // Cache the new data
          localStorage.setItem(cacheKey, JSON.stringify(sourceData));
          localStorage.setItem(timestampKey, now);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedAccount]);  // Trigger effect only when selectedAccount changes
  
  

  // Filter the data based on search query, ensuring allSourceData is not undefined
  useEffect(() => {
    if (allSourceData && allSourceData.length > 0) {
      setFilteredData(
        allSourceData.filter(
          (row) =>
            row.campaign_name.toLowerCase().includes(search.toLowerCase()) ||
            row.source.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allSourceData]);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredData.length / rowsPerPage) - 1)
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const isNextButtonDisabled =
    currentPage >= Math.ceil(filteredData.length / rowsPerPage) - 1;
  const isPrevButtonDisabled = currentPage <= 0;

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Source
          </h1>
        </div>

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 ${
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
                  <th>Campaign Name</th>
                  <th>Source</th>
                  <th>Adset Name</th>
                  <th>Account</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      currentPage * rowsPerPage,
                      (currentPage + 1) * rowsPerPage
                    )
                    .map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1 + currentPage * rowsPerPage}</td>
                        <td>{row.campaign_name}</td>
                        <td>{row.source}</td>
                        <td>{row.adsetname}</td>
                        <td>{selectedAccount.name}</td>
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
            name={"source"}
            handlePreviousPage={handlePreviousPage}
            isPrevButtonDisabled={isPrevButtonDisabled}
            currentPage={currentPage}
            apitotalpage={Math.ceil(filteredData.length / rowsPerPage)}
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
