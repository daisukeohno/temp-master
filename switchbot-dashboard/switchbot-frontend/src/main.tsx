import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { queryClient } from './api/queryClient'
import { ThemeProvider } from './theme/ThemeProvider'
import './index.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
