import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppStateProvider } from './context/AppState'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <React.Suspense fallback={null}>
          <AppStateProvider>
            <App />
          </AppStateProvider>
        </React.Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)