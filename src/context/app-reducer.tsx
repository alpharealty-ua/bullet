import { StateGame } from '@/lib/constants'

interface SetBulletAction {
  type: 'set-bullet'
  payload: number
}
interface ChangeStateAction {
  type: 'change-state'
  payload: StateGame
}

interface SetBetAction {
  type: 'set-bet'
  payload: number
}
interface SetMultiplierIndexAction {
  type: 'set-multiplier-index'
  payload: number
}

interface GameState {
  stateHistory: StateGame[]
  state: StateGame
  bet: number
}
type Actions =
  | SetBulletAction
  | ChangeStateAction
  | SetBetAction
  | SetMultiplierIndexAction

export const initState: GameState = {
  stateHistory: ['preparation'],
  state: 'preparation',
  bet: 0,
}

export const appReducer = (state: GameState, action: Actions): GameState => {
  const { type, payload } = action

  switch (type) {
    case 'change-state': {
      const stateHistory = state.stateHistory
      if (stateHistory[stateHistory.length - 1] === payload) {
        return state
      }

      return {
        ...state,
        stateHistory: [...state.stateHistory, payload],
        state: payload,
      }
    }
    case 'set-bet':
      return { ...state, bet: payload }

    default:
      return state
  }
}
