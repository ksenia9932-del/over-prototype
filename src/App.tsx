import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PromoPage from './pages/PromoPage'
import ConfirmationPage from './pages/ConfirmationPage'
import PasswordPage from './pages/PasswordPage'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<PasswordPage />} />
          <Route path="/promo" element={<PromoPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
