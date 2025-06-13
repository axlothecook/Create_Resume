import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoadedExample from './loadedExample.jsx'
// import Login from './failedLoginStuff/failedLogin.jsx'
import Practice from './Practice.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadedExample />
    {/* <Login /> */}
    {/* <Practice /> */}
  </StrictMode>,
)
