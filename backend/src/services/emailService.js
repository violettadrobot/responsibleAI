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
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

          body { font-family: 'Inter', sans-serif; color: #b8c5d6; line-height: 1.6; background-color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; padding: 0; }
          .header { background-color: #0f172a; color: white; padding: 40px 20px; text-align: center; border-bottom: 2px solid #00d4ff; }
          .header h1 { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 400; margin: 0 0 12px 0; letter-spacing: 0px; color: #00d4ff; line-height: 1.2; }
          .header p { font-size: 24px; margin: 0; color: #7c3aed; font-weight: 500; font-family: 'Playfair Display', serif; letter-spacing: 0px; }
          .content { padding: 40px 20px; background-color: #0f172a; }
          .section { margin: 25px 0; }
          .section h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 400; color: #00d4ff; margin: 20px 0 12px 0; letter-spacing: 0.3px; }
          .section p { font-size: 14px; color: #b8c5d6; margin: 10px 0; line-height: 1.6; }
          .section ul { list-style: none; padding: 0; margin: 12px 0; }
          .section li { font-size: 14px; color: #b8c5d6; margin: 8px 0; padding-left: 20px; position: relative; }
          .section li:before { content: "▸"; position: absolute; left: 0; color: #7c3aed; font-weight: bold; }
          .button { display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: 800; font-size: 16px; border: 3px solid #ffffff; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4); }
          .button:hover { opacity: 0.95; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0, 212, 255, 0.2); font-size: 12px; color: #8b98b0; text-align: center; }
          .divider { height: 1px; background-color: rgba(0, 212, 255, 0.2); margin: 25px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Responsible AI in HR</h1>
            <p>From Hype to Accountability</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Hello ${attendeeName},</p>
              <p>Thank you for registering for our workshop on Responsible AI in HR. We're pleased to confirm your spot and look forward to exploring practical frameworks for ethical AI governance with you.</p>
            </div>

            <div class="divider"></div>

            <div class="section">
              <h3>Workshop Details</h3>
              <p><strong>Title:</strong> Responsible AI in HR: From Hype to Accountability</p>
              <p><strong>Format:</strong> Virtual via Microsoft Teams</p>
              <p><strong>Date & Time:</strong> June 10, 2026 • 12:00 PM – 1:00 PM EST</p>
              <p><strong>Duration:</strong> 60 minutes</p>
            </div>

            <div class="section">
              <h3>What You'll Learn</h3>
              <ul>
                <li>Why AI implementations fail in HR—and what really matters</li>
                <li>Critical risk areas: hiring, compensation, performance management, and employee surveys</li>
                <li>How to build accountability frameworks that stick</li>
                <li>A practical pressure-testing framework you can apply immediately</li>
              </ul>
            </div>

            <div class="section" style="background-color: rgba(0, 212, 255, 0.15); padding: 20px; border-radius: 6px; border-left: 4px solid #00d4ff; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #ffffff;">Join the Workshop</h3>
              <p style="color: #ffffff; font-size: 15px; margin-bottom: 20px; font-weight: 500;">Click the button below to join the Microsoft Teams meeting:</p>
              <center>
                <a href="${teamsLink}" class="button">Join Teams Meeting</a>
              </center>
              <p style="font-size: 14px; color: #ffffff; margin-top: 20px; margin-bottom: 8px; font-weight: 500;">Or copy and paste this link in your browser:</p>
              <p style="font-size: 12px; color: #ffffff; margin-top: 0; background-color: rgba(0, 0, 0, 0.5); padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; border: 1px solid #00d4ff; overflow-wrap: break-word; white-space: normal;">${teamsLink}</p>
            </div>

            <div class="section">
              <p>If you have any questions or need technical support before the workshop, please reach out to us directly.</p>
            </div>

            <div class="footer">
              <p style="margin: 0;">This is an automated confirmation. Please do not reply to this email.</p>
              <p style="margin: 10px 0 0 0; font-size: 11px;">We respect your privacy. Your information is used solely for event communication.</p>
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
