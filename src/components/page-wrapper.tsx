import React from 'react'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

const PageWrapper = ({
  children,
  headerProps,
  hideFooter,
}: {
  children: React.ReactNode
  headerProps?: React.ComponentProps<typeof Header>
  hideFooter?: boolean
}) => {
  return (
    <>
      <Header {...headerProps} />
      {children}
      {!hideFooter && <Footer />}
    </>
  )
}

export { PageWrapper }
