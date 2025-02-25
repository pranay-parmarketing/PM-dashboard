import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ApiTokenContext } from "../../context/Apicontext";
import { MONGO_URI } from "../../Variables/Variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MarketingReport = () => {
  const [insights, setInsights] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState("campaign"); // Default filter type
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isFetchingFromFacebook, setIsFetchingFromFacebook] = useState(false);

  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);

  // Fetch marketing report data
  const fetchMarketingReport = async () => {
    if (!startDate || !endDate || !selectedAccount?.id) {
      setMessage("Please select a date range and account.");
      return;
    }

    try {
      setIsFetchingFromFacebook(true);
      setMessage("Fetching data...");

      const response = await axios.get(`${MONGO_URI}/api/report`, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          account_id: selectedAccount.id,
          filterType: filterType,
        },
      });

      if (response.data.success) {
        setInsights(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.totalRecords,
        }));
        setMessage("");
      } else {
        setMessage("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching marketing report:", error);
      setMessage("An error occurred while fetching data.");
    } finally {
      setIsFetchingFromFacebook(false);
    }
  };

  // Handle filter type change
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // Handle end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Fetch data when filter type, date range, or account changes
  useEffect(() => {
    if (startDate && endDate && selectedAccount?.id) {
      fetchMarketingReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedAccount, filterType]);

  return (
    <div className="p-4">
      <div className="container mx-auto">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
            Marketing Report
          </h1>
        </div>

        {/* Date Range and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center mx-auto space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Start Date"
              className="p-2 border rounded w-40"
            />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="End Date"
              className="p-2 border rounded w-40"
            />
          </div>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="p-2 border rounded"
          >
            <option value="campaign">Campaign</option>
            <option value="adset">Adset</option>
            <option value="ads">Ads</option>
          </select>
          <button
            onClick={fetchMarketingReport}
            disabled={isFetchingFromFacebook}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isFetchingFromFacebook ? "Fetching..." : "Fetch Report"}
          </button>
        </div>

        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        {/* Insights Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm md:text-base">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-3 py-2">#</th>
                <th className="border border-gray-300 px-3 py-2">Type</th>
                <th className="border border-gray-300 px-3 py-2">  
                  Source Name
                </th>
                <th className="border border-gray-300 px-3 py-2">Name</th>
                <th className="border border-gray-300 px-3 py-2">Budget</th>
                <th className="border border-gray-300 px-3 py-2">
                  Impressions
                </th>
                <th className="border border-gray-300 px-3 py-2">Reach</th>
                <th className="border border-gray-300 px-3 py-2">
                  Conversions
                </th>
                <th className="border border-gray-300 px-3 py-2">CPC</th>
                <th className="border border-gray-300 px-3 py-2">Visitors</th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
                <th className="border border-gray-300 px-3 py-2">Created At</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <React.Fragment key={insight.campaign_id || index}>
                    {/* Campaign Row */}
                    <tr className="bg-gray-200 font-bold">
                      <td className="border border-gray-300 px-3 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        📢 Campaign
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.sources?.[0]?.source || "Unknown"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.campaign_name}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.total_spend || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.total_impressions || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.total_reach || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.total_conversions || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.avg_cpc || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.total_visitors || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.status || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {insight.created_at
                          ? new Date(insight.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
                          : "N/A"}
                      </td>
                    </tr>

                    {/* Adset Rows */}
                    {insight.adsets?.map((adset) => (
                      <tr key={adset.adset_id} className="bg-gray-100">
                        <td className="border border-gray-300 px-3 py-2"></td>
                        <td className="border border-gray-300 px-3 py-2">
                          📌 Adset
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {insight.sources?.[0]?.source || "Unknown"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 pl-6">
                          ↳ {adset.adset_name}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.spend || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.impressions || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.reach || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.conversions || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.cpc || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.total_visitors || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.status || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {adset.created_at
                            ? new Date(adset.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}

                    {/* Ad Rows */}
                    {insight.ads?.map((ad) => (
                      <tr key={ad.ad_id} className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2"></td>
                        <td className="border border-gray-300 px-3 py-2">
                          🎯 Ad
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {insight.sources?.[0]?.source || "Unknown"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 pl-12">
                          → {ad.ad_name}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.total_spend || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.total_impressions || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.total_reach || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.total_conversions || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.avg_cpc || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.total_visitors || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.status || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {ad.created_at
                            ? new Date(ad.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center border border-gray-300 px-3 py-2"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="p-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page === pagination.totalPages}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingReport;
