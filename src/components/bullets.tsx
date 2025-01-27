import classNames from 'classnames'

const Bullets = ({ countBullet }: { countBullet: number }) => {
  return (
    <div className='mr-auto ml-auto flex gap-1.5'>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className={classNames(
              'h-[32px] w-[22px] bg-[url(/assets/images/bullet.png)] bg-cover',
              5 - index > countBullet && 'opacity-60',
            )}
          ></div>
        ))}
    </div>
  )
}

export { Bullets }
