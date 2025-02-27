import { ROUTES } from './path'
import { Home } from '@/components/home'
import { Solo } from '@/components/solo'
import { Cover } from '@/components/cover'
import { Duel } from '@/components/duel'
import { Login } from '@/components/forms/login.form'

export const PUBLIC_ROUTES = [
  {
    path: ROUTES.index,
    element: <Home />,
  },
  {
    path: ROUTES.login,
    element: <Login />,
  },
  {
    path: ROUTES.resiter,
    element: <Login />,
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
    path: ROUTES.duel.watch,
    element: <Duel variant='watch' />,
  },
]
