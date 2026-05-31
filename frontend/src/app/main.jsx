import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from '../features/auth/AuthContext'
import { VendorAuthProvider } from '../features/auth/VendorAuthContext'
import { AdminAuthProvider } from '../features/auth/AdminAuthContext' 
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VendorAuthProvider>
          <AdminAuthProvider>                                     
            <App />
          </AdminAuthProvider>                                     
        </VendorAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)