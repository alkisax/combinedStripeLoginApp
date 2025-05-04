import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './pages/Home.jsx'
import App from './App'

// import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {/* <BrowserRouter> */}
          <App />
      {/* </BrowserRouter> */}
    </StrictMode>,
  )
} else {
  console.error("Root element not found.");
}

