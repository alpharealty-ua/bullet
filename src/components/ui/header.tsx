import { useBalance } from '@/api/wallet.api'
import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useAuthStore } from '@/store/auth.store'
import { PlayerNotification } from '@/components/player-notification'
import { Logo } from '@/components/ui/logo'
import { Balance } from '@/components/balance/balance'
import { MoneyBagButton } from '@/components/ui/money-bag-button'
import { ProfileLink } from '@/components/ui/profile-link'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { SettingsButton } from '@/components/ui/settings-button'

interface HeaderProps {
  logoText?: string
  hideLogo?: boolean
  hideNoMoney?: boolean
  isModalProfileLink?: boolean
}

export const Header = ({
  logoText,
  hideLogo,
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
            <div className='flex items-center justify-end gap-2'>
              <ProfileLink as={isModalProfileLink ? 'button' : 'link'} />
              <SettingsButton className='w-4 p-0' />
            </div>
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
            >
              Login
            </ButtonWithAudio>
            <ButtonWithAudio
              as='link'
              className='w-24 text-xs'
              image='button'
              to={ROUTES.auth.register}
            >
              Register
            </ButtonWithAudio>
          </div>
        )}
      </div>
      <PlayerNotification />
    </header>
  )
}
