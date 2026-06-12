import { useState } from 'react'
import axios from 'axios'
import './EventSignupPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function EventSignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: ''
  })

  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrors([])
    setMessage('')

    try {
      const response = await axios.post(`${API_URL}/api/signups`, formData)

      if (response.data.success) {
        setStatus('success')
        setMessage(response.data.message)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          companyName: ''
        })
      }
    } catch (error) {
      setStatus('error')

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
        setMessage('Please fix the errors below')
      } else if (error.response?.data?.error) {
        setMessage(error.response.data.error)
      } else {
        setMessage('An error occurred. Please try again.')
      }
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    setMessage('')
    setErrors([])
  }

  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="event-signup-container">
      {/* Event Details Section */}
      <div className="event-details-section">
        <div className="event-content">
          {/* Left Column */}
          <div className="event-left">
            <h1 className="event-title">Responsible AI in HR:<br />From Hype to Accountability</h1>

            <div className="event-meta">
              <div className="meta-item">
                <span>Virtual 60 minute training, June 10 from 12pm-1pm EST</span>
              </div>
              <div className="meta-item speaker-item">
                <img src="/images/violetta.jpg" alt="Violetta Drobot" className="speaker-image" />
                <a href="https://www.linkedin.com/in/violetta-drobot/" target="_blank" rel="noopener noreferrer" className="meta-link">Violetta Drobot - AI Native HR Leader & Coach</a>
              </div>
              <div className="meta-item speaker-item">
                <img src="/images/melisa.jpg" alt="Melisa DiPietro" className="speaker-image" />
                <a href="https://www.linkedin.com/in/meldip/" target="_blank" rel="noopener noreferrer" className="meta-link">Melisa DiPietro - Founder & Principal Consult at FlocknFir</a>
              </div>
            </div>

            <h2 className="section-title">Overview</h2>
            <p className="overview-text">
              Learn how to pressure-test your AI decisions for bias, privacy risks, and accountability gaps—so you can move forward with confidence instead of fear.
            </p>

            <h2 className="section-title">What You'll Learn</h2>
            <ul className="learn-list">
              <li>Why AI fails in HR (it's rarely the algorithm)</li>
              <li>Where HR is most at risk: hiring, compensation, performance ratings, surveys</li>
              <li>How to build accountability that actually works</li>
              <li>A framework to pressure-test your AI decisions today</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="event-right">
            <div className="reserve-card">
              <div className="reserve-price">Free</div>

              {status === 'closed' ? (
                <div className="success-message" style={{ background: 'rgba(168, 85, 247, 0.1)', borderLeft: '4px solid #a855f7' }}>
                  <div style={{ fontSize: '32px', marginBottom: '15px' }}>🎉</div>
                  <h3>Event Closed</h3>
                  <p>Thank you for your interest! Registration has ended for this workshop.</p>
                  <p style={{ fontSize: '14px', marginTop: '15px', opacity: 0.8 }}>
                    This event took place on June 10, 2026.<br/>
                    We look forward to seeing you at our next event!
                  </p>
                </div>
              ) : status === 'success' ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Registration Successful!</h3>
                  <p>{message}</p>
                  <p style={{ fontSize: '14px', marginTop: '15px', opacity: 0.9 }}>
                    Check your inbox for a confirmation email from:<br/>
                    <strong>violettadrobot@11095009.brevosend.com</strong>
                  </p>
                  <button
                    className="button button-secondary"
                    onClick={() => setStatus('idle')}
                  >
                    Register Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Acme Corporation"
                      disabled={status === 'loading'}
                    />
                  </div>

                  {errors.length > 0 && (
                    <div className="error-messages">
                      {errors.map((error, index) => (
                        <p key={index} className="error-item">• {error}</p>
                      ))}
                    </div>
                  )}

                  {status === 'error' && !errors.length && (
                    <div className="error-message">
                      <p>{message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Registering...' : 'Reserve a Spot'}
                  </button>

                  {status === 'error' && (
                    <button
                      type="button"
                      className="button button-link"
                      onClick={handleRetry}
                    >
                      Try Again
                    </button>
                  )}

                  <div className="form-footer">
                    <p>We respect your privacy. Your information will only be used for event communication.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Credit */}
      <div style={{
        marginTop: 'auto',
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#8b98b0',
        fontSize: '14px'
      }}>
        <p style={{ margin: 0 }}>
          Designed by <strong>Violetta Drobot</strong> •
          <a href="https://www.linkedin.com/in/violetta-drobot/" target="_blank" rel="noopener noreferrer"
             style={{ color: '#00d4ff', textDecoration: 'none', marginLeft: '6px' }}>
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  )
}
