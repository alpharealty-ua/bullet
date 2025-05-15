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
    player: (playerId: string) => `/player/${playerId}`,
  },
  solo: {
    root: '/solo',
    game: (gameId: string) => `/solo/${gameId}`,
    play: '/solo/play',
    watch: '/solo/watch',
    watchGame: (gameId: string) => `/solo/watch/${gameId}`,
  },
  duel: {
    root: '/duel',
    game: (gameId: string) => `/duel/${gameId}`,
    enterArena: '/duel/enter-arena',
    next: '/duel/next',
    watch: '/duel/watch',
  },
} as const
