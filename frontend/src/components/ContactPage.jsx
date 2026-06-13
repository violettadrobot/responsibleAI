import { useState } from 'react'
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

  const [formStatus, setFormStatus] = useState('idle') // idle, loading, success, error

  const serviceOptions = [
    'Public Speaking',
    'Brand Strategy Advisory',
    'Social Media Campaigns',
    'General Inquiry'
  ]

  const handleFormChange = (e) => {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      const response = await fetch('https://responsibleai-jpk1.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          services: [],
          message: ''
        })
        setTimeout(() => {
          setFormStatus('idle')
        }, 3000)
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
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Let's work together</h1>
        <p>Interested in working together? Fill out some info and we will be in touch shortly! We can't wait to hear from you.</p>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-form-wrapper">
          {/* Headshot Image */}
          <div className="contact-image-col">
            <img src="/images/Image (73).jpg" alt="Violetta Drobot" className="contact-headshot" />
          </div>

          {/* Form */}
          <div className="contact-form-col">
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>First Name <span className="required">(required)</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name <span className="required">(required)</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email <span className="required">(required)</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">What services are you interested in?</label>
                <div className="checkbox-group">
                  {serviceOptions.map(service => (
                    <div key={service} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={service}
                        name="services"
                        value={service}
                        checked={formData.services.includes(service)}
                        onChange={handleFormChange}
                      />
                      <label htmlFor={service}>{service}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message <span className="required">(required)</span></label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-button"
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <p className="form-success">Thank you! We'll get back to you soon.</p>
              )}
              {formStatus === 'error' && (
                <p className="form-error">Error sending message. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Navigation */}
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
