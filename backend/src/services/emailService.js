import axios from 'axios';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Generate ICS calendar file
const generateCalendarInvite = (teamsLink) => {
  // June 10, 2026, 12:00 PM - 1:00 PM EST
  const startTime = '20260610T120000';
  const endTime = '20260610T130000';

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Workshop Registration//Responsible AI in HR//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${Date.now()}@workshop-registration.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:Responsible AI in HR: From Hype to Accountability
DESCRIPTION:Join us for a hands-on workshop on responsible AI in HR.\\n\\nTeams Link: ${teamsLink}
LOCATION:Microsoft Teams (Virtual)
ORGANIZER;CN=Violetta Drobot:mailto:violettadrobot@gmail.com
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return Buffer.from(icsContent).toString('base64');
};

export const sendConfirmationEmail = async (attendeeName, email, teamsLink) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.SENDER_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || 'Workshop Registration';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a5568; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; margin-top: 20px; }
          .section { margin: 20px 0; }
          .button { display: inline-block; background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to the Workshop!</h1>
            <p>Responsible AI in HR: From Hype to Accountability</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Hi ${attendeeName},</p>
              <p>Thank you for registering for <strong>"Responsible AI in HR: From Hype to Accountability"</strong>! We're excited to have you join us for this hands-on, practical workshop.</p>
            </div>

            <div class="section">
              <h3>Workshop Details:</h3>
              <ul>
                <li><strong>Workshop:</strong> Responsible AI in HR: From Hype to Accountability</li>
                <li><strong>Format:</strong> Virtual (Microsoft Teams)</li>
                <li><strong>What You'll Learn:</strong> Real governance frameworks, risk identification, and practical accountability strategies</li>
              </ul>
            </div>

            <div class="section">
              <h3>Join the Workshop:</h3>
              <p>Click the link below to join the Microsoft Teams meeting:</p>
              <a href="${teamsLink}" class="button">Join Teams Meeting</a>
            </div>

            <div class="section">
              <p>If you have any questions before the workshop, please don't hesitate to reach out.</p>
              <p>We look forward to seeing you there!</p>
            </div>

            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const calendarBase64 = generateCalendarInvite(teamsLink);

    const response = await axios.post(
      BREVO_API_URL,
      {
        to: [{ email, name: attendeeName }],
        subject: 'Confirmation: Responsible AI in HR Workshop',
        htmlContent: htmlContent,
        sender: {
          email: fromEmail,
          name: fromName
        },
        attachment: [
          {
            content: calendarBase64,
            name: 'workshop-invite.ics'
          }
        ]
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Email sent successfully to:', email);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send confirmation email');
  }
};
