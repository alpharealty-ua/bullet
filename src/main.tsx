import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import { Providers } from '@/providers'
import { AuthMiddleware } from '@/middleware/auth.middleware'
import { Debug } from '@/components/debug'
import '@/globals.css'
import '@/socket/socket'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AuthMiddleware>
        <Debug />
        <App />
      </AuthMiddleware>
    </Providers>
  </StrictMode>,
)
