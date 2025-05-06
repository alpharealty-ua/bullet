import React from 'react'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

const PageWrapper = ({
  children,
  headerProps,
  hideFooter,
  footerProps,
}: {
  children: React.ReactNode
  headerProps?: React.ComponentProps<typeof Header>
  hideFooter?: boolean
  footerProps?: React.ComponentProps<typeof Footer>
}) => {
  return (
    <>
      <Header {...headerProps} />
      {children}
      {!hideFooter && <Footer {...footerProps} />}
    </>
  )
}

export { PageWrapper }
