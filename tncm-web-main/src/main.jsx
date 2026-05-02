import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './responsive.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
registerSW({ immediate: true })

// Suppress console logs in production for a cleaner user experience
if (import.meta.env.PROD) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    // Keep console.error for critical debugging but you can suppress it too if desired
    // console.error = () => {}; 
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
