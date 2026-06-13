import { google } from 'googleapis';

export const submitToGoogleSheet = async (formData, spreadsheetId) => {
  try {
    console.log('Starting Google Sheets submission...');
    console.log('Form data:', formData);
    const credsString = process.env.GOOGLE_SHEETS_CREDENTIALS || '{}';
    console.log('Credentials loaded, parsing JSON...');

    const credentials = JSON.parse(credsString);
    console.log('Credentials parsed successfully');

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('Auth initialized');

    const sheets = google.sheets({ version: 'v4', auth });

    // Build row data with available fields in order
    const rowData = [
      formData.firstName || '',
      formData.lastName || '',
      formData.email || '',
      formData.services || formData.companyName || '',
      formData.message || '',
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    ];

    const values = [rowData];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    console.log('Data saved to Google Sheet');
    return { success: true };
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return { success: false, error: error.message };
  }
};
