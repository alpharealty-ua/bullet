import { ROUTES } from '@/routes/path'
import { PageWrapper } from '@/components/page-wrapper'
import { HomePage } from '@/pages/home.page'
import { LoginPage } from '@/pages/login.page'
import { RegisterPage } from '@/pages/register.page'
import { LeaderboardPage } from '@/pages/leadboard.page'
import { SoloPage } from '@/pages/solo.page'
import { DuelPage } from '@/pages/duel.page'
import { GameSelectorPage } from '@/pages/game-selector.page'
import { ProfilePage } from '@/pages/profile.page'
import { ForgotPasswordPage } from '@/pages/forgot-password.page.tsx'
import { ResetPasswordPage } from '@/pages/reset-password.page.tsx'
import { PlayerPage } from '@/pages/player.page'

export const PUBLIC_ROUTES = [
  {
    path: ROUTES.root,
    element: (
      <PageWrapper headerProps={{ hideLogo: true }}>
        <HomePage />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.leaderboard.root,
    element: (
      <PageWrapper>
        <LeaderboardPage />
      </PageWrapper>
    ),
  },
  {
    path: `${ROUTES.player.root}/:playerId`,
    element: (
      <PageWrapper>
        <PlayerPage />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.auth.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.auth.register,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.auth.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.auth.resetPassword,
    element: <ResetPasswordPage />,
  },
]

export const PRIVATE_ROUTES = [
  {
    path: ROUTES.cabinet.profile,
    element: (
      <PageWrapper>
        <ProfilePage />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.solo.root,
    element: (
      <PageWrapper headerProps={{ logoText: 'Solo' }}>
        <GameSelectorPage format='solo' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.solo.play,
    element: (
      <PageWrapper headerProps={{ logoText: 'Solo' }} hideFooter>
        <SoloPage variant='play' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.solo.game(':gameId'),
    element: (
      <PageWrapper
        headerProps={{
          logoText: 'Solo',
          hideNoMoney: true,
          isModalProfileLink: true,
        }}
        hideFooter
      >
        <SoloPage variant='play' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.solo.watch,
    element: (
      <PageWrapper
        headerProps={{
          logoText: 'Solo',
          hideNoMoney: true,
          isModalProfileLink: true,
        }}
        hideFooter
      >
        <SoloPage variant='watch' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.solo.watchGame(':gameId'),
    element: (
      <PageWrapper
        headerProps={{
          logoText: 'Solo',
          hideNoMoney: true,
          isModalProfileLink: true,
        }}
        hideFooter
      >
        <SoloPage variant='watch' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.duel.root,
    element: (
      <PageWrapper headerProps={{ logoText: 'Duel' }}>
        <GameSelectorPage format='duel' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.duel.enterArena,
    element: (
      <PageWrapper headerProps={{ logoText: 'Duel' }} hideFooter>
        <DuelPage variant='play' />
      </PageWrapper>
    ),
  },
  {
    path: `${ROUTES.duel.next}`,
    element: (
      <PageWrapper
        headerProps={{
          logoText: 'Duel',
          isModalProfileLink: true,
        }}
        hideFooter
      >
        <DuelPage variant='play' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.duel.game(':gameId'),
    element: (
      <PageWrapper
        headerProps={{
          logoText: 'Duel',
          isModalProfileLink: true,
          hideNoMoney: true,
        }}
        hideFooter
      >
        <DuelPage variant='play' />
      </PageWrapper>
    ),
  },
  {
    path: ROUTES.duel.watch,
    element: (
      <PageWrapper headerProps={{ logoText: 'Duel' }} hideFooter>
        <DuelPage variant='watch' />
      </PageWrapper>
    ),
  },
]
