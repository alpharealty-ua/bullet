import { useBalance } from '@/api/wallet.api'
import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance'
import { MoneyBagButton } from '@/components/money-bag-button'
import { ProfileLink } from '@/components/profile-link'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

export const Header = ({
  logoText,
  hideLogo = false,
  hideProfile = false,
  showNoMoney = true,
}: {
  logoText?: string
  hideLogo?: boolean
  hideProfile?: boolean
  showNoMoney?: boolean
}) => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  const { data: user, isPending } = useProfile()
  const { data: balance, isLoading } = useBalance()
  const noMoney = showNoMoney && !(balance > 0)

  const increaseTime = useGameStore(({ increaseTime }) => increaseTime)

  return (
    <header className='flex min-h-18 w-full items-center justify-between px-3 py-2'>
      {!hideLogo && <Logo as='link' to='/' text={logoText} />}
      <div className='ml-auto flex flex-col gap-1'>
        {token && isPending ? (
          'loading'
        ) : user ? (
          <>
            {!hideProfile && <ProfileLink className='self-end' />}
            {!isLoading && (
              <div className='flex gap-1'>
                <MoneyBagButton
                  as='button'
                  balance={balance}
                  noMoney={noMoney}
                  className='w-7 self-end'
                  bg=''
                />
                <div className='relative flex flex-col items-end gap-1 self-start'>
                  <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
                    Balance
                  </div>
                  <Balance value={balance} increaseTime={increaseTime} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='flex gap-4'>
            <ButtonWithAudio
              as='link'
              className='w-24 text-xs'
              image='button'
              to={ROUTES.auth.login}
              text='Login'
            />
            <ButtonWithAudio
              as='link'
              className='w-24 text-xs'
              image='button'
              to={ROUTES.auth.register}
              text='Register'
            />
          </div>
        )}
      </div>
    </header>
  )
}
