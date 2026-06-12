import { google } from 'googleapis';

export const submitToGoogleSheet = async (formData, spreadsheetId) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [[
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.companyName,
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    console.log('Data saved to Google Sheet');
    return { success: true };
  } catch (error) {
    console.error('Error saving to Google Sheet:', error.message);
    return { success: false, error: error.message };
  }
};
