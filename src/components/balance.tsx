export const Balance = ({ value }: { value: number }) => {
  return (
    <div className='flex flex-col'>
      <div className='text-[30px] leading-[1] tracking-tight text-[#006100] uppercase'>
        Balance
      </div>
      <div className='text-[40px] leading-[1] tracking-tight uppercase'>
        ${value}
      </div>
    </div>
  )
}
