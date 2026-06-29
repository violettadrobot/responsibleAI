import './EventInvite.css'

export default function EventInvite() {
  return (
    <div className="invite-page">
      {/* Background Image */}
      <div className="invite-background"></div>

      {/* Content Overlay */}
      <div className="invite-content">
        {/* Left Headshot - User */}
        <div className="invite-headshot invite-left">
          <img src="/images/Image (73).jpg" alt="Violetta Drobot" />
        </div>

        {/* Middle Title with Text Bubble */}
        <div className="invite-middle">
          <div className="invite-title-bubble">
            <h1>AI + Improv: Building Human-Centered Cultures in an AI-Powered World</h1>
          </div>
        </div>

        {/* Right Headshot - Amanda */}
        <div className="invite-headshot invite-right">
          <img src="/images/Amanda.png" alt="Amanda" />
        </div>
      </div>
    </div>
  )
}
