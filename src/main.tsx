import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import { Providers } from '@/providers'
import { AuthMiddleware } from '@/middleware/auth.middleware'
import { AppProvider } from '@/context/app-provider'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AuthMiddleware>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthMiddleware>
    </Providers>
  </StrictMode>,
)
