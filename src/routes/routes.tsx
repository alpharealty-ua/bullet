import { ROUTES } from './path'
import { Home } from '@/pages/home.page'
import { LoginPage } from '@/pages/login.page'
import { RegisterPage } from '@/pages/register.page'
import { Solo } from '@/components/solo'
import { Cover } from '@/components/cover'
import { Duel } from '@/components/duel'

export const PUBLIC_ROUTES = [
  {
    path: ROUTES.index,
    element: <Home />,
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
    element: <Cover format='solo' />,
  },
  {
    path: ROUTES.solo.play,
    element: <Solo variant='play' />,
  },
  {
    path: `${ROUTES.solo.play}/:gameId`,
    element: <Solo variant='play' />,
  },
  {
    path: ROUTES.solo.watch,
    element: <Solo variant='watch' />,
  },
  {
    path: ROUTES.duel.index,
    element: <Cover format='duel' />,
  },
  {
    path: ROUTES.duel.play,
    element: <Duel variant='play' />,
  },
  {
    path: `${ROUTES.duel.play}/:gameId`,
    element: <Duel variant='play' />,
  },
  {
    path: ROUTES.duel.watch,
    element: <Duel variant='watch' />,
  },
]
