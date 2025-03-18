const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <div className='custom-scroll flex w-full flex-col items-center gap-10 px-10 py-12'>
        {children}
      </div>
    </div>
  )
}

export { PageWrapper }
