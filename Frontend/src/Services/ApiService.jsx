import axios from "axios";
import { REQUESTMETHOD } from "../Utils/Utils";
import { GETALLPAYMENTAPI, GETPAYMENTAPI } from "./ApiConfig.tsx";
import AxiosInstance, { refreshToken } from "./Axios";

// API request function
export const APIREQUEST = async (method, url, data) => {
  try {
    const config = {
      method,
      url,
      data,
    };

    const response = await AxiosInstance(config);

    if (response && response.data) {
      return response?.data; // Returning only `data`
    } else {
      console.log(response, "this is the response ");
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.log("An error occurred:", error);
    throw new Error(error.message || "Unknown Error");
  }
};




// export const GET_PAYMENT_DETAILS_INTEGRATION = async () => {
//   try {
    // const response = await APIREQUEST(REQUESTMETHOD.GET, `${GETPAYMENTAPI}`);
    // console.log("Payment Details:", response);
    // return response; // Return the data received
//   } catch (error) {
//     console.error("Error in Payment Details API:", error);
//     return error; // You might want to handle this differently, e.g., set a default return value
//   }
// };


// API request function to handle pagination
export const GET_PAYMENT_DETAILS_INTEGRATION = async (page, perPage) => {
  try {
    const criteria = '((Payment_Number:equals:1)and(Status:equals:paid))'; // Example criteria
    const encodedCriteria = encodeURIComponent(criteria); // Ensure criteria is encoded
    const url = `https://api.singledebt.in/proxy?url=https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;      
    
    const response = await APIREQUEST(REQUESTMETHOD.GET, url); // Send GET request
    console.log("Payment Details:", response);

    return response; // Return the response from API
  } catch (error) {
    console.error("Error in Payment Details API:", error);
    return { data: [] }; // Return an empty data structure in case of error
  }
};
// 
// export const GET_PAYMENT_DETAILS_INTEGRATION = async () => {
//   const perPage = 200; // Maximum records per page allowed by Zoho API
//   let page = 1; // Start with the first page
//   let allData = []; // Array to store all fetched records
//   const criteria = '((Payment_Number:equals:1)and(Status:equals:paid))'; // Example criteria
//   const encodedCriteria = encodeURIComponent(criteria); // Ensure criteria is encoded

//   try {
//     while (true) {
//       const url = `https://api.singledebt.in/proxy?url=https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=${encodedCriteria}&page=${page}&per_page=${perPage}`;
      
//       const response = await APIREQUEST(REQUESTMETHOD.GET, url); // Fetch data from API
//       console.log(`Page ${page} Response:`, response);

//       const data = response?.data?.data || []; // Get the data array from the response

//       allData = [...allData, ...data]; // Append the fetched data to allData

//       // If fewer records than `perPage` are returned, we've reached the last page
//       if (data.length < perPage) {
//         break;
//       }

//       page++; // Move to the next page
//     }

//     console.log("Total Payment Details Fetched:", allData.length);
//     return allData; // Return all the fetched data
//   } catch (error) {
//     console.error("Error fetching all payment details:", error);
//     return []; // Return an empty array in case of error
//   }
// };
