import axios from 'axios';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Generate ICS calendar file with Eastern Time timezone
const generateCalendarInvite = (teamsLink) => {
  // June 24, 2026, 12:00 PM - 1:00 PM Eastern Time (EDT)
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Workshop Registration//Responsible AI in HR//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${Date.now()}@workshop-registration.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;TZID=America/New_York:20260624T120000
DTEND;TZID=America/New_York:20260624T130000
SUMMARY:Practical AI for HR 101: Prompt Engineering
DESCRIPTION:Learn how to write prompts that actually work.\\n\\nTeams Link: ${teamsLink}\\n\\nTime: 12:00 PM - 1:00 PM Eastern Time
LOCATION:Microsoft Teams (Virtual)
ORGANIZER;CN=Violetta Drobot:mailto:violettadrobot@gmail.com
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return Buffer.from(icsContent).toString('base64');
};

export const sendConfirmationEmail = async (attendeeName, email, teamsLink, emailType = 'signup', contactData = null) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.SENDER_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || 'Violetta Drobot';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  let htmlContent;
  let subject;
  let attachment = [];

  if (emailType === 'contact') {
    subject = 'We received your message';
    const servicesText = contactData?.services || 'Not specified';
    const messageText = contactData?.message || 'No message provided';

    htmlContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

            body { font-family: 'Inter', sans-serif; color: #b8c5d6; line-height: 1.6; background-color: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; padding: 0; }
            .header { background-color: #0f172a; color: white; padding: 40px 20px; text-align: center; border-bottom: 2px solid #00d4ff; }
            .header h1 { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 400; margin: 0 0 12px 0; letter-spacing: 0px; color: #00d4ff; line-height: 1.2; }
            .content { padding: 40px 20px; background-color: #0f172a; }
            .section { margin: 25px 0; }
            .section h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 400; color: #00d4ff; margin: 20px 0 12px 0; letter-spacing: 0.3px; }
            .section p { font-size: 14px; color: #b8c5d6; margin: 10px 0; line-height: 1.6; }
            .data-box { background: rgba(0, 212, 255, 0.1); padding: 15px; border-left: 4px solid #00d4ff; border-radius: 4px; margin: 15px 0; }
            .data-label { font-weight: 600; color: #00d4ff; font-size: 13px; }
            .data-value { color: #b8c5d6; font-size: 14px; margin-top: 5px; word-wrap: break-word; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0, 212, 255, 0.2); font-size: 12px; color: #8b98b0; text-align: center; }
            .divider { height: 1px; background-color: rgba(0, 212, 255, 0.2); margin: 25px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You</h1>
            </div>

            <div class="content">
              <div class="section">
                <p>Hi ${attendeeName},</p>
                <p>Thank you for reaching out! We received your message and appreciate your interest in working together.</p>
              </div>

              <div class="divider"></div>

              <div class="section">
                <h3>Your Inquiry Details</h3>
                <div class="data-box">
                  <div class="data-label">Name</div>
                  <div class="data-value">${contactData?.firstName || ''} ${contactData?.lastName || ''}</div>
                </div>
                <div class="data-box">
                  <div class="data-label">Email</div>
                  <div class="data-value">${contactData?.email || ''}</div>
                </div>
                <div class="data-box">
                  <div class="data-label">Services Interested In</div>
                  <div class="data-value">${servicesText}</div>
                </div>
                <div class="data-box">
                  <div class="data-label">Message</div>
                  <div class="data-value">${messageText}</div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="section">
                <h3>What's Next</h3>
                <p>Our team will review your inquiry and get back to you within 1-2 business days with next steps.</p>
              </div>

              <div class="section">
                <p>If you have any urgent questions in the meantime, feel free to reach out directly.</p>
              </div>

              <div class="footer">
                <p style="margin: 0;">This is an automated confirmation. Please do not reply to this email.</p>
                <p style="margin: 10px 0 0 0; font-size: 11px;">We respect your privacy. Your information is used solely for contact and communication purposes.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    // signup email
    subject = 'Confirmation: Responsible AI in HR Workshop';
    const calendarBase64 = generateCalendarInvite(teamsLink);
    attachment = [
      {
        content: calendarBase64,
        name: 'workshop-invite.ics'
      }
    ];
    htmlContent = `
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
            <h1>Practical AI for HR 101</h1>
            <p>Prompt Engineering</p>
          </div>

          <div class="content">
            <div class="section">
              <p>Hello ${attendeeName},</p>
              <p>Thank you for registering for Practical AI for HR 101. We're excited to have you join us as we explore how to write prompts that actually work and save you 10+ hours per week.</p>
            </div>

            <div class="divider"></div>

            <div class="section">
              <h3>Workshop Details</h3>
              <p><strong>Title:</strong> Practical AI for HR 101: Prompt Engineering</p>
              <p><strong>Format:</strong> Virtual via Microsoft Teams</p>
              <p><strong>Date & Time:</strong> June 24, 2026 • 12:00 PM – 1:00 PM Eastern Time</p>
              <p><strong>Duration:</strong> 60 minutes (45 minutes of material + 15 minutes Q&A)</p>
            </div>

            <div class="section">
              <h3>What You'll Learn</h3>
              <ul>
                <li>Why most AI prompts fail in HR (and how to fix them)</li>
                <li>Where HR leaders lose the most time: hiring decisions, compensation analysis, survey synthesis</li>
                <li>How to build prompts that work the first time</li>
                <li>A framework to pressure-test your AI outputs today</li>
              </ul>
            </div>

            <div class="section" style="background-color: rgba(0, 212, 255, 0.15); padding: 20px; border-radius: 6px; border-left: 4px solid #00d4ff; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #ffffff;">Join the Workshop</h3>
              <p style="color: #ffffff; font-size: 15px; margin-bottom: 20px; font-weight: 500;">Click the button below to join the Microsoft Teams meeting:</p>
              <center>
                <a href="${teamsLink}" class="button">Join Teams Meeting</a>
              </center>
              <p style="font-size: 14px; color: #ffffff; margin-top: 20px; margin-bottom: 8px; font-weight: 500;">Or copy and paste this link in your browser:</p>
              <p style="font-size: 11px; color: #b8c5d6; margin-top: 15px; margin-bottom: 8px;">Full link:</p>
              <a href="${teamsLink}" style="display: block; font-size: 12px; color: #00d4ff; background-color: rgba(0, 0, 0, 0.5); padding: 12px; border-radius: 4px; border: 1px solid #00d4ff; text-decoration: none; font-family: 'Courier New', monospace; word-break: break-all; line-height: 1.4;">${teamsLink}</a>
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
  }

  try {
    const emailPayload = {
      to: [{ email, name: attendeeName }],
      subject: subject,
      htmlContent: htmlContent,
      sender: {
        email: fromEmail,
        name: fromName
      }
    };

    if (attachment.length > 0) {
      emailPayload.attachment = attachment;
    }

    const response = await axios.post(
      BREVO_API_URL,
      emailPayload,
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
