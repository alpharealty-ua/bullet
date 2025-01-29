import React from 'react'
import classNames from 'classnames'

export const PullButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        'relative aspect-[1/0.84] w-[92px] cursor-pointer bg-[url(/assets/images/pull.png)] bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    ></button>
  )
})
