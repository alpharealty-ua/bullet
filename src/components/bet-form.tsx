import { onlyDigit } from '@/lib/utils'

interface BetFormProps {
  onSubmit: (form: HTMLFormElement, value: number) => void
}

const BetForm = ({ onSubmit }: BetFormProps) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const input = form.elements[0] as HTMLInputElement

    const value = input.value

    if (input.value === '') {
      return
    }

    onSubmit(form, Number(value))
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!onlyDigit(event.key)) {
      event.preventDefault()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='animate-in fade-in-0 relative left-1 z-[3] mt-4 mb-auto flex justify-center gap-2 px-[30px] duration-500 lg:mt-10'
    >
      <div className='relative w-[220px]'>
        <input
          onKeyDown={handleKeyDown}
          className='italicplaceholder:text-black/60 absolute top-0 right-0 bottom-0 left-0 appearance-auto px-[10px] py-[14px] text-2xl text-black outline-none'
          placeholder='Bet Amount'
          defaultValue='100'
          type='type'
          autoFocus
        />
        <svg
          width='220'
          height='74'
          viewBox='0 0 220 74'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M3.13672 4.67844C25.5088 4.4539 47.8094 2.09348 70.1826 2.09348C79.7078 2.09348 89.233 2.09348 98.7582 2.09348C109.334 2.09348 119.909 2.09348 130.485 2.09348C137.336 2.09348 144.222 1.78939 151.069 2.27812C164.947 3.26882 178.956 2.46276 192.842 2.46276C201.228 2.46276 209.615 2.46276 218.001 2.46276'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M4.04201 4.30859C3.72501 11.6607 3.58823 18.9382 3.58823 26.3012C3.58823 31.3358 3.75875 36.3906 3.18487 41.3596C2.66572 45.8548 2 50.6848 2 55.2691C2 60.6253 2.68067 65.8141 2.68067 71.1481'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M217.092 3.20117C216.283 12.8055 215.73 22.0878 215.73 31.7588C215.73 36.7782 215.73 41.7977 215.73 46.8172C215.73 51.3579 215.73 55.8987 215.73 60.4395C215.73 63.5168 215.73 66.5941 215.73 69.6714'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M3.13672 69.6715C39.7576 71.5624 76.438 71.8871 113.077 71.8871C121.62 71.8871 130.189 72.1885 138.729 71.8051C142.278 71.6457 145.67 70.658 149.178 70.0407C155.995 68.8413 163.006 68.7084 169.85 68.4816C176.898 68.2479 183.94 68.1943 190.989 68.1943C199.17 68.1943 207.32 69.3022 215.506 69.3022'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      </div>
      <button className='relative inline-flex transition-transform active:scale-75 disabled:cursor-not-allowed'>
        <span className='absolute inset-0 inline-flex cursor-pointer items-center justify-center text-3xl font-bold'>
          BET
        </span>
        <svg width='110' height='76' viewBox='0 0 110 76' fill='none'>
          <path
            d='M2.14062 4.1084H104.641L103.641 72.1084L4.14062 69.6084L2.14062 4.1084Z'
            fill='#FF9B2A'
          />
          <path
            d='M2.72656 2.99121C36.4439 2.99121 70.1713 3.32183 103.895 3.32183'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M2 70.1064C26.5721 70.1064 51.177 69.7845 75.7458 70.1432C86.5157 70.3004 97.0684 72.7513 107.797 72.7513'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M105.217 4.31445C104.21 26.64 103.895 48.7701 103.895 71.0989'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M2.0669 2C2.0669 12.8361 2.00426 23.6745 2.0669 34.5106C2.09267 38.9693 2.8 43.3621 2.98528 47.8087C3.41343 58.0844 3.05875 63.4157 3.05875 73.7029'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      </button>
    </form>
  )
}

export { BetForm }
