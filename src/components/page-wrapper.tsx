import React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

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
