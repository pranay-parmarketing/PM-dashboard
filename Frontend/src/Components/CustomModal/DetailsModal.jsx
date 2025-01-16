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


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selected ? `View ${Name}` : `Add ${Name}`}
    >
     

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
