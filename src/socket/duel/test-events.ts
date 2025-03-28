export const createTestEvents = (playerId?: string) => ({
  connect: { type: 'connect', payload: undefined },
  readyTakePull: {
    ready: { type: 'game:ready', payload: 'ready' },
    take: { type: 'game:take', payload: 'take' },
    pull: { type: 'game:pull', payload: 'pull' },
  },
  pullResult: {
    player: (fired: boolean) => ({
      type: 'game:pull_result',
      payload: { playerId, fired } as any,
    }),
    opponent: (fired: boolean) => ({
      type: 'game:pull_result',
      payload: { playerId: undefined, fired } as any,
    }),
  },
  gameEnded: {
    draw: {
      type: 'game:ended',
      payload: {
        gameId: '1',
        message: 'draw',
      },
    },
  },
})
