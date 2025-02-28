export const ROUTES = {
  index: '/',
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
  // TODO: ADD AUTH
  resiter: '/resiter',
  login: '/login',
} as const
