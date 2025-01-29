import React from 'react'

export const DealButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      className='relative h-[86px] w-[120px] cursor-pointer bg-[url(/assets/images/deal.png)] bg-cover bg-center transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50'
      {...props}
    ></button>
  )
})
