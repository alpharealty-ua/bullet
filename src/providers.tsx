import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import NiceModal from '@ebay/nice-modal-react'
import 'react-toastify/ReactToastify.css'

import { images } from '@/lib/constants'
import { Audios } from '@/components/audios'

const queryClient = new QueryClient()

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <div
          className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] translate-0 flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
          style={{ backgroundImage: `url(${images.wrapper})` }}
        >
          <NiceModal.Provider>
            <Audios />
            {children}
          </NiceModal.Provider>
        </div>
      </BrowserRouter>
      <ToastContainer theme='colored' />
    </QueryClientProvider>
  )
}
