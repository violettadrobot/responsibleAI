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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
    }, 9000)
    return () => clearInterval(interval)
  }, [])

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
      </div>

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

      {/* Upcoming Events */}
      <section className="events-section">
        <div className="events-content">
          <h2 className="section-heading">Upcoming Workshops</h2>

          <div className="event-card">
            <h3>Practical AI for HR 101: Prompt Engineering</h3>
            <p className="event-date">June 24, 2026 • 12:00 PM - 1:00 PM EST</p>
            <p className="event-description">
              Learn how to write prompts that actually work—so you save 10+ hours per week without wasting time on bad results.
            </p>
            <Link to="/prompt-engineering" className="event-button">
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Violetta Drobot. All rights reserved.</p>
      </footer>
    </div>
  )
}
