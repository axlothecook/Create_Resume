import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// UI font for app chrome (self-hosted via @fontsource): Poppins.
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
