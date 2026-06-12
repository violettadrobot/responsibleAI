import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span className="logo-text">Violetta Drobot</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/prompt-engineering" className="nav-link">Events</Link>
            <a href="https://www.linkedin.com/in/violetta-drobot/" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="video-container">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/wj3kPZtw8EI"
              title="Applying Project Management Discipline to HR's AI Transformation"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="hero-text">
            <h1 className="hero-title">Applying Project Management Discipline to HR's AI Transformation</h1>
            <p className="hero-tagline">
              Empowering HR teams and leaders to lead AI adoption with confidence and accountability
            </p>
          </div>
        </div>
      </section>

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
