import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
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
      const response = await fetch('https://responsibleai-backend.onrender.com/api/signups', {
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
          setShowRegistrationModal(false)
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

  const closeModal = () => {
    setShowRegistrationModal(false)
    setFormStatus('idle')
    setFormData({ firstName: '', lastName: '', companyName: '', email: '' })
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
              onClick={() => setShowRegistrationModal(!showRegistrationModal)}
              className="workshop-button"
            >
              {showRegistrationModal ? 'Hide Form' : 'Register Now'}
            </button>

            {showRegistrationModal && (
              <div className="registration-form-expanded">
                <h3 className="form-expanded-title">Registration Form</h3>
                {formStatus === 'success' ? (
                  <div className="form-expanded-success">
                    <p>✓ Registration successful! Check your email for details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="registration-form-inline">
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

                    <button
                      type="submit"
                      className="form-inline-submit"
                      disabled={formStatus === 'loading'}
                    >
                      {formStatus === 'loading' ? 'Registering...' : 'Submit Registration'}
                    </button>

                    {formStatus === 'error' && (
                      <p className="form-error">Error registering. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            <h2 className="modal-title">Register for Workshop</h2>

            {formStatus === 'success' ? (
              <div className="modal-success">
                <p>✓ Registration successful! Check your email for details.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="registration-form">
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

                <button
                  type="submit"
                  className="form-submit-button"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? 'Registering...' : 'Register'}
                </button>

                {formStatus === 'error' && (
                  <p className="form-error">Error registering. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
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
