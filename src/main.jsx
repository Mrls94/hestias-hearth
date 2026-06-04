import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppStateProvider } from './context/AppState'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
)