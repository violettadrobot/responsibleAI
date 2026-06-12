import express from 'express';
import { submitToGoogleSheet } from '../services/googleSheetsService.js';
import { sendConfirmationEmail } from '../services/emailService.js';

const router = express.Router();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateSignupData = (data) => {
  const errors = [];

  if (!data.firstName || data.firstName.trim() === '') {
    errors.push('First name is required');
  }
  if (!data.lastName || data.lastName.trim() === '') {
    errors.push('Last name is required');
  }
  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Email format is invalid');
  }
  if (!data.companyName || data.companyName.trim() === '') {
    errors.push('Company name is required');
  }

  return errors;
};

router.post('/signups', async (req, res) => {
  try {
    const { firstName, lastName, email, companyName } = req.body;

    // Validate input
    const validationErrors = validateSignupData({
      firstName,
      lastName,
      email,
      companyName
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Prepare attendee name
    const attendeeName = `${firstName.trim()} ${lastName.trim()}`;

    // Submit to Google Sheet
    const googleSheetId = process.env.GOOGLE_SHEETS_ID;
    if (googleSheetId) {
      try {
        await submitToGoogleSheet({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          companyName: companyName.trim()
        }, googleSheetId);
      } catch (error) {
        console.error('Failed to save to Google Sheet:', error);
      }
    }

    // Send confirmation email
    const teamsLink = process.env.TEAMS_MEETING_LINK;
    if (!teamsLink) {
      return res.status(500).json({
        success: false,
        error: 'Teams meeting link is not configured'
      });
    }

    await sendConfirmationEmail(attendeeName, email.trim(), teamsLink);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Registration successful! Check your email for the Teams meeting link.',
      data: {
        name: attendeeName,
        email: email.trim(),
        company: companyName.trim()
      }
    });
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process registration'
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event signup API is running' });
});

export default router;
