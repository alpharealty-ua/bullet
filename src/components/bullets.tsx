import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const Bullets = ({ countBullet }: { countBullet: number }) => {
  return (
    <div className='mr-auto ml-auto flex gap-2 self-end'>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className={cn(
              'aspect-[1/1.5] w-[16px] bg-contain bg-center bg-no-repeat',
              5 - index > countBullet && 'opacity-60',
            )}
            style={{ backgroundImage: `url(${images.bullet})` }}
          ></div>
        ))}
    </div>
  )
}

export { Bullets }
