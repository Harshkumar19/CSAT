const { fetchAllSheetsData, fetchSheetData } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sheet } = req.query;

    if (sheet && ['TECH', 'MEDIA', 'SOLUTIONS'].includes(sheet.toUpperCase())) {
      // Fetch specific sheet data
      const data = await fetchSheetData(sheet.toUpperCase());
      return res.status(200).json(data);
    } else {
      // Fetch all sheets data
      const allData = await fetchAllSheetsData();
      return res.status(200).json(allData);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Error fetching data from Google Sheets',
      error: error.message 
    });
  }
}
