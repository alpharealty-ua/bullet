const Offer = () => {
  return (
    <div className='relative z-3 flex justify-between px-6 pt-3'>
      <div className='animate-offer-text pt-4 text-right text-2xl leading-[1] font-bold'>
        the banker <div className='relative left-6'>offers...</div>
      </div>
      <div className='flex flex-col'>
        <div className='animate-offer-money h-[76px]'>
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
