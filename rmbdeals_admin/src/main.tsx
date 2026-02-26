import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { BrowserRouter } from 'react-router-dom'
import ReactQueryProvider from './components/ReactQueryProvider.tsx'
import AuthProvider from './contexts/AuthContext2.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position="bottom-right" />
    <BrowserRouter>
      <ReactQueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </StrictMode>,
)
