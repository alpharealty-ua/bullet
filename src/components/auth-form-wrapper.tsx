import React from 'react'

import { Logo } from '@/components/ui/logo'

const AuthFormWrapper = ({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) => {
  return (
    <div className='flex w-full grow flex-col items-center justify-center gap-10 px-10 py-15'>
      <Logo as='link' to='/' size='xl' />
      <div className='relative flex w-full flex-col items-center gap-8'>
        <h3 className='text-3xl'>{label}</h3>
        {children}
      </div>
    </div>
  )
}

export { AuthFormWrapper }
