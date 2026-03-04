import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import './index.css'
import { BrowserRouter} from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
   <App />
  </GoogleOAuthProvider>
  </AppContextProvider>
  </BrowserRouter>,
)
