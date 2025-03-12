import { Outlet, ScrollRestoration } from 'react-router'

export const RootRouter = () => {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
