// const Budget = require("../models/Budget");
// const mongoose = require('mongoose');



// const createBudgetData = async (req, res) => {
//   try {
   
//       const budgets = req.body;
//       // Validate that the incoming request body is an array
//       if (!Array.isArray(budgets)) {
//           return res.status(400).json({ error: "Invalid data format. Expected an array of budgets." });
//       }

//       for (const budget of budgets) {
//           // Check if a budget with the same ID already exists
//           const existingBudget = await Budget.findOne({ id: budget.id });

//           if (existingBudget) {
             
//               continue;
//           }

//           // Map the adsets and nested data properly
//           const processedAdsets = budget.adsets?.data?.map((adset) => ({
//               id: adset.id || null,
//               daily_budget: Number(adset.daily_budget) || 0,
//               lifetime_budget: Number(adset.lifetime_budget) || 0,
//               budget_remaining: Number(adset.budget_remaining) || 0,
//               status: adset.status || "UNKNOWN",
//               name: adset.campaign?.name || "Unknown Campaign",
//               insights: {
//                   data: adset.insights?.data?.map((insight) => ({
//                       spend: Number(insight.spend) || 0,
//                       date_start: insight.date_start || null,
//                       date_stop: insight.date_stop || null,
//                   })) || [],
//                   paging: {
//                       cursors: {
//                           before: adset.insights?.paging?.cursors?.before || null,
//                           after: adset.insights?.paging?.cursors?.after || null,
//                       },
//                   },
//               },
//               campaign: {
//                   id: adset.campaign?.id || null,
//                   name: adset.campaign?.name || "Unknown Campaign",
//                   daily_budget: adset.campaign?.daily_budget || "Unknown daily_budget",
//               },
//               ads: {
//                   data: adset.ads?.data?.map((ad) => ({
//                       id: ad.id || null,
//                       name: ad.name || "Unknown Ad",
//                   })) || [],
//                   paging: {
//                       cursors: {
//                           before: adset.ads?.paging?.cursors?.before || null,
//                           after: adset.ads?.paging?.cursors?.after || null,
//                       },
//                   },
//               },
//           })) || [];

//           // Prepare the final budget object to be saved
//           const processedBudget = {
//               id: budget.id || null,
//               name: budget.name || "Unknown Budget",
//               created_time: budget.created_time || null,
//               adsets: processedAdsets,
//           };

//           // Save the processed budget data
//           await Budget.create(processedBudget);
        
//       }

//       res.status(200).json({ message: "Budgets saved successfully!" });
//   } catch (error) {
//       console.error("Error saving Budgets:", error);
//       res.status(500).json({ error: "Failed to save budgets" });
//   }
// };


  
  
//   const getBudgetData = async (req, res) => {
//     try {
//         const { selectedAccount } = req.params;
     

//         // Ensure that selectedAccount is a valid string before querying MongoDB
//         if (typeof selectedAccount !== 'string') {
//             return res.status(400).json({ message: "Invalid account ID format" });
//         }

//         // Proceed with the query using the string account field
//         const budget = await Budget.find({ id: selectedAccount });

     

//         if (budget.length === 0) {
//             return res.status(404).json({ message: "No budget found" });
//         }

//         res.status(200).json(budget);
//     } catch (error) {
//         console.error("Error fetching Budget:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

  
  
  

// module.exports = {
//   createBudgetData,
//   getBudgetData,
// };


const Budget = require("../models/Budget");
const mongoose = require('mongoose');



const createBudgetData = async (req, res) => {
  try {
   
      const budgets = req.body;
      // Validate that the incoming request body is an array
      if (!Array.isArray(budgets)) {
          return res.status(400).json({ error: "Invalid data format. Expected an array of budgets." });
      }

      for (const budget of budgets) {
          // Check if a budget with the same ID already exists
          const existingBudget = await Budget.findOne({ id: budget.id });

          if (existingBudget) {
             
              continue;
          }

          // Map the adsets and nested data properly
          const processedAdsets = budget.adsets?.data?.map((adset) => ({
              id: adset.id || null,
              daily_budget: Number(adset.daily_budget) || 0,
              lifetime_budget: Number(adset.lifetime_budget) || 0,
              budget_remaining: Number(adset.budget_remaining) || 0,
              status: adset.status || "UNKNOWN",
              name: adset.campaign?.name || "Unknown Campaign",
              insights: {
                  data: adset.insights?.data?.map((insight) => ({
                      spend: Number(insight.spend) || 0,
                      date_start: insight.date_start || null,
                      date_stop: insight.date_stop || null,
                  })) || [],
                  paging: {
                      cursors: {
                          before: adset.insights?.paging?.cursors?.before || null,
                          after: adset.insights?.paging?.cursors?.after || null,
                      },
                  },
              },
              campaign: {
                  id: adset.campaign?.id || null,
                  name: adset.campaign?.name || "Unknown Campaign",
                  daily_budget: adset.campaign?.daily_budget || "Unknown daily_budget",
              },
              ads: {
                  data: adset.ads?.data?.map((ad) => ({
                      id: ad.id || null,
                      name: ad.name || "Unknown Ad",
                  })) || [],
                  paging: {
                      cursors: {
                          before: adset.ads?.paging?.cursors?.before || null,
                          after: adset.ads?.paging?.cursors?.after || null,
                      },
                  },
              },
          })) || [];

          // Prepare the final budget object to be saved
          const processedBudget = {
              id: budget.id || null,
              name: budget.name || "Unknown Budget",
              created_time: budget.created_time || null,
              adsets: processedAdsets,
          };

          // Save the processed budget data
          await Budget.create(processedBudget);
        
      }

      res.status(200).json({ message: "Budgets saved successfully!" });
  } catch (error) {
      console.error("Error saving Budgets:", error);
      res.status(500).json({ error: "Failed to save budgets" });
  }
};


  
  
  const getBudgetData = async (req, res) => {
    try {
        const { selectedAccount } = req.params;
     

        // Ensure that selectedAccount is a valid string before querying MongoDB
        if (typeof selectedAccount !== 'string') {
            return res.status(400).json({ message: "Invalid account ID format" });
        }

        // Proceed with the query using the string account field
        const budget = await Budget.find({ id: selectedAccount });

     

        if (budget.length === 0) {
            return res.status(404).json({ message: "No budget found" });
        }

        res.status(200).json(budget);
    } catch (error) {
        console.error("Error fetching Budget:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  
  
  

module.exports = {
  createBudgetData,
  getBudgetData,
};


