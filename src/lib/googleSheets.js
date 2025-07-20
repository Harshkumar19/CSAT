const { google } = require('googleapis');
const path = require('path');

// Path to your service account key file
const KEYFILEPATH = path.join(process.cwd(), 'service-account.json');

// The ID of your Google Sheet
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || 'your_google_sheet_id_here';

// Sheet configurations
const SHEETS_CONFIG = {
  TECH: {
    name: 'TECH',
    range: 'TECH!A1:Z',
    headers: [
      'Whatsapp Number',
      'UIUX Satisfaction',
      'Timely Execution',
      'Technical Support',
      'Team Transparency',
      'Team Collaboration',
      'Feedback Response',
      'Overall Satisfaction',
      'Business Alignment',
      'Overall Effectiveness',
      'Team Proactivity',
      'System Integration',
      'Likelihood To Recommend',
      'CreatedAt',
      'Additional Comments'
    ]
  },
  MEDIA: {
    name: 'MEDIA',
    range: 'MEDIA!A1:Z',
    headers: [
      'Whatsapp Number',
      'Overall Satisfaction',
      'Likelihood To Recommend',
      'Strategy Aligment',
      'Team Proactivity',
      'Creative Refreshment',
      'Team Collabration',
      'Optimization Effectiveness',
      'Timely Execution',
      'Team Transparency',
      'Feedback Response',
      'Overall Effectiness',
      'CreatedAt',
      'Additional Comments'
    ]
  },
  SOLUTIONS: {
    name: 'SOLUTIONS',
    range: 'SOLUTIONS!A1:Z',
    headers: [
      'Whatsapp Number',
      'Overall Satisfaction',
      'Likelihood To Recommend',
      'North Star Metrics',
      'Senior LeaderShip Involvement',
      'Strategy Execution',
      'Team Collabration',
      'Brand Understanding',
      'Data Effectiveness',
      'Team Proactivity',
      'Meeting Business Goals',
      'CreatedAt',
      'Additional Comments',
      'Brand Name'
    ]
  }
};

async function getGoogleSheetsAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function fetchSheetData(sheetName) {
  try {
    const sheets = await getGoogleSheetsAuth();
    const config = SHEETS_CONFIG[sheetName];
    
    if (!config) {
      throw new Error(`Sheet configuration not found for: ${sheetName}`);
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: config.range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return { headers: config.headers, data: [] };
    }

    // Skip the header row and map data
    const dataRows = rows.slice(1).map(row => {
      const rowData = {};
      config.headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      return rowData;
    });

    return {
      headers: config.headers,
      data: dataRows,
      sheetName: config.name
    };
  } catch (error) {
    console.error(`Error fetching data from ${sheetName}:`, error);
    throw error;
  }
}

async function fetchAllSheetsData() {
  try {
    const [techData, mediaData, solutionsData] = await Promise.all([
      fetchSheetData('TECH'),
      fetchSheetData('MEDIA'),
      fetchSheetData('SOLUTIONS')
    ]);

    return {
      TECH: techData,
      MEDIA: mediaData,
      SOLUTIONS: solutionsData
    };
  } catch (error) {
    console.error('Error fetching all sheets data:', error);
    throw error;
  }
}

module.exports = {
  fetchSheetData,
  fetchAllSheetsData,
  SHEETS_CONFIG
};
