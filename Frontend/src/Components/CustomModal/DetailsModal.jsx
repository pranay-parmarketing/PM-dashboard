// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios"; // Ensure axios is installed and imported
// import Modal from "./Modal"; // Assuming Modal component is imported correctly
// import { ApiTokenContext } from "../../context/Apicontext";

// const DetailsModal = ({
//   Name,
//   isOpen,
//   onClose,
//   selected,
//   endpoint,
//   onSuccess,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false); // To track loading state
//   const [errorMessage, setErrorMessage] = useState(""); // To store error message
//   const [budgetDate, setBudgetDate] = useState(""); // To store error message
//   const { appsecret_proof, access_token, selectedAccount } =
//       useContext(ApiTokenContext);
//   const appSecretProof = appsecret_proof;
//   const accessToken = access_token;

//   // Fetch data from Facebook API
//   useEffect(() => {
//     if (isOpen) {
//       setLoading(true);
//       axios
//         .get(
//           `https://graph.facebook.com/v17.0/${selected.id}?fields=id,name,created_time,adsets{daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,insights{spend}},ads{id,name}}&appsecret_proof=${appSecretProof}&access_token=${accessToken}`
//         )
//         .then((response) => {
//           const adsets = response.data?.adsets?.data || []; // Safely access data with default []

//           console.log("response.data.adsets?.data", adsets);

//           const formattedAdsets = adsets.map((adset) => ({
//             name: adset.ads?.data?.[0]?.name || adset.name || "N/A",
//             level: "Adset",
//             budget:
//               adset.insights?.data?.[0]?.spend ||
//               adset.lifetime_budget ||
//               "N/A",
//           }));

//           console.log("formattedAdsets:", formattedAdsets);

//           const campaigns =
//             response.data?.adsets?.data?.map((adset) => ({
//               name: response.data?.name || "N/A", // Campaign name
//               level: "Campaign",
//               budget:
//                 adset?.campaign?.insights?.data?.reduce((total, insight) => {
//                   return total + (parseFloat(insight.spend) || 0);
//                 }, 0) || "N/A", // Safe calculation with fallback
//               insights:
//                 adset?.campaign?.insights?.data?.map((insight, index) => ({
//                   spend: insight?.spend || "N/A", // Handle missing insight data
//                   date_start: insight?.date_start || "N/A",
//                   date_stop: insight?.date_stop || "N/A",
//                   index,
//                 })) || [],
//             })) || [];

//           console.log("Campaigns:", campaigns);

//           setData([...campaigns, ...formattedAdsets]);
//           setBudgetDate(
//             selected.created_time
//               ? new Date(selected.created_time).toLocaleDateString("en-GB")
//               : ""
//           );
//         })
//         .catch((error) => {
//           console.error("Error Details:", error);
//           setErrorMessage(
//             error.response?.data?.error?.message ||
//               error.message ||
//               "Failed to fetch data"
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [isOpen]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={selected ? `View ${Name}` : `Add ${Name}`}
//     >
//       <div className="modal-body-content max-h-[60vh] overflow-y-auto p-4">
//         {/*  */}
//         <label className="modal-label">
//           Selected {Name} Date
//           <input
//             type="text"
//             className={"input-error"}
//             placeholder="Enter Account Name"
//             value={budgetDate} // Prefill this field with state
//             onChange={(e) => setBudgetDate(e.target.value)} // Handle change
//           />
//         </label>
//         {/*  */}

//         {loading ? (
//           <p>Loading...</p>
//         ) : errorMessage ? (
//           <p className="text-red-500">{errorMessage}</p>
//         ) : (
//           <table className="table-auto w-full">
//             <thead>
//               <tr className="bg-gray-800 text-white text-left">
//                 <th className="p-2">Source Name</th>
//                 <th className="p-2">Level</th>
//                 <th className="p-2">Budget</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {data.length > 0 ? (
//                 data.map((item, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2" data-label="Source Name">
//                       {item.name}
//                     </td>
//                     <td className="p-2" data-label="Level">
//                       {item.level}
//                     </td>
//                     <td className="p-2" data-label="Budget">
//                       {item.budget}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4">
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default DetailsModal;

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Modal from "./Modal";
// import { ApiTokenContext } from "../../context/Apicontext";

// const DetailsModal = ({
//   Name,
//   isOpen,
//   onClose,
//   selected,
//   endpoint,
//   onSuccess,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [budgetDate, setBudgetDate] = useState("");
//   const { appsecret_proof, access_token } = useContext(ApiTokenContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (isOpen) {
//         setLoading(true);
//         try {
//           // Fetch campaign data with adsets
//           const campaignResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}?fields=id,name,created_time,adsets{daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,insights{spend}},ads{id,name}}&appsecret_proof=${appsecret_proof}&access_token=${access_token}`
//           );

//           const adsetsData = campaignResponse.data?.adsets?.data || [];

//           // Fetch detailed adset budgets
//           const adsetIds = adsetsData.map((adset) => adset.id).join(",");
//           const adsetResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}/adsets?fields=id,name,status,daily_budget,budget_remaining&access_token=${access_token}&appsecret_proof=${appsecret_proof}`
//           );

//           const adsetDetails = adsetResponse.data?.data || [];

//           // Merge adset data with additional breakdown details
//           const formattedAdsets = adsetDetails.map((adset) => ({
//             name: adset.name || "N/A",
//             level: "Adset",
//             budget: adset.daily_budget
//               ? `${parseInt(adset.daily_budget) / 100} (Daily Budget)`
//               : adset.budget_remaining
//               ? `${parseInt(adset.budget_remaining) / 100} (Remaining Budget)`
//               : "N/A",
//           }));

//           const campaigns =
//             adsetsData.map((adset) => ({
//               name: campaignResponse.data?.name || "N/A", // Campaign name
//               level: "Campaign",
//               budget:
//                 adset?.campaign?.insights?.data?.reduce((total, insight) => {
//                   return total + (parseFloat(insight.spend) || 0);
//                 }, 0) || "N/A",
//             })) || [];

//           setData([...campaigns, ...formattedAdsets]);

//           setBudgetDate(
//             selected.created_time
//               ? new Date(selected.created_time).toLocaleDateString("en-GB")
//               : ""
//           );
//         } catch (error) {
//           console.error("Error Details:", error);
//           setErrorMessage(
//             error.response?.data?.error?.message ||
//               error.message ||
//               "Failed to fetch data"
//           );
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [isOpen]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={selected ? `View ${Name}` : `Add ${Name}`}
//     >
//       <div className="modal-body-content max-h-[60vh] overflow-y-auto p-4">
//         <label className="modal-label">
//           Selected {Name} Date
//           <input
//             type="text"
//             className={"input-error"}
//             placeholder="Enter Account Name"
//             value={budgetDate}
//             onChange={(e) => setBudgetDate(e.target.value)}
//           />
//         </label>

//         {loading ? (
//           <p>Loading...</p>
//         ) : errorMessage ? (
//           <p className="text-red-500">{errorMessage}</p>
//         ) : (
//           <table className="table-auto w-full">
//             <thead>
//               <tr className="bg-gray-800 text-white text-left">
//                 <th className="p-2">Source Name</th>
//                 <th className="p-2">Level</th>
//                 <th className="p-2">Budget</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {data.length > 0 ? (
//                 data.map((item, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2" data-label="Source Name">
//                       {item.name}
//                     </td>
//                     <td className="p-2" data-label="Level">
//                       {item.level}
//                     </td>
//                     <td className="p-2" data-label="Budget">
//                       {item.budget}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4">
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default DetailsModal;

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Modal from "./Modal";
// import { ApiTokenContext } from "../../context/Apicontext";

// const DetailsModal = ({
//   Name,
//   isOpen,
//   onClose,
//   selected,
//   endpoint,
//   onSuccess,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [budgetDate, setBudgetDate] = useState("");
//   const { appsecret_proof, access_token } = useContext(ApiTokenContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (isOpen) {
//         setLoading(true);
//         try {
//           // Fetch campaign data with adsets
//           const campaignResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}?fields=id,name,created_time,adsets{daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,insights{spend}},ads{id,name}}&appsecret_proof=${appsecret_proof}&access_token=${access_token}`
//           );

//           const adsetsData = campaignResponse.data?.adsets?.data || [];

//           // Fetch detailed adset budgets
//           const adsetIds = adsetsData.map((adset) => adset.id).join(",");
//           const adsetResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}/adsets?fields=id,name,status,daily_budget,budget_remaining&access_token=${access_token}&appsecret_proof=${appsecret_proof}`
//           );

//           const adsetDetails = adsetResponse.data?.data || [];

//           // Merge adset data with additional breakdown details
//           const formattedAdsets = adsetDetails.map((adset) => ({
//             name: adset.name || "N/A",
//             level: "Adset",
//             budget: adset.daily_budget
//               ? `${parseInt(adset.daily_budget) / 100} `
//               : adset.budget_remaining
//               ? `${parseInt(adset.budget_remaining) / 100} (Remaining Budget)`
//               : "N/A",
//           }));

//           const campaigns =
//             adsetsData.map((adset) => ({
//               name: campaignResponse.data?.name || "N/A", // Campaign name
//               level: "Campaign",
//               budget:
//                 adset?.campaign?.insights?.data?.reduce((total, insight) => {
//                   return total + (parseFloat(insight.spend) || 0);
//                 }, 0) || "N/A",
//             })) || [];

//           setData([...formattedAdsets]);
//           // setData([...campaigns, ...formattedAdsets]);

//           setBudgetDate(
//             selected.created_time
//               ? new Date(selected.created_time).toLocaleDateString("en-GB")
//               : ""
//           );
//         } catch (error) {
//           console.error("Error Details:", error);
//           setErrorMessage(
//             error.response?.data?.error?.message ||
//               error.message ||
//               "Failed to fetch data"
//           );
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [isOpen]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={selected ? `View ${Name}` : `Add ${Name}`}
//     >
//       <div className="modal-body-content max-h-[60vh] overflow-y-auto p-4">
//         <label className="modal-label">
//           Selected {Name} Date
//           <input
//             type="text"
//             className={"input-error"}
//             placeholder="Enter Account Name"
//             value={budgetDate}
//             onChange={(e) => setBudgetDate(e.target.value)}
//           />
//         </label>

//         {loading ? (
//           <p>Loading...</p>
//         ) : errorMessage ? (
//           <p className="text-red-500">{errorMessage}</p>
//         ) : (
//           <table className="table-auto w-full">
//             <thead>
//               <tr className="bg-gray-800 text-white text-left">
//                 <th className="p-2">Source Name</th>
//                 <th className="p-2">Level</th>
//                 <th className="p-2">Budget</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {data.length > 0 ? (
//                 data.map((item, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2" data-label="Source Name">
//                       {item.name}
//                     </td>
//                     <td className="p-2" data-label="Level">
//                       {item.level}
//                     </td>
//                     <td className="p-2" data-label="Budget">
//                       {item.budget}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4">
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default DetailsModal;
// ------------------------------------------------------------

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Modal from "./Modal";
// import { ApiTokenContext } from "../../context/Apicontext";

// const DetailsModal = ({
//   Name,
//   isOpen,
//   onClose,
//   selected,
//   endpoint,
//   onSuccess,
//   paginatedDetails,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [budgetDate, setBudgetDate] = useState("");
//   const { appsecret_proof, access_token } = useContext(ApiTokenContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (isOpen) {
//         setLoading(true);
//         try {
//           // Fetch campaign data with adsets
//           const campaignResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}?fields=id,name,created_time,adsets{daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,insights{spend}},ads{id,name}}&appsecret_proof=${appsecret_proof}&access_token=${access_token}`
//           );

//           const adsetsData = campaignResponse.data?.adsets?.data || [];

//           // Fetch detailed adset budgets
//           const adsetIds = adsetsData.map((adset) => adset.id).join(",");
//           const adsetResponse = await axios.get(
//             `https://graph.facebook.com/v17.0/${selected.id}/adsets?fields=id,name,status,daily_budget,budget_remaining&access_token=${access_token}&appsecret_proof=${appsecret_proof}`
//           );

//           const adsetDetails = adsetResponse.data?.data || [];

//           // Merge adset data with additional breakdown details
//           const formattedAdsets = adsetDetails.map((adset) => ({
//             name: adset.name || "N/A",
//             level: "Adset",
//             budget: adset?.daily_budget
//               ? `${parseInt(adset?.daily_budget) / 100} `
//               : adset?.budget_remaining
//               ? `${parseInt(adset?.budget_remaining) / 100} (Remaining Budget)`
//               : "N/A",
//           }));

//           const campaigns =
//             adsetsData.map((adset) => ({
//               name: campaignResponse.data?.name || "N/A", // Campaign name
//               level: "Campaign",
//               budget:
//                 adset?.campaign?.insights?.data?.reduce((total, insight) => {
//                   return total + (parseFloat(insight.spend) || 0);
//                 }, 0) || "N/A",
//             })) || [];

//           setData([...formattedAdsets]);
//           // setData([...campaigns, ...formattedAdsets]);

//           setBudgetDate(
//             selected?.created_time
//               ? new Date(selected?.created_time).toLocaleDateString("en-GB")
//               : ""
//           );
//         } catch (error) {
//           console.error("Error Details:", error);
//           setErrorMessage(
//             error.response?.data?.error?.message ||
//               error.message ||
//               "Failed to fetch data"
//           );
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [isOpen]);

//   const uniqueCampaignsWithBudget = selected?.adsets?.data.reduce((acc, adset) => {
//     const campaign = adset?.campaign;

//     // Campaign budget
//     const campaignBudget = campaign?.daily_budget
//       ? parseInt(campaign.daily_budget, 10) / 100
//       : null; // Convert to integer and handle null

//     // Adset budget
//     const adsetBudget = adset?.daily_budget
//       ? parseInt(adset.daily_budget, 10) / 100
//       : null; // Convert to integer and handle null

//     // Add campaign only if it has a budget and is not already added
//     if (campaignBudget && !acc.some((item) => item.id === campaign.id)) {
//       acc.push({
//         id: campaign.id,
//         name: campaign.name || "No Campaign Name",
//         budget: campaignBudget,
//       });
//     }

//     // Add adset only if it has a budget
//     if (adsetBudget) {
//       acc.push({
//         id: `adset-${adset.id}`, // Unique ID for adset
//         name: adset.name || "No Adset Name",
//         budget: adsetBudget,
//       });
//     }

//     return acc;
//   }, []);

//   console.log("selected name", selected?.adsets?.data[0]);
//   console.log("selected name", selected?.adsets);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={selected ? `View ${Name}` : `Add ${Name}`}
//     >
//       <div className="modal-body-content max-h-[60vh] overflow-y-auto p-4">
//         <div className="modal-label">
//           <h2 className="py-2">
//             {selected
//               ? `Budget Details for ${selected.name}`
//               : "No Budget Details"}
//           </h2>
//           <p className="py-2">
//             {selected ? `Budget id ${selected.id}` : "No Budget Details"}
//           </p>
//           <p>
//             {selected ? (
//               <div>
//                 {Array.isArray(selected.adsets?.data) &&
//                 selected.adsets.data.length > 0 ? (
//                   <table className="table-auto w-full">
//                     <thead>
//                       <tr className="bg-gray-800 text-white text-left">
//                         <th className="border border-gray-400 px-4 py-2">
//                           Source
//                         </th>
//                         <th className="border border-gray-400 px-4 py-2">
//                           Budget
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uniqueCampaignsWithBudget.map((item, index) => (
//                         <tr key={index} className="text-center">
//                           <td className="border border-gray-400 px-4 py-2">
//                             {item.name}
//                           </td>
//                           <td className="border border-gray-400 px-4 py-2">
//                             {item.budget}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p>No adsets available.</p>
//                 )}
//               </div>
//             ) : (
//               <p>No details available.</p>
//             )}
//           </p>

//           {/* Render other details as needed */}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default DetailsModal;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "./Modal";
import { ApiTokenContext } from "../../context/Apicontext";

const DetailsModal = ({
  Name,
  isOpen,
  onClose,
  selected,
  endpoint,
  onSuccess,
  paginatedDetails,
}) => {
  const uniqueCampaignsWithBudget = selected?.adsets?.data.reduce(
    (acc, adset) => {
      const campaign = adset?.campaign;

      // Campaign budget
      const campaignBudget = campaign?.daily_budget
        ? parseInt(campaign.daily_budget, 10) / 100
        : null; // Convert to integer and handle null

      // Adset budget
      const adsetBudget = adset?.daily_budget
        ? parseInt(adset.daily_budget, 10) / 100
        : null; // Convert to integer and handle null

      // Add campaign only if it has a budget and is not already added
      if (campaignBudget && !acc.some((item) => item.id === campaign.id)) {
        acc.push({
          id: campaign.id,
          name: campaign.name || "No Campaign Name",
          budget: campaignBudget,
        });
      }

      // Add adset only if it has a budget
      if (adsetBudget) {
        acc.push({
          id: `adset-${adset.id}`, // Unique ID for adset
          name: adset.name || "No Adset Name",
          budget: adsetBudget,
        });
      }

      return acc;
    },
    []
  );

  console.log("selected name", selected?.adsets?.data[0]);
  console.log("selected name", selected?.adsets);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selected ? `View ${Name}` : `Add ${Name}`}
    >
      {/* <div className="modal-body-content max-h-[60vh] overflow-y-auto p-4">
        <div className="modal-label">
          <h2 className="py-2">
            {selected
              ? `Budget Details for ${selected.name}`
              : "No Budget Details"}
          </h2>
          <p className="py-2">
            {selected ? `Budget id ${selected.id}` : "No Budget Details"}
          </p>
          <p>
            {selected ? (
              <div>
                {Array.isArray(selected.adsets?.data) &&
                selected.adsets.data.length > 0 ? (
                  <div className="overflow-x-auto w-full">
                    <table className="table-auto w-full min-w-full">
                      <thead>
                        <tr className="bg-gray-800 text-white text-left">
                          <th className="border border-gray-400 px-4 py-2">
                            Ads Name
                          </th>
                          <th className="border border-gray-400 px-4 py-2">
                            Adset Name
                          </th>
                          <th className="border border-gray-400 px-4 py-2">
                            Campaign Name
                          </th>
                          <th className="border border-gray-400 px-4 py-2">
                            Status
                          </th>
                          <th className="border border-gray-400 px-4 py-2">
                            Expense
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.adsets.data.map((adset, index) =>
                          adset.ads.data.map((ad, adIndex) => (
                            <tr
                              key={`${index}-${adIndex}`}
                              className="text-center"
                            >
                              <td className="border border-gray-400 px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                                {ad.name}
                              </td>
                              <td className="border border-gray-400 px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                                {adset.name}
                              </td>
                              <td className="border border-gray-400 px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                                {adset.campaign.name}
                              </td>
                              <td className="border border-gray-400 px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                                {adset.status}
                              </td>
                              <td className="border border-gray-400 px-4 py-2 text-sm sm:text-base whitespace-nowrap">
                                {adset.insights?.data.length > 0
                                  ? Math.ceil(adset.insights.data[0].spend)
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No adsets available.</p>
                )}
              </div>
            ) : null}
          </p>

        
        </div>
      </div> */}

      {Name === "Budget" ? (
        <>
          {selected ? (
            <div>
              {Array.isArray(selected.adsets?.data) &&
              selected.adsets.data.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-gray-800 text-white text-left">
                      <th className="border border-gray-400 px-4 py-2">
                        Source
                      </th>
                      <th className="border border-gray-400 px-4 py-2">
                        Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueCampaignsWithBudget.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 px-4 py-2">
                          {item.name}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          {item.budget}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No adsets available.</p>
              )}
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </>
      ) : null}

      {Name === "Expense" ? (
        <>
         <div className="overflow-x-auto w-full">
  <table className="table-auto w-full">
    <thead>
      <tr className="bg-gray-800 text-white text-left">
        <th className="border border-gray-400 px-4 py-2 whitespace-nowrap">
          Ads Name
        </th>
        <th className="border border-gray-400 px-4 py-2 whitespace-nowrap">
          Adset Name
        </th>
        <th className="border border-gray-400 px-4 py-2 whitespace-nowrap">
          Campaign Name
        </th>
        <th className="border border-gray-400 px-4 py-2 whitespace-nowrap">
          Status
        </th>
        <th className="border border-gray-400 px-4 py-2 whitespace-nowrap">
          Expense
        </th>
      </tr>
    </thead>
    <tbody>
      {selected?.adsets?.data.map((adset, index) =>
        adset?.ads?.data.map((ad, adIndex) => (
          <tr key={`${index}-${adIndex}`} className="text-center">
            <td className="border border-gray-400 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base truncate">
              {ad.name}
            </td>
            <td className="border border-gray-400 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base truncate">
              {adset.name}
            </td>
            <td className="border border-gray-400 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base truncate">
              {adset.campaign.name}
            </td>
            <td className="border border-gray-400 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base truncate">
              {adset.status}
            </td>
            <td className="border border-gray-400 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base truncate">
              {adset.insights?.data.length > 0
                ? Math.ceil(adset.insights.data[0].spend)
                : "N/A"}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

        </>
      ) : null}
    </Modal>
  );
};

export default DetailsModal;
