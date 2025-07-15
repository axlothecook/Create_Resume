import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
// import Login from './failedLoginStuff/failedLogin.jsx'
import Practice from './Practice.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <PDFViewer>
      <MyDocument />
    </PDFViewer> */}
    <App />
    {/* <Login /> */}
    {/* <Practice /> */}
  </StrictMode>,
)
