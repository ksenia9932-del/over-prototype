import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PromoPage from './pages/PromoPage'
import ConfirmationPage from './pages/ConfirmationPage'
import PasswordPage from './pages/PasswordPage'

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<PasswordPage />} />
          <Route path="/promo" element={<PromoPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
