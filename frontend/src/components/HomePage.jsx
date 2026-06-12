import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './HomePage.css'

const IMAGES = [
  '/images/day__02 - -  (486).jpg',
  '/images/day__02 - -  (459).jpg',
  '/images/day__02 - -  (509).jpg',
  '/images/day__02 - -  (469).jpg',
  '/images/day__02 - -  (482).jpg',
  '/images/day__02 - -  (471).jpg'
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showRegistration, setShowRegistration] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: ''
  })
  const [formStatus, setFormStatus] = useState('idle') // idle, loading, success, error

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      const response = await fetch('https://responsibleai-jpk1.onrender.com/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ firstName: '', lastName: '', companyName: '', email: '' })
        setTimeout(() => {
          setFormStatus('idle')
        }, 2000)
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setFormStatus('error')
    }
  }

  const handleRegisterClick = () => {
    setShowRegistration(true)
  }

  return (
    <div className="home-container">
      {/* Full-Screen Image Slideshow */}
      <div className="slideshow-container">
        {IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`slideshow-image ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}

        {/* Hero Text Overlay */}
        <div className="hero-overlay">
          <h1 className="hero-name">Violetta Drobot</h1>
          <p className="hero-bio-line1">Applying Project Management Discipline to HR's AI Transformation</p>
          <p className="hero-bio-line2">Empowering HR teams and leaders to lead AI adoption with confidence and accountability</p>
        </div>
      </div>

      {/* Upcoming Workshops Section - Full Page with Carousel Background */}
      <section
        className="workshops-section"
        style={{
          backgroundImage: `url('${IMAGES[currentImageIndex]}')`,
        }}
      >
        <div className="workshops-overlay"></div>
        <div className="workshops-content">
          <h2 className="workshops-heading">Upcoming Workshops</h2>
          <div className="workshop-card">
            <h3>Practical AI for HR 101: Prompt Engineering</h3>
            <p className="workshop-date">June 24, 2026 • 12:00 PM - 1:00 PM EST</p>
            <p className="workshop-description">
              Learn how to write prompts that actually work—so you save 10+ hours per week without wasting time on bad results.
            </p>
            <button
              onClick={handleRegisterClick}
              className="workshop-button"
            >
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Registration Page Section */}
      {showRegistration && (
      <section className="registration-page">
        <div className="registration-container">
          <button
            onClick={() => setShowRegistration(false)}
            className="registration-close-btn"
            aria-label="Close registration"
          >
            ✕
          </button>
          <h2 className="registration-title">Register for Workshop</h2>

          {formStatus === 'success' ? (
            <div className="registration-success">
              <p>✓ Registration successful!</p>
              <p>Check your email for the Teams meeting link and event details.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="registration-form-page">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="form-page-submit-button"
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? 'Registering...' : 'Complete Registration'}
              </button>

              {formStatus === 'error' && (
                <p className="form-error">Error registering. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </section>
      )}

      {/* Navigation - Overlaid on top */}
      <nav className="navbar navbar-overlay">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/prompt-engineering" className="nav-link">Events</Link>
            <a href="https://www.linkedin.com/in/violetta-drobot/" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </nav>


    </div>
  )
}
