import React, { useContext, useEffect, useState } from "react";
import { ApiTokenContext } from "../../context/Apicontext";
import { MONGO_URI } from "../../Variables/Variables";
import axios from "axios";

const Visitor = () => {
  const { appsecret_proof, access_token, selectedAccount } =
    useContext(ApiTokenContext);
  const appSecretProof = appsecret_proof;
  const accessToken = access_token;
  const [loading, setLoading] = useState(false);
  const [mydata, setData] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState([]);

  const saveCampaignData = async (campaignDataArray) => {
    try {
      // Map through the array of campaigns
      const dataToSend = campaignDataArray.map(campaignData => {
        return {
          utmSource: "facebook",              // Platform like facebook
          utmMedium: "social",                // Marketing medium like social
          utmCampaign: campaignData.name,     // Use the campaign name here (e.g., 'RBI Campaign - July')
          account_id: selectedAccount?.id || null, // Use the account_id from the payload
          id:campaignData.id
        };
      });
  
      // Log the mapped data
      console.log("Mapped Data: ", dataToSend);
      console.log("Mapped Data: ", campaignDataArray);
  
      // Send each campaign data to backend
      for (const data of dataToSend) {
        const response = await axios.post(`${MONGO_URI}/api/save-utm`, data);
        console.log('Response from server:', response);
      }
    } catch (error) {
      console.error('Error saving campaign data:', error);
    }
  };
  

  // Function to fetch all campaign data from the API
  const fetchAllCampaignData = async (url) => {
    setLoading(true);
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

  const loadCampaignData = async () => {
    let accountId = null;

    if (typeof selectedAccount === "string") {
      accountId = selectedAccount;
    } else if (typeof selectedAccount === "object") {
      accountId = selectedAccount.id || selectedAccount.accountId;
    }

    if (accountId) {
      const initialUrl = `https://graph.facebook.com/v17.0/act_${accountId}/campaigns?fields=id,name,status,objective,start_time`;
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
  return <div>hi</div>;
};

export default Visitor;
