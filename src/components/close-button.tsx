import React from 'react'
import classNames from 'classnames'

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        'relative h-[44px] w-[44px] cursor-pointer bg-[url(/assets/images/close.svg)] bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    ></button>
  )
})
