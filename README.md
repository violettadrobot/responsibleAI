# Event Sign-Up Page - Ethical AI for HR Leaders

A professional EventBrite-like sign-up page for the "Ethical AI for HR Leaders" training event. This application allows users to register for the event and automatically receive a confirmation email with the Teams meeting link.

## Features

- **Professional Event Landing Page**: Display event details with highlights and benefits
- **Sign-Up Form**: Collect attendee information (First Name, Last Name, Email, Company)
- **Automatic Data Submission**: Submit registrations to Google Forms automatically
- **Email Confirmations**: Send personalized confirmation emails via Brevo with Teams meeting link
- **Form Validation**: Client-side and server-side validation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error messages and retry options

## Project Structure

```
event-signup-page/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── routes/
│   │   │   └── signups.js      # Signup endpoint
│   │   ├── services/
│   │   │   ├── emailService.js # Brevo email integration
│   │   │   └── googleFormsService.js # Google Forms submission
│   │   ├── middleware/
│   │   │   └── errorHandler.js # Error handling
│   │   └── server.js           # Express server setup
│   ├── package.json
│   ├── .env.example
│   └── .env                    # Local configuration (create this)
└── frontend/                   # React + Vite app
    ├── src/
    │   ├── components/
    │   │   ├── EventSignupPage.jsx
    │   │   └── EventSignupPage.css
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- A Brevo account (free tier available at https://www.brevo.com)
- A Google Form for collecting registrations
- A Teams meeting link

### Step 1: Get Brevo API Key

1. Sign up for a free Brevo account: https://www.brevo.com
2. Go to Settings → SMTP & API
3. Copy your API key
4. Note your sender email address

### Step 2: Create Google Form

1. Create a new Google Form with fields:
   - First Name
   - Last Name
   - Email Address
   - Company Name

2. Get the form submission URL:
   - Right-click on the form
   - Open in a new tab
   - In the browser console (F12), run:
     ```javascript
     document.querySelector('form').action
     ```
   - Copy this URL (it will look like `https://docs.google.com/forms/d/e/.../formResponse`)

3. Get entry IDs for each field:
   - Go to the form's HTML (F12 → Elements)
   - For each input, find its `name="entry.XXXXX"` attribute
   - Create a JSON mapping like:
     ```json
     {
       "firstName": "entry.1234567890",
       "lastName": "entry.9876543210",
       "email": "entry.1111111111",
       "companyName": "entry.2222222222"
     }
     ```

### Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd event-signup-page/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your configuration:
   ```
   BREVO_API_KEY=your_brevo_api_key_here
   TEAMS_MEETING_LINK=https://teams.microsoft.com/l/meetup-join/...
   GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/.../formResponse
   GOOGLE_FORM_ENTRY_IDS={"firstName":"entry.1234","lastName":"entry.5678","email":"entry.9012","companyName":"entry.3456"}
   SENDER_EMAIL=your-email@example.com
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001`

### Step 4: Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd event-signup-page/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173`

## Usage

1. Open http://localhost:5173 in your browser
2. Fill out the sign-up form with test data
3. Click "Register for Event"
4. Verify:
   - Success message appears
   - Email is received at the test email address with Teams link
   - New entry appears in your Google Form

## API Endpoint

### POST /api/signups

Submit a new event registration.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "companyName": "Acme Corp"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful! Check your email for the Teams meeting link.",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## Deployment

### Frontend (Vercel)

1. Push your repository to GitHub
2. Go to https://vercel.com and import your repository
3. Set environment variable: `VITE_API_URL=your_backend_url`
4. Deploy

### Backend (Render or Railway)

1. Create a new service on Render.com or Railway.app
2. Connect your GitHub repository
3. Set environment variables from your `.env` file
4. Deploy

## Testing

### Manual Testing Checklist

- [ ] Load page - displays event information
- [ ] Submit empty form - shows validation errors
- [ ] Submit with invalid email - shows email validation error
- [ ] Submit valid form - success message displays
- [ ] Check email - confirmation received with Teams link
- [ ] Check Google Form - new entry appears
- [ ] Test on mobile - responsive layout works
- [ ] Test network error - shows appropriate error message

### Test Email

Use a test email service like:
- Mailtrap.io (free tier)
- Temp-mail.org
- Your own email address

## Troubleshooting

### Email not sending
- Verify Brevo API key is correct
- Check that SENDER_EMAIL is configured
- Check browser console and backend logs for errors

### Google Form submission failing
- Verify GOOGLE_FORM_URL is correct
- Verify entry IDs match your form fields
- Check backend logs for detailed error messages
- Note: Form submission failures don't prevent email from being sent

### CORS errors
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check that both services are running
- Clear browser cache

### Form not submitting
- Check backend is running on port 3001
- Verify API_URL in frontend matches backend URL
- Check browser console for error details
- Check backend logs for API errors

## Support

For issues or questions, check:
1. Backend logs: Look for error messages in the terminal running the backend
2. Frontend console: Open browser DevTools (F12) → Console tab
3. Network tab: Check API requests in browser DevTools → Network tab

## License

ISC
