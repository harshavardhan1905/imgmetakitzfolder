import { useState } from 'react'
import { API_BASE_URL } from './api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Header from './pages/Header'
import Footer from './pages/Footer'
import Client from './pages/Client'
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    // 1. Router must be the outermost wrapper
    <Router>
      
      {/* // 2. Header is now safely inside the Router */}
      <Header />
      
      {/* // 3. The Routes will swap out the middle content based on the URL */}
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/about" element={<About />} />
        <Route path="/guide" element={<HowItWorks />} />
      </Routes>
      
      {/* // 4. Footer is inside the Router (in case you add links to it later!) */}
      <Footer />
      
    </Router>
  )
}

export default App