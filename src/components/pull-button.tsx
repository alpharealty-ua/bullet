import React from 'react'

export const PullButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props) => {
  return (
    <div className='animate-pull mx-4 mt-auto mb-4 flex items-center justify-between'>
      <button
        className='relative mt-auto ml-auto h-[77px] w-[92px] cursor-pointer bg-[url(/assets/images/pull.png)] bg-cover transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50'
        {...props}
      ></button>
    </div>
  )
})
