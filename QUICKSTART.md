# Quick Start Guide

Get the event sign-up page running in 5 minutes.

## 1. Prepare Your Credentials (5 minutes)

### Brevo API Key
1. Sign up at https://www.brevo.com (free)
2. Go to Settings → SMTP & API
3. Copy your API key
4. Note your sender email

### Google Form
1. Create a form with fields: First Name, Last Name, Email, Company Name
2. Get submission URL: Right-click form → Open in new tab → DevTools (F12) → Console:
   ```javascript
   document.querySelector('form').action
   ```
3. Copy the URL (starts with `https://docs.google.com/forms/d/e/...`)
4. Get entry IDs: In DevTools → Elements, find each input's `name="entry.XXXXX"`

### Teams Link
Have your Teams meeting link ready (looks like: `https://teams.microsoft.com/l/meetup-join/...`)

## 2. Backend Setup (2 minutes)

```bash
cd event-signup-page/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials:
# - BREVO_API_KEY
# - TEAMS_MEETING_LINK
# - GOOGLE_FORM_URL
# - GOOGLE_FORM_ENTRY_IDS (JSON format)
# - SENDER_EMAIL

# Start server
npm run dev
```

Server runs on: **http://localhost:3001**

## 3. Frontend Setup (2 minutes)

In another terminal:

```bash
cd event-signup-page/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App opens at: **http://localhost:5173**

## 4. Test It

1. Fill out the form on the page
2. Submit the form
3. Check your email for confirmation with Teams link
4. Check your Google Form for the new entry

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check Brevo API key and SENDER_EMAIL in .env |
| Form not appearing | Make sure backend is running on port 3001 |
| Submission fails | Check browser DevTools Console for error messages |
| CORS error | Verify both servers running on localhost (3001 and 5173) |

## Next Steps

- Customize event details in `EventSignupPage.jsx`
- Update colors/branding in `EventSignupPage.css`
- Deploy frontend to Vercel
- Deploy backend to Render/Railway
- Update VITE_API_URL in frontend .env for production
