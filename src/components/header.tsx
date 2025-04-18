import { useBalance } from '@/api/wallet.api'
import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useAuthStore } from '@/store/auth.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance/balance'
import { MoneyBagButton } from '@/components/money-bag-button'
import { ProfileLink } from '@/components/profile-link'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

interface HeaderProps {
  logoText?: string
  hideLogo?: boolean
  hideProfile?: boolean
  hideNoMoney?: boolean
  isModalProfileLink?: boolean
}

export const Header = ({
  logoText,
  hideLogo,
  hideProfile,
  hideNoMoney,
  isModalProfileLink,
}: HeaderProps) => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  const { data: user, isPending } = useProfile()
  const { data: balance, isLoading } = useBalance()
  const noMoney = !hideNoMoney && !(balance > 0)

  return (
    <header className='relative z-50 flex h-20 w-full shrink-0 items-center justify-between px-3 py-1'>
      {!hideLogo && <Logo as='link' to='/' text={logoText} />}
      <div className='ml-auto flex flex-col gap-1'>
        {token && isPending ? (
          'loading'
        ) : user ? (
          <>
            {!hideProfile && (
              <ProfileLink isModal={isModalProfileLink} className='self-end' />
            )}
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
                  <Balance />
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
