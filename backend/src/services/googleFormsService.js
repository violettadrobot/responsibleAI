import axios from 'axios';

export const submitToGoogleForm = async (formData) => {
  const formUrl = process.env.GOOGLE_FORM_URL;
  const entryIdsJson = process.env.GOOGLE_FORM_ENTRY_IDS;

  if (!formUrl) {
    throw new Error('GOOGLE_FORM_URL is not configured');
  }

  if (!entryIdsJson) {
    throw new Error('GOOGLE_FORM_ENTRY_IDS is not configured');
  }

  try {
    const entryIds = JSON.parse(entryIdsJson);

    // Create FormData object for Google Forms submission
    const params = new URLSearchParams();

    if (formData.firstName && entryIds.firstName) {
      params.append(entryIds.firstName, formData.firstName);
    }
    if (formData.lastName && entryIds.lastName) {
      params.append(entryIds.lastName, formData.lastName);
    }
    if (formData.email && entryIds.email) {
      params.append(entryIds.email, formData.email);
    }
    if (formData.companyName && entryIds.companyName) {
      params.append(entryIds.companyName, formData.companyName);
    }

    // Submit to Google Form
    const response = await axios.post(formUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Successfully submitted to Google Form');
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Google Form:', error.message);
    // Log the error but don't throw - we still want to send the confirmation email
    // even if Google Forms submission fails
    return { success: false, error: error.message };
  }
};
