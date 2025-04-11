import { Header } from '@/components/header'
import React from 'react'

const PageWrapper = ({
  children,
  headerProps,
}: {
  children: React.ReactNode
  headerProps?: React.ComponentProps<typeof Header>
}) => {
  return (
    <>
      <Header {...headerProps} />
      {children}
    </>
  )
}

export { PageWrapper }
