const Bet = ({ value }: { value: string }) => {
  return (
    <div className='flex min-w-[75px] flex-col items-center text-center'>
      <div className='bg-center text-lg text-[#006100] uppercase'>Bet</div>
      <div className='w-full overflow-hidden text-3xl leading-[1] text-ellipsis'>
        {value}
      </div>
    </div>
  )
}

export { Bet }
