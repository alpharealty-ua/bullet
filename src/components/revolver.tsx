import React from 'react'
import classNames from 'classnames'

const Revolver = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { beforeSlot: React.ReactNode }
>(({ className, beforeSlot, ...props }) => {
  return (
    <div className='absolute right-0 bottom-8 left-0 mx-auto h-[472px] w-[251px]'>
      {beforeSlot}
      <div
        className={classNames(
          'absolute top-[85px] right-[-8px] left-[-8px] aspect-square bg-[url(/assets/images/bullet-chambe.png)] bg-contain bg-center bg-no-repeat transition-transform duration-500',
          className,
        )}
        {...props}
      ></div>
      <div className='absolute inset-0 bg-[url(/assets/images/body.png)] bg-contain bg-center bg-no-repeat'></div>
    </div>
  )
})

export { Revolver }
