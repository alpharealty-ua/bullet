export const ROUTES = {
  index: '/',
  auth: {
    resiter: '/resiter',
    login: '/login',
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
