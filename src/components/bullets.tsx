import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const Bullets = ({ countBullet }: { countBullet: number }) => {
  return (
    <div className='flex gap-1.5'>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className={cn(
              'aspect-[1/1.5] w-5 bg-contain bg-center bg-no-repeat',
              5 - index > countBullet && 'opacity-60',
            )}
            style={{ backgroundImage: `url(${IMAGES.bullet})` }}
          ></div>
        ))}
    </div>
  )
}

export { Bullets }
