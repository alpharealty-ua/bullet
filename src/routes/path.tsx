export const ROUTES = {
  index: '/',
  auth: {
    register: '/register',
    login: '/login',
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
