import React from 'react'

export const PullButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      className='animate-pull relative mt-auto ml-auto h-[77px] w-[92px] cursor-pointer bg-[url(/assets/images/pull.png)] bg-cover transition-transform active:scale-75 disabled:cursor-not-allowed'
      {...props}
    ></button>
  )
})
