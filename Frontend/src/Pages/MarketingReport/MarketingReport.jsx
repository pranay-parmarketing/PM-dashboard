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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isFetchingFromFacebook, setIsFetchingFromFacebook] = useState(false);

  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Marketing Report
          </h1>
        </div>
      </div>

      {/* Date Range Picker */}

      {/* Insights Table */}
      <div className="md:w-[90%] bg-white shadow-md rounded-lg p-4 lg:ml-16 md:ml-20">
        <div className="overflow-x-auto">
          <table className="min-w-max table-auto">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th>#</th>
                <th>Account</th>
                <th>Source</th>
                <th>View Creatives</th>
                <th>Budget</th>
                <th>Adset Budget</th>
                <th>Campagain Budet</th>
                <th>Express Ad</th>
                <th>Daily Lead Total</th>
                <th>Daily Lead Cost</th>
                <th>Daily Lead Sent</th>
                <th>Explain DMP</th>
                <th>Daily Pack Out</th>
                <th>Daily Enrolled </th>
                <th>DI Amount</th>
               
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
    </div>
  );
};

export default MarketingReport;
