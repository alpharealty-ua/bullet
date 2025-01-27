interface OfferProps {
  onDeal: () => void
  onNoDeal: () => void
}

const Offer = ({ onDeal, onNoDeal }: OfferProps) => {
  return (
    <div className='relative z-3 flex justify-between px-6 pt-3'>
      <div className='animate-offer-text pt-2 text-right text-[40px] leading-[.8] font-bold'>
        the banker <div className='relative left-6'>offers...</div>
      </div>
      <div className='flex flex-col'>
        <div className='animate-offer-money h-[76px]'>
          <img src='./assets/images/100.png' alt='' />
        </div>
        <button
          className='animate-offer-deal relative mt-auto ml-auto h-[86px] w-[120px] cursor-pointer bg-[url(/assets/images/deal.png)] bg-cover transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onDeal}
        ></button>
        <button
          className='animate-offer-no-deal relative mt-auto ml-auto h-[86px] w-[120px] cursor-pointer bg-[url(/assets/images/no-deal.png)] bg-cover transition-transform active:scale-75 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onNoDeal}
        ></button>
      </div>
    </div>
  )
}

export { Offer }
