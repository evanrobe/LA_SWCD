import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import ErrorDialog from './components/ErrorDialog.tsx'
import GlobalLoadingBoundary from './components/GlobalLoadingBoundary.tsx'
import { queryClient } from './api/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ErrorDialog />
        <GlobalLoadingBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GlobalLoadingBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
