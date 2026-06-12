import { google } from 'googleapis';

const sheets = google.sheets('v4');

export const submitToGoogleSheet = async (formData, spreadsheetId, range = 'Sheet1!A:E') => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const request = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          formData.firstName || '',
          formData.lastName || '',
          formData.email || '',
          formData.companyName || '',
          new Date().toISOString()
        ]],
      },
      auth: auth,
    };

    const response = await sheets.spreadsheets.values.append(request);

    console.log('Successfully submitted to Google Sheet');
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error.message);
    return { success: false, error: error.message };
  }
};
