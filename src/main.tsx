import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import { Providers } from '@/providers'
import { AuthMiddleare } from '@/middleware/auth.middleware'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AuthMiddleare>
        <App />
      </AuthMiddleare>
    </Providers>
  </StrictMode>,
)
