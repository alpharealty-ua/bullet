import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import NiceModal from '@ebay/nice-modal-react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'react-toastify/ReactToastify.css'

import { IMAGES } from '@/lib/constants'
import { queryClient } from '@/api/query-client'
import { Audios } from '@/components/audios'

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <GoogleOAuthProvider clientId='81416906591-dm3vrjmromctfao0ln0124ajdiqm3gpi.apps.googleusercontent.com'>
        <div
          className='custom-scroll relative mx-auto flex h-dvh min-h-[600px] w-full max-w-[var(--width)] translate-0 flex-col overflow-x-hidden bg-cover bg-[right_center] lg:min-h-[780px]'
          style={{ backgroundImage: `url(${IMAGES.wrapper})` }}
        >
          <NiceModal.Provider>
            <Audios />
            {children}
          </NiceModal.Provider>
        </div>
      </GoogleOAuthProvider>
      <ToastContainer theme='colored' />
    </QueryClientProvider>
  )
}
