const Offer = () => {
  return (
    <div className='relative z-3 flex justify-between px-6 pt-3'>
      <div className='animate-in fade-in fill-mode-both pt-4 text-right text-2xl leading-[1] font-bold delay-500 duration-500'>
        the banker <div className='relative left-6'>offers...</div>
      </div>
      <div className='flex flex-col'>
        <div className='animate-in fade-in fill-mode-both h-[76px] delay-1000 duration-500'>
          <img src='./assets/images/100.png' alt='' />
        </div>

        {/* TODO: REMOVE BUTTON  */}
        {/* <button
          className='animate-offer-no-deal relative mt-auto ml-auto h-[86px] w-[120px] cursor-pointer bg-[url(/assets/images/no-deal.png)] bg-cover transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onNoDeal}
        ></button> */}
      </div>
    </div>
  )
}

export { Offer }
