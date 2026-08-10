import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import ErrorDialog from './components/ErrorDialog.tsx'
import GlobalLoadingBoundary from './components/GlobalLoadingBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ErrorDialog />
      <GlobalLoadingBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalLoadingBoundary>
    </ErrorBoundary>
  </StrictMode>,
)
