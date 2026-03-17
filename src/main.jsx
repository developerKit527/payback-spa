import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
        <Toast />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
