import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MerchantDetailPage from './pages/MerchantDetailPage.jsx'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import Toast from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/merchants/:id" element={<MerchantDetailPage />} />
            </Routes>
          </BrowserRouter>
          <Toast />
        </AuthModalProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
