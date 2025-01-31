const Bet = ({ value }: { value: string }) => {
  return (
    <div className='flex w-full flex-col items-center text-center'>
      <div className='bg-center text-lg font-bold text-[#006100] uppercase'>
        Bet
      </div>
      <div className='w-full overflow-hidden text-3xl leading-[1] text-ellipsis'>
        {value}
      </div>
    </div>
  )
}

export { Bet }
