import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import EventSignupPage from './components/EventSignupPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prompt-engineering" element={<EventSignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
