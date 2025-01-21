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
const dmpRoute = require('./routes/dmpRoute.js'); 


const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://lead-management.parmarketing.co.in"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  preflightContinue: false,
};

app.use(cors(corsOptions));

connectDB();


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

app.use('/leads',leadsRoute)
app.use('/api/dmp',dmpRoute)

const fetch = require('node-fetch');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 86400 }); 

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
    return res.json(cachedData); 
  }

  try {
    let allData = [];
    let nextPageUrl = url; 

    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });

      if (!response.ok) {
        return res.status(response.status).send(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data) {
        allData = [...allData, ...data.data]; 
      }

      nextPageUrl = data.info?.more_records ? data.info?.next_page_url : null;
    }

    cache.set(cacheKey, allData); 
    res.json(allData); 
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

app.get("/test", (req,res) => {
  res.send("PM Dashboard")
})



// Server
const PORT = 8013;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
