export const ROUTES = {
  root: '/',
  auth: {
    register: '/register',
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  cabinet: {
    root: '/cabinet',
    profile: '/cabinet/profile',
  },
  leaderboard: {
    root: '/leaderboard',
  },
  player: {
    root: '/player',
  },
  solo: {
    root: '/solo',
    play: '/solo/play',
    watch: '/solo/watch',
  },
  duel: {
    root: '/duel',
    play: '/duel/play',
    watch: '/duel/watch',
  },
} as const
