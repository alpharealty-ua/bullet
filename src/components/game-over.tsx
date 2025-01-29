import { images } from '@/lib/constants'

const GameOver = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='absolute inset-0 z-50 cursor-pointer' onClick={onClick}>
      <div
        className='animate-out fade-out fill-mode-both absolute inset-0 flex items-end bg-bottom bg-no-repeat delay-[800ms] duration-0'
        style={{ backgroundImage: `url(${images.gameOver})` }}
      ></div>
      <div
        className='animate-in fade-in fill-mode-both absolute inset-0 delay-[800ms] duration-100'
        style={{ backgroundImage: `url(${images.blood})` }}
      >
        <div
          className='animate-in fade-in fill-mode-both absolute top-[130px] left-[105px] h-[143px] w-[143px] bg-contain bg-center delay-[900ms] duration-100'
          style={{ backgroundImage: `url(${images.you})` }}
        ></div>
        <div
          className='animate-in fade-in fill-mode-both absolute top-[450px] left-[210px] h-[153px] w-[158px] bg-contain bg-center delay-1000 duration-100'
          style={{ backgroundImage: `url(${images.died})` }}
        ></div>
      </div>
    </div>
  )
}

export { GameOver }
