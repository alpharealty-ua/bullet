import React from 'react'
import classNames from 'classnames'

export const DealButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        'relative aspect-[1/0.72] w-[120px] cursor-pointer bg-[url(/assets/images/deal.png)] bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    ></button>
  )
})
