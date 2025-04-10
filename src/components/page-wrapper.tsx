// TODO: MOVE TO PROVIDERS
const PageWrapper = ({
  children,
  noCentered,
}: {
  children: React.ReactNode
  noCentered?: boolean
}) => {
  return (
    <div className='custom-scroll flex w-full grow flex-col overflow-x-hidden'>
      {noCentered ? (
        children
      ) : (
        <div className='flex w-full grow flex-col items-center justify-center gap-10 px-10 py-15'>
          {children}
        </div>
      )}
    </div>
  )
}

export { PageWrapper }
