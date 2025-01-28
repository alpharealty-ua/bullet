const GameOver = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='absolute inset-0 z-50 cursor-pointer' onClick={onClick}>
      <div className='animate-game-over absolute inset-0 flex items-end'>
        <img src='./assets/videos/game-over.gif' alt='' />
      </div>
      <div className='animate-blood absolute inset-0 bg-[url(/assets/images/blood.png)]'>
        <div className='animate-blood-you absolute top-[130px] left-[105px] h-[143px] w-[143px] bg-[url(/assets/images/you.png)] bg-contain bg-center'></div>
        <div className='animate-blood-died absolute top-[450px] left-[210px] h-[153px] w-[158px] bg-[url(/assets/images/died.png)] bg-contain bg-center'></div>
      </div>
    </div>
  )
}

export { GameOver }
