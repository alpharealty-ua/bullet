import { ROUTES } from '@/routes/path'
import { HomePage } from '@/pages/home.page'
import { LoginPage } from '@/pages/login.page'
import { RegisterPage } from '@/pages/register.page'
import { LeaderboardPage } from '@/pages/leadboard.page'
import { SoloPage } from '@/pages/solo.page'
import { DuelPage } from '@/pages/duel.page'
import { GameSelectorPage } from '@/pages/game-selector.page'
import { ProfilePage } from '@/pages/profile.page'
import { MatchmakerPage } from '@/pages/matchmaker.page'
import { ForgotPasswordPage } from '@/pages/forgot-password.page.tsx'
import { ResetPasswordPage } from '@/pages/reset-password.page.tsx'

export const PUBLIC_ROUTES = [
  {
    path: ROUTES.root,
    element: <HomePage />,
  },
  {
    path: ROUTES.leaderboard.root,
    element: <LeaderboardPage />,
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
    element: <ProfilePage />,
  },
  {
    path: ROUTES.solo.root,
    element: <GameSelectorPage format='solo' />,
  },
  {
    path: ROUTES.solo.play,
    element: <SoloPage variant='play' />,
  },
  {
    path: `${ROUTES.solo.root}/:gameId`,
    element: <SoloPage variant='play' />,
  },
  {
    path: ROUTES.solo.watch,
    element: <SoloPage variant='watch' />,
  },
  {
    path: `${ROUTES.solo.root}/:gameId/watch`,
    element: <SoloPage variant='watch' />,
  },
  {
    path: ROUTES.duel.root,
    element: <GameSelectorPage format='duel' />,
  },
  {
    path: ROUTES.duel.play,
    element: <MatchmakerPage />,
  },
  {
    path: `${ROUTES.duel.root}/:gameId`,
    element: <DuelPage variant='play' />,
  },
  {
    path: ROUTES.duel.watch,
    element: <DuelPage variant='watch' />,
  },
]
