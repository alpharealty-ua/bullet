import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import { Providers } from '@/providers'
import { Debug } from '@/components/debug'
import '@/globals.css'
import '@/socket/socket'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Debug />
      <App />
    </Providers>
  </StrictMode>,
)
