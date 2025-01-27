const Bet = ({ value }: { value: number }) => {
  return (
    <div className='flex min-w-[75px] flex-col items-center text-center'>
      <div className='text-5xl leading-[1] font-black text-[#ff0b0b]'>
        {value}
      </div>
      <div className='h-[14px] w-[42px] bg-[url(/assets/images/bet.png)] bg-cover bg-center font-bold text-[#006100] uppercase'></div>
    </div>
  )
}

export { Bet }
