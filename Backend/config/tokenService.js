const axios = require("axios");

let zohoToken = null; // Memory me store karna taaki baar-baar API hit na ho

const getZohoToken = async () => {
    if (zohoToken) {
        return zohoToken;
    }

    try {
        console.log("Fetching new Zoho token...");
        const response = await axios.get("https://api.singledebt.in/token");

        // Check if token is received
        const newToken = response?.data?.token[0]?.token;
        if (!newToken) {
            throw new Error("No token received from API.");
        }

        zohoToken = newToken;

        // Token ko expire hone se pehle refresh karne ke liye timeout set karenge (4.8 mins)
        setTimeout(() => {
            zohoToken = null;
        }, 870 * 1000);

        return zohoToken;
    } catch (error) {
        console.error("Error fetching Zoho token:", error.message);
        throw new Error("Failed to fetch Zoho token");
    }
};

module.exports = { getZohoToken };
