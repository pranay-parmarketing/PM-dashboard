const crypto = require('crypto');

// Function to generate appsecret_proof using accessToken and appSecret
async function generateAppSecretProof(accessToken, appSecret) {
  // Check if both accessToken and appSecret are provided
  if (!accessToken || !appSecret) {
    throw new Error('Missing access token or app secret');
  }

  // Use HMAC with SHA256 to generate appsecret_proof
  const appSecretProof = crypto
    .createHmac('sha256', appSecret) // HMAC with SHA256 algorithm and appSecret as key
    .update(accessToken) // Hash the access token
    .digest('hex'); // Return the result as a hexadecimal string

  return appSecretProof;
}

// Example of how to use it
const getauthtoken = async (req, res) => {
  const { accessToken } = req.body;
  const appSecret = process.env.FB_APP_SECRET; // Store appSecret in environment variables for security

  if (!accessToken || !appSecret) {
    return res.status(400).json({ message: 'Missing access token or app secret' });
  }

  try {
    const appsecret_proof = await generateAppSecretProof(accessToken, appSecret);  // Await the result
    console.log('appsecret_proof',appsecret_proof);
    
    res.status(200).json({ appsecret_proof });
  } catch (error) {
    console.error('Error generating appsecret_proof:', error);
    res.status(500).json({ message: 'Error generating appsecret_proof' });
  }
}

module.exports = {
  getauthtoken
};
