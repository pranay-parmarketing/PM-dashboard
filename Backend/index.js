// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes'); 
const saveCampaigns = require('./routes/saveCampaignsRoutes.js'); 
const saveBudget = require('./routes/saveBudgetRoutes.js'); 
const saveExpense = require('./routes/saveExpenseRoutes.js'); 
const saveAdest = require('./routes/saveAdest.js'); 
const saveAds = require('./routes/saveAds.js'); 
const saveToken = require('./routes/saveToken.js'); 
const utmRoutes = require('./routes/utmRoutes.js'); 
const authtokenRoutes = require('./routes/authtoken.js'); 
// 
const leadsRoute = require('./routes/leadsRoute.js'); 


const app = express();

app.use(express.json());

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  preflightContinue: false, // Send response for preflight requests automatically
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/authtoken', authtokenRoutes);
app.use('/api/account', accountRoutes); 
app.use('/api/save-campaigns', saveCampaigns); 
app.use('/api/save-budget', saveBudget); 
app.use('/api/save-expense', saveExpense); 
app.use('/api/save-adset', saveAdest ); 
app.use('/api/save-ads', saveAds ); 
app.use('/api/saveToken',  saveToken); 
app.use('/api', utmRoutes);

// 

app.use('/api/leads',leadsRoute)


// 
// app.get('/custom-proxy', async (req, res) => {
//   const { url } = req.query;
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

//   if (!token) {
//     return res.status(400).send('Authorization token is missing');
//   }

//   try {
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Zoho-oauthtoken ${token}`, // Use the dynamic token
//       },
//     });

//     // Check if the response has content
//     if (!response.ok) {
//       return res.status(response.status).send(`Error fetching data: ${response.statusText}`);
//     }

//     const text = await response.text(); // Read as text first
//     if (text.trim() === '') {
//       return res.status(204).send('No content in response');
//     }

//     const data = JSON.parse(text); // Parse only if text is non-empty
//     res.json(data);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Proxy error');
//   }
// });

// 
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 86400 }); // Cache TTL: 24 hours (86400 seconds)

app.get('/custom-proxy', async (req, res) => {
  const { url } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).send('Authorization token is missing');
  }

  if (!url) {
    return res.status(400).send('URL is required');
  }

  const cacheKey = `${url}:${token}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData); // Return cached data if available
  }

  try {
    let allData = [];
    let nextPageUrl = url; // Start with the initial URL passed in query params

    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });

      if (!response.ok) {
        return res.status(response.status).send(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data) {
        allData = [...allData, ...data.data]; // Accumulate data from all pages
      }

      // Get the next page URL, if available
      nextPageUrl = data.info?.more_records ? data.info?.next_page_url : null;
    }

    cache.set(cacheKey, allData); // Cache the entire data
    res.json(allData); // Return the full data after pagination is done
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Proxy error');
  }
});




// 

app.get('/clear-cache', (req, res) => {
  const { key } = req.query;

  if (key) {
    cache.del(key);
    return res.send(`Cache cleared for key: ${key}`);
  }

  cache.flushAll();
  res.send('All cache cleared.');
});



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
