import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ApiTokenContext } from "../../context/Apicontext";
import { MONGO_URI } from "../../Variables/Variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reports = () => {
  const [insights, setInsights] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isFetchingFromFacebook, setIsFetchingFromFacebook] = useState(false);

  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);

  // Function to get yesterday's date
  const getYesterdayDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  };

  // Set default dates on component mount
  useEffect(() => {
    const yesterday = getYesterdayDate();
    setStartDate(yesterday);
    setEndDate(yesterday);
  }, []);

  useEffect(() => {
    fetchAndStoreInsights();
  }, [selectedAccount]); 

  // Fetch and Store Facebook Insights
  const fetchAndStoreInsights = async () => {
    if (!selectedAccount?.id || !access_token) {
      setMessage("Error: Account ID or Access Token is missing.");
      return;
    }

    try {
      setIsFetchingFromFacebook(true);
      const response = await axios.post(`${MONGO_URI}/api/facebook`, {
        account_id: selectedAccount.id,
        access_token,
        appsecret_proof,
        start_date: startDate?.toISOString().split("T")[0],
        end_date: endDate?.toISOString().split("T")[0],
      });
      setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      setMessage(
        response.data.message || "Facebook Insights fetched successfully"
      );
      setInsights(response.data.data || []);
    
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error fetching Facebook insights"
      );
    } finally {
      setIsFetchingFromFacebook(false);
    }
  };

  // Get Insights from Database
  const getInsights = async (page = 1, limit = 10) => {
    if (!selectedAccount?.id) {
      setMessage("Error: Account ID is missing.");
      return;
    }
    try {
      const response = await axios.get(`${MONGO_URI}/api/facebook/${selectedAccount.id}`, {
        params: { page, limit },
      });
      setInsights(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      setMessage("Insights retrieved successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error retrieving insights");
    }
  };

  // Handle Pagination Change
  const handlePageChange = (newPage) => {
    if (isFetchingFromFacebook) {
      // Paginate Facebook API data locally
      const startIndex = (newPage - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = insights.slice(startIndex, endIndex);
      setInsights(paginatedData);
      setPagination((prev) => ({ ...prev, page: newPage }));
    } else {
      // Fetch paginated data from the database
      getInsights(newPage);
    }
  };

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Reports
          </h1>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center ">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border rounded-md p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="border rounded-md p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
     

      <button
        onClick={fetchAndStoreInsights}
        className="bg-green-500 text-white m-4 p-2 rounded"
      >
        Fetch Data
      </button>
      <button
        onClick={() => getInsights()}
        className="bg-red-500 text-white m-4 p-2 rounded"
      >
        Get All Data
      </button>

      {message && <p className="m-4 text-green-600">{message}</p>}

      {/* Insights Table */}
      <div className="md:w-[90%] bg-white shadow-md rounded-lg p-4 lg:ml-16 md:ml-20">
        <div className="overflow-x-auto">
          <table className="min-w-max table-auto">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th>#</th>
                <th>SelectedAccount</th>
                <th>Campaign</th>
                <th>Adset Name</th>
                <th>Active Users</th>
                <th>Spend</th>
                <th>Reach</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>CPP</th>
                <th>CPC</th>
                <th>CPM</th>
                <th>Cost Per Unique Click</th>
                <th>Clicks</th>
                <th>Inline Link Click Ctr</th>
                <th>Inline Link Clicks</th>
                
                <th>Date Start</th>
                <th>Date Stop</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <tr key={insight.id}>
                    <td>{index + 1}</td>
                    <td>{selectedAccount.name}</td>
                    <td>{insight.campaign_name}</td>
                    <td>{insight.adset_name}</td>
                    <td>{insight.activeUsers}</td>
                    <td>{insight.spend}</td>
                    <td>{insight.reach}</td>
                    <td>{insight.impressions}</td>
                    <td>{insight.ctr}</td>
                    <td>{insight.cpp}</td>
                    <td>{insight.cpc}</td>
                    <td>{insight.cpm}</td>
                    <td>{insight.cost_per_unique_click}</td>
                    <td>{insight.clicks}</td>
                    <td>{insight.inline_link_click_ctr}</td>
                    <td>{insight.inline_link_clicks}</td>
                    
                    <td>{insight.date_start}</td>
                    <td>{insight.date_stop}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center p-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mx-1 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-4">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mx-1 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;
