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
    }, 7000)
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
            <Link to="/prompt-engineering" className="workshop-button">
              Register Now
            </Link>
          </div>
        </div>
      </section>

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
