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

const validateContactData = (data) => {
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
  if (!data.message || data.message.trim() === '') {
    errors.push('Message is required');
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

router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, services, message } = req.body;

    // Validate input
    const validationErrors = validateContactData({
      firstName,
      lastName,
      email,
      message
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Prepare contact name
    const contactName = `${firstName.trim()} ${lastName.trim()}`;
    const servicesList = Array.isArray(services) ? services.join(', ') : '';

    // Submit to Google Sheet
    const contactGoogleSheetId = process.env.GOOGLE_SHEETS_CONTACT_ID;
    if (contactGoogleSheetId) {
      try {
        await submitToGoogleSheet({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          services: servicesList,
          message: message.trim()
        }, contactGoogleSheetId);
      } catch (error) {
        console.error('Failed to save contact to Google Sheet:', error);
      }
    }

    // Send confirmation email with contact data
    await sendConfirmationEmail(contactName, email.trim(), null, 'contact', {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      services: servicesList,
      message: message.trim()
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Thank you! We received your message and will get back to you soon.',
      data: {
        name: contactName,
        email: email.trim(),
        services: servicesList,
        message: message.trim()
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process contact form'
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event signup API is running' });
});

export default router;
