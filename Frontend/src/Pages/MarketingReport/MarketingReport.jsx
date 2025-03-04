// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { ApiTokenContext } from "../../context/Apicontext";
// import { MONGO_URI } from "../../Variables/Variables";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import './MarketingReport.css'

// const MarketingReport = () => {
//   const [insights, setInsights] = useState([]);
//   const [message, setMessage] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filterType, setFilterType] = useState("campaign"); // Default filter type
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   });
//   const [isFetchingFromFacebook, setIsFetchingFromFacebook] = useState(false);

//   const { appsecret_proof, access_token, selectedAccount } =
//     useContext(ApiTokenContext);

//   // Calculate totals
//   const calculateTotals = () => {
//     const totals = {
//       totalSpend: 0,
//       totalImpressions: 0,
//       totalReach: 0,
//       totalConversions: 0,
//       totalVisitors: 0,
//     };

//     insights.forEach((insight) => {
//       totals.totalSpend += insight.total_spend || 0;
//       totals.totalImpressions += insight.total_impressions || 0;
//       totals.totalReach += insight.total_reach || 0;
//       totals.totalConversions += insight.total_conversions || 0;
//       totals.totalVisitors += insight.total_visitors || 0;
//     });

//     return totals;
//   };

//   const totals = calculateTotals();

//   // Fetch marketing report data
//   const fetchMarketingReport = async () => {
//     if (!startDate || !endDate || !selectedAccount?.id) {
//       setMessage("Please select a date range and account.");
//       return;
//     }

//     try {
//       setIsFetchingFromFacebook(true);
//       setMessage("Fetching data...");

//       const response = await axios.get(`${MONGO_URI}/api/report`, {
//         params: {
//           startDate: startDate.toISOString().split("T")[0],
//           endDate: endDate.toISOString().split("T")[0],
//           account_id: selectedAccount.id,
//           filterType: filterType,
//         },
//       });

//       if (response.data.success) {
//         setInsights(response.data.data);
//         setPagination((prev) => ({
//           ...prev,
//           total: response.data.totalRecords,
//         }));
//         setMessage("");
//       } else {
//         setMessage("Failed to fetch data.");
//       }
//     } catch (error) {
//       console.error("Error fetching marketing report:", error);
//       setMessage("An error occurred while fetching data.");
//     } finally {
//       setIsFetchingFromFacebook(false);
//     }
//   };

//   // Handle filter type change
//   const handleFilterTypeChange = (e) => {
//     setFilterType(e.target.value);
//   };

//   // Handle start date change
//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   // Handle end date change
//   const handleEndDateChange = (date) => {
//     setEndDate(date);
//   };

//   // Fetch data when filter type, date range, or account changes
//   useEffect(() => {
//     if (startDate && endDate && selectedAccount?.id) {
//       fetchMarketingReport();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startDate, endDate, selectedAccount, filterType]);

//   const getFirstDate = (data) => {
//     if (data && data.length > 0) {
//       return data[0].count;
//     }
//     return "N/A";
//   };

//   return (
//     <div className="p-4">
//     <div className="container mx-auto">
//       {/* Title */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
//           Marketing Report
//         </h1>
//       </div>

//       {/* Date Range and Filter */}
//       <div className="flex flex-col md:flex-row items-center justify-center mx-auto space-y-4 md:space-y-0 md:space-x-4 mb-6">
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
//           <DatePicker
//             selected={startDate}
//             onChange={handleStartDateChange}
//             placeholderText="Start Date"
//             className="p-2 border rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={handleEndDateChange}
//             placeholderText="End Date"
//             className="p-2 border rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <select
//           value={filterType}
//           onChange={handleFilterTypeChange}
//           className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="campaign">Campaign</option>
//           <option value="adset">Adset</option>
//           <option value="ads">Ads</option>
//         </select>
//         <button
//           onClick={fetchMarketingReport}
//           disabled={isFetchingFromFacebook}
//           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//         >
//           {isFetchingFromFacebook ? "Fetching..." : "Fetch Report"}
//         </button>
//       </div>

//       {message && (
//         <p className="text-red-500 text-center mb-4 animate-pulse">{message}</p>
//       )}

//       {/* Insights Table */}
//       <div className="flex flex-col lg:flex-row gap-4">
//         {/* Campaign Table */}
//         <div className="w-[70%] bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="h-[500px] overflow-y-auto scrollbar-hide">
//             <table className="min-w-full table-auto border-collapse text-sm">
//               <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 ">
//                 <tr>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     #
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Type
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Source Name
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Name
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Budget
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Visitors
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Status
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Created At
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {insights.length > 0 ? (
//                   insights.map((insight, index) => (
//                     <React.Fragment key={insight.campaign_id || index}>
//                       {/* Campaign Row */}
//                       <tr className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {index + 1}
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           📢 Campaign
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {insight.sources?.[0]?.source || "Unknown"}
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {insight.campaign_name}
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {insight.total_spend?.toFixed(2) || "N/A"}
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {insight.total_visitors || "N/A"}
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           <span
//                             className={`px-2 py-1 rounded-full text-sm ${
//                               insight.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {insight.status || "N/A"}
//                           </span>
//                         </td>
//                         <td className="border border-gray-200 px-4 py-3 align-top">
//                           {insight.created_at
//                             ? new Date(insight.created_at).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   year: "numeric",
//                                   month: "2-digit",
//                                   day: "2-digit",
//                                 }
//                               )
//                             : "N/A"}
//                         </td>
//                       </tr>

//                       {/* Adset Rows */}
//                       {insight?.adsets?.map((adset) => (
//                         <tr
//                           key={adset?.adset_id}
//                           className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                         >
//                           <td className="border border-gray-200 px-4 py-3 align-top"></td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             📌 Adset
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {insight?.sources?.[0]?.source || "Unknown"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 pl-6 align-top">
//                             ↳ {adset?.adset_name}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {adset?.spend?.toFixed(2) || "N/A"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {adset?.total_visitors || "N/A"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             <span
//                               className={`px-2 py-1 rounded-full text-sm ${
//                                 adset?.status === "active"
//                                   ? "bg-green-100 text-green-700"
//                                   : "bg-red-100 text-red-700"
//                               }`}
//                             >
//                               {adset?.status || "N/A"}
//                             </span>
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {adset.created_at
//                               ? new Date(adset?.created_at).toLocaleDateString(
//                                   "en-GB",
//                                   {
//                                     year: "numeric",
//                                     month: "2-digit",
//                                     day: "2-digit",
//                                   }
//                                 )
//                               : "N/A"}
//                           </td>
//                         </tr>
//                       ))}

//                       {/* Ad Rows */}
//                       {insight?.ads?.map((ad) => (
//                         <tr
//                           key={ad.ad_id}
//                           className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
//                         >
//                           <td className="border border-gray-200 px-4 py-3 align-top"></td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             🎯 Ad
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {insight.sources?.[0]?.source || "Unknown"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 pl-12 align-top">
//                             → {ad.ad_name}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {ad.total_spend?.toFixed(2) || "N/A"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {ad.total_visitors || "N/A"}
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             <span
//                               className={`px-2 py-1 rounded-full text-sm ${
//                                 ad.status === "active"
//                                   ? "bg-green-100 text-green-700"
//                                   : "bg-red-100 text-red-700"
//                               }`}
//                             >
//                               {ad.status || "N/A"}
//                             </span>
//                           </td>
//                           <td className="border border-gray-200 px-4 py-3 align-top">
//                             {ad.created_at
//                               ? new Date(ad.created_at).toLocaleDateString(
//                                   "en-GB",
//                                   {
//                                     year: "numeric",
//                                     month: "2-digit",
//                                     day: "2-digit",
//                                   }
//                                 )
//                               : "N/A"}
//                           </td>
//                         </tr>
//                       ))}
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="8"
//                       className="text-center border border-gray-200 px-4 py-3"
//                     >
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Fixed Totals Row */}
//           <div className="sticky bottom-0 bg-gray-300">
//             <table className="min-w-full table-auto border-collapse text-sm">
//               <tfoot>
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="border border-gray-200 px-4 py-3 font-bold"
//                   >
//                     Totals
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {totals.totalSpend?.toFixed(2) || "N/A"}
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {totals.totalVisitors || "N/A"}
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold"></td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold"></td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>

//         {/* Daily Metrics Table */}
//         <div className="w-[30%] bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="h-[500px] overflow-y-auto scrollbar-hide">
//             <table className="min-w-full table-auto border-collapse text-sm">
//               <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 ">
//                 <tr>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Date
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Leads
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Packsent
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     Enrolls
//                   </th>
//                   <th className="border border-gray-200 px-4 py-3 text-left">
//                     DMPS
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {insights.length > 0 ? (
//                   insights[0]?.dmpsByDay.map((e, index) => (
//                     <tr
//                       key={e._id}
//                       className="hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <td className="border border-gray-200 px-4 py-3 align-top">
//                         {new Date(e._id).toLocaleDateString("en-GB", {
//                           year: "numeric",
//                           month: "2-digit",
//                           day: "2-digit",
//                         })}
//                       </td>
//                       <td className="border border-gray-200 px-4 py-3 align-top">
//                         {insights[0]?.leadsByDay[index]?.count || "N/A"}
//                       </td>
//                       <td className="border border-gray-200 px-4 py-3 align-top">
//                         {insights[0]?.packsentByDay[index]?.count || "N/A"}
//                       </td>
//                       <td className="border border-gray-200 px-4 py-3 align-top">
//                         {insights[0]?.enrollsByDay[index]?.count || "N/A"}
//                       </td>
//                       <td className="border border-gray-200 px-4 py-3 align-top">
//                         {e.count || "N/A"}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="text-center border border-gray-200 px-4 py-3"
//                     >
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Fixed Totals Row */}
//           <div className="sticky bottom-0 bg-gray-300">
//             <table className="min-w-full table-auto border-collapse text-sm">
//               <tfoot>
//                 <tr>
//                   <td
//                     colSpan="1"
//                     className="border border-gray-200 px-4 py-3 font-bold"
//                   >
//                     Totals
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {insights[0]?.leadsByDay?.reduce(
//                       (sum, e) => sum + (e.count || 0),
//                       0
//                     ) || "N/A"}
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {insights[0]?.packsentByDay?.reduce(
//                       (sum, e) => sum + (e.count || 0),
//                       0
//                     ) || "N/A"}
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {insights[0]?.enrollsByDay?.reduce(
//                       (sum, e) => sum + (e.count || 0),
//                       0
//                     ) || "N/A"}
//                   </td>
//                   <td className="border border-gray-200 px-4 py-3 font-bold">
//                     {insights[0]?.dmpsByDay?.reduce(
//                       (sum, e) => sum + (e.count || 0),
//                       0
//                     ) || "N/A"}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default MarketingReport;

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ApiTokenContext } from "../../context/Apicontext";
import { MONGO_URI } from "../../Variables/Variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MarketingReport.css";

const MarketingReport = () => {
  const [campaignData, setCampaignData] = useState([]); // Store campaign data
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState("campaign"); // Default filter type
  const [isFetchingFromFacebook, setIsFetchingFromFacebook] = useState(false);

  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      totalSpend: 0,
      totalImpressions: 0,
      totalReach: 0,
      totalConversions: 0,
      totalVisitors: 0,
    };

    campaignData.forEach((insight) => {
      totals.totalSpend += insight.total_spend || 0;
      totals.totalImpressions += insight.total_impressions || 0;
      totals.totalReach += insight.total_reach || 0;
      totals.totalConversions += insight.total_conversions || 0;
      totals.totalVisitors += insight.total_visitors || 0;
    });

    return totals;
  };

  const totals = calculateTotals();

  // Fetch campaign data
  const fetchCampaignData = async () => {
    if (!startDate || !endDate || !selectedAccount?.id) {
      setMessage("Please select a date range and account.");
      return;
    }

    try {
      setIsFetchingFromFacebook(true);
      setMessage("Fetching campaign data...");

      const response = await axios.get(`${MONGO_URI}/api/report`, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          account_id: selectedAccount.id,
          filterType: "campaign", // Always fetch campaign data
        },
      });

      if (response.data.success) {
        setCampaignData(response.data.data); // Store campaign data
        setMessage("");
      } else {
        setMessage("Failed to fetch campaign data.");
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      setMessage("An error occurred while fetching campaign data.");
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

  // Fetch campaign data when date range or account changes
  useEffect(() => {
    if (startDate && endDate && selectedAccount?.id) {
      fetchCampaignData();
    }
  }, [startDate, endDate, selectedAccount]);

  const getFirstDate = (data) => {
    if (data && data.length > 0) {
      return data[0].count;
    }
    return "N/A";
  };

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
              className="p-2 border rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="End Date"
              className="p-2 border rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="campaign">Campaign</option>
            <option value="adset">Adset</option>
            <option value="ads">Ads</option>
          </select>
          <button
            onClick={fetchCampaignData}
            disabled={isFetchingFromFacebook}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            {isFetchingFromFacebook ? "Fetching..." : "Fetch Report"}
          </button>
        </div>

        {message && (
          <p className="text-red-500 text-center mb-4 animate-pulse">
            {message}
          </p>
        )}

        {/* Insights Table */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campaign Table */}
          <div className="w-[70%] bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-[500px] overflow-y-auto scrollbar-hide">
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 ">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      #
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Type
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Source Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Budget
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Visitors
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Status
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left whitespace-nowrap">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {campaignData.length > 0 ? (
                    campaignData.map((insight, index) => (
                      <React.Fragment key={insight.campaign_id || index}>
                        {/* Campaign Row */}
                        {filterType === "campaign" && (
                          <tr className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <td className="border border-gray-200 px-4 py-3 align-top">
                              {index + 1}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top">
                              Campaign
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top w-52">
                              {insight.sources?.[0]?.source || "Unknown"}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top w-52">
                              {insight.campaign_name}
                            </td>

                            <td className="border border-gray-200 px-4 py-3 align-top">
                              {insight.total_spend?.toFixed(2) || "N/A"}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top">
                              {insight.total_visitors || "N/A"}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  insight.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {insight.status || "N/A"}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 align-top">
                              {insight.created_at
                                ? new Date(
                                    insight.created_at
                                  ).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                : "N/A"}
                            </td>
                          </tr>
                        )}

                        {/* Adset Rows */}
                        {filterType === "adset" &&
                          insight.adsets?.map((adset, adsetIndex) => (
                            <tr
                              key={adset.adset_id || adsetIndex}
                              className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {index + 1}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                Adset
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top w-52">
                                {insight.sources?.[0]?.source || "Unknown"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top w-52">
                                {adset.adset_name}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {insight.total_spend?.toFixed(2) || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {adset.total_visitors || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    adset.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {adset?.status || "N/A"}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {adset.created_at
                                  ? new Date(
                                      adset.created_at
                                    ).toLocaleDateString("en-GB", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}

                        {/* Ad Rows */}
                        {filterType === "ads" &&
                          insight.ads?.map((ad, adIndex) => (
                            <tr
                              key={ad.ad_id || adIndex}
                              className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {index + 1}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                Ad
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top w-52">
                                {insight.sources?.[0]?.source || "Unknown"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top w-52">
                                {ad.ad_name}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {insight.total_spend?.toFixed(2) || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                {ad.total_visitors || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    ad.ad_status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {ad.ad_status || "N/A"}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 align-top">
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
                        colSpan="8"
                        className="text-center border border-gray-200 px-4 py-3"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Fixed Totals Row */}
            <div className="sticky bottom-0 bg-gray-300">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tfoot>
                  <tr>
                    <td
                      colSpan="4"
                      className="border border-gray-200 px-4 py-3 font-bold"
                    >
                      Totals
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {totals.totalSpend?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {totals.totalVisitors || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold"></td>
                    <td className="border border-gray-200 px-4 py-3 font-bold"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Daily Metrics Table */}
          <div className="w-[30%] bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-[500px] overflow-y-auto scrollbar-hide">
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 ">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left">
                      Date
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left">
                      Leads
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left">
                      Packsent
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left">
                      Enrolls
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left">
                      DMPS
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {(() => {
                    const campaign = campaignData[0] || {};

                    // Merge all unique dates from different datasets
                    const uniqueDates = Array.from(
                      new Set([
                        ...(campaign.dmpsByDay || []).map((e) => e._id),
                        ...(campaign.leadsByDay || []).map((e) => e._id),
                        ...(campaign.packsentByDay || []).map((e) => e._id),
                        ...(campaign.enrollsByDay || []).map((e) => e._id),
                      ])
                    ).sort();

                    // Convert arrays into maps for quick lookup
                    const leadsMap = new Map(
                      (campaign.leadsByDay || []).map((e) => [e._id, e.count])
                    );
                    const packsentMap = new Map(
                      (campaign.packsentByDay || []).map((e) => [
                        e._id,
                        e.count,
                      ])
                    );
                    const enrollsMap = new Map(
                      (campaign.enrollsByDay || []).map((e) => [e._id, e.count])
                    );
                    const dmpsMap = new Map(
                      (campaign.dmpsByDay || []).map((e) => [e._id, e.count])
                    );

                    return uniqueDates.length > 0 ? (
                      uniqueDates.map((date) => (
                        <tr
                          key={date}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="border border-gray-200 px-4 py-3 align-top">
                            {date}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top">
                            {leadsMap.get(date) ?? "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top">
                            {packsentMap.get(date) ?? "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top">
                            {enrollsMap.get(date) ?? "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top">
                            {dmpsMap.get(date) ?? "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center border border-gray-200 px-4 py-3"
                        >
                          No data available
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            {/* Fixed Totals Row */}
            <div className="sticky bottom-0 bg-gray-300">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tfoot>
                  <tr>
                    <td
                      colSpan="1"
                      className="border border-gray-200 px-4 py-3 font-bold"
                    >
                      Totals
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {campaignData[0]?.leadsByDay?.reduce(
                        (sum, e) => sum + (e?.count || 0),
                        0
                      ) || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {campaignData[0]?.packsentByDay?.reduce(
                        (sum, e) => sum + (e?.count || 0),
                        0
                      ) || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {campaignData[0]?.enrollsByDay?.reduce(
                        (sum, e) => sum + (e?.count || 0),
                        0
                      ) || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 font-bold">
                      {campaignData[0]?.dmpsByDay?.reduce(
                        (sum, e) => sum + (e?.count || 0),
                        0
                      ) || "N/A"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingReport;
