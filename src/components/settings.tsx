export const Settings = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-3xl'>Settings</h3>

      <label className='relative z-[1] !mb-auto flex cursor-pointer items-center justify-between px-4 py-2.5'>
        <span className='text-lg font-semibold'>Toggle music</span>
        <input
          type='checkbox'
          className='peer checked:bg-success relative h-4 w-7 cursor-pointer appearance-none rounded-full bg-[#E9E9E9] duration-300 after:absolute after:top-0 after:right-full after:bottom-0 after:my-auto after:h-3 after:w-3 after:translate-x-[calc(100%+2px)] after:rounded-full after:bg-white after:shadow-sm after:transition-[transform,right] checked:after:right-0 checked:after:-translate-x-0.5'
        />
        <div className='absolute top-0 right-0 bottom-0 left-0 z-[-1] rounded-lg bg-[#FAFAFB] peer-checked:bg-[#22C55E]/20'></div>
      </label>
    </div>
  )
}
