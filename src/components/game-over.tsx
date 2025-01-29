const GameOver = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='absolute inset-0 z-50 cursor-pointer' onClick={onClick}>
      <div className='animate-out fade-out fill-mode-both absolute inset-0 flex items-end delay-[800ms] duration-0'>
        <img src='./assets/videos/game-over.gif' alt='' />
      </div>
      <div className='animate-in fade-in fill-mode-both absolute inset-0 bg-[url(/assets/images/blood.png)] delay-[800ms] duration-100'>
        <div className='animate-in fade-in fill-mode-both absolute top-[130px] left-[105px] h-[143px] w-[143px] bg-[url(/assets/images/you.png)] bg-contain bg-center delay-[900ms] duration-100'></div>
        <div className='animate-in fade-in fill-mode-both absolute top-[450px] left-[210px] h-[153px] w-[158px] bg-[url(/assets/images/died.png)] bg-contain bg-center delay-1000 duration-100'></div>
      </div>
    </div>
  )
}

export { GameOver }
