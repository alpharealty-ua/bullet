import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import NiceModal from '@ebay/nice-modal-react'
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
      <div
        // TODO: REFACTOR PAGE HEIGHT
        className='relative mx-auto flex h-dvh min-h-[600px] max-w-[var(--width)] translate-0 flex-col bg-cover bg-[right_center] lg:min-h-[780px]'
        style={{ backgroundImage: `url(${IMAGES.wrapper})` }}
      >
        <NiceModal.Provider>
          <Audios />
          {children}
        </NiceModal.Provider>
      </div>
      <ToastContainer theme='colored' />
    </QueryClientProvider>
  )
}
