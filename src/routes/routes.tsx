import { ROUTES } from '@/routes/path'
import { HomePage } from '@/pages/home.page'
import { LoginPage } from '@/pages/login.page'
import { RegisterPage } from '@/pages/register.page'
import { LeaderboardPage } from '@/pages/leadboard.page'
import { SoloPage } from '@/pages/solo.page'
import { DuelPage } from '@/pages/duel.page'
import { CoverPage } from '@/pages/cover.page'

export const PUBLIC_ROUTES = [
  {
    path: ROUTES.index,
    element: <HomePage />,
  },
  {
    path: ROUTES.leaderboard.index,
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
]

export const PRIVATE_ROUTES = [
  {
    path: ROUTES.solo.index,
    element: <CoverPage format='solo' />,
  },
  {
    path: ROUTES.solo.play,
    element: <SoloPage variant='play' />,
  },
  {
    path: `${ROUTES.solo.play}/:gameId`,
    element: <SoloPage variant='play' />,
  },
  {
    path: ROUTES.solo.watch,
    element: <SoloPage variant='watch' />,
  },
  {
    path: ROUTES.duel.index,
    element: <CoverPage format='duel' />,
  },
  {
    path: ROUTES.duel.play,
    element: <DuelPage variant='play' />,
  },
  {
    path: `${ROUTES.duel.play}/:gameId`,
    element: <DuelPage variant='play' />,
  },
  {
    path: ROUTES.duel.watch,
    element: <DuelPage variant='watch' />,
  },
]
