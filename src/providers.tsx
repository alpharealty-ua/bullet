import NiceModal from '@ebay/nice-modal-react'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/context/app-provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
        <AppProvider>
          <NiceModal.Provider>{children}</NiceModal.Provider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
