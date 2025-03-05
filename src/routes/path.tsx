export const ROUTES = {
  index: '/',
  auth: {
    register: '/register',
    login: '/login',
  },
  cabinet: {
    root: '/cabinet',
    profile: '/cabinet/profile',
  },
  leaderboard: {
    index: '/leaderboard',
  },
  solo: {
    index: '/solo',
    play: '/solo/play',
    watch: '/solo/watch',
  },
  duel: {
    index: '/duel',
    play: '/duel/play',
    watch: '/duel/watch',
  },
} as const
