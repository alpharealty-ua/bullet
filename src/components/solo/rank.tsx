const Rank = ({ value }: { value: number }) => {
  return (
    <div className='relative left-[0.063rem] h-4 w-full overflow-hidden border-2 border-black bg-[#eee]'>
      <div className='absolute inset-0 -right-1 -left-1'>
        <div
          className='bg-primary absolute inset-0 -skew-x-30 transition-all'
          style={{ width: `${value}%` }}
        ></div>
      </div>
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className='absolute h-full w-0.5 -skew-x-30 bg-black'
            style={{ left: `${6 + 10 * i}%` }}
          ></div>
        ))}
    </div>
  )
}

export { Rank }
