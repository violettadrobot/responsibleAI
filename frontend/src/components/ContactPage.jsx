import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ContactPage.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    services: [],
    message: ''
  })

  const [formStatus, setFormStatus] = useState('idle')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (formStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && formStatus === 'success') {
      setFormStatus('idle')
      setCountdown(10)
    }
  }, [formStatus, countdown])

  const serviceOptions = [
    'Public Speaking',
    'General Inquiry'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      const response = await fetch('https://responsibleai-jpk1.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus('success')
        setCountdown(10)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          services: [],
          message: ''
        })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setFormStatus('error')
    }
  }

  return (
    <div className="contact-page-container">
      <section className="contact-header">
        <h1>Let's work together</h1>
        <p>Fill out the form below and we'll be in touch soon.</p>
      </section>

      <section className="contact-main">
        <div className="contact-left">
          <img src="/images/Image (73).jpg" alt="Violetta Drobot" className="contact-headshot" />
        </div>

        <div className="contact-right">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>Services Interested In</label>
              <div className="checkbox-container">
                {serviceOptions.map(service => (
                  <label key={service} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleChange}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="2"
              />
            </div>

            <button type="submit" disabled={formStatus === 'loading'}>
              {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {formStatus === 'success' && (
              <div className="success-message">
                <p>✓ Thank you! We received your message.</p>
                <p style={{ fontSize: '0.9em', marginTop: '10px', color: '#b8c5d6' }}>This window will close in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
              </div>
            )}
            {formStatus === 'error' && (
              <p className="error-message">Error sending message. Please try again.</p>
            )}
          </form>
        </div>
      </section>

      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/contact" className="nav-link active">Contact</Link>
            <a href="https://www.linkedin.com/in/violetta-drobot/" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}
