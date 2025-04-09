// Next.js API route to proxy requests to external API
// This bypasses CORS issues by making the request server-side

import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(200).end();
  }

  try {
    // Make request to external API
    const response = await axios.get('https://schbangbotreal.vercel.app/api/getMainData');
    
    // Return the data from the external API
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying API request:', error);
    return res.status(500).json({ 
      message: 'Error fetching data from external API',
      error: error.message 
    });
  }
}
