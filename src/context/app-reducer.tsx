import { State, SettingsKeys, INIT_BALANCE } from '@/lib/constants'

interface SetBulletAction {
  type: 'set-bullet'
  payload: number
}
interface ChangeStateAction {
  type: 'change-state'
  payload: State
}
interface UndoStateAction {
  type: 'undo-state'
  // eslint-disable-next-line
  payload?: any
}
interface SetBalanceAction {
  type: 'set-balance'
  payload: number
}
interface AddBalanceAction {
  type: 'add-balance'
  payload: number
}
interface SetBetAction {
  type: 'set-bet'
  payload: number
}
interface SetMultiplierIndexAction {
  type: 'set-multiplier-index'
  payload: number
}

interface ChangeShowHelpersAction {
  type: 'set-show-helpers'
  payload: boolean
}
interface ChangeSettingsAction {
  type: 'change-settings'
  payload: Partial<Record<SettingsKeys, boolean>>
}
interface GameState {
  stateHistory: State[]
  state: State
  countBullet: number
  balance: number
  bet: number
  activeMultiplierIndex: number
  showHelpers: boolean
  settings: Record<SettingsKeys, boolean>
}
type Actions =
  | SetBulletAction
  | ChangeStateAction
  | UndoStateAction
  | SetBalanceAction
  | AddBalanceAction
  | SetBetAction
  | SetMultiplierIndexAction
  | ChangeShowHelpersAction
  | ChangeSettingsAction

export const initState: GameState = {
  stateHistory: ['cover'],
  state: 'cover',
  countBullet: 5,
  balance: INIT_BALANCE,
  bet: 0,
  activeMultiplierIndex: -1,
  showHelpers: true,
  settings: {
    music: true,
    soundEffects: true,
    invertButtons: false,
    blood: false,
  },
}

export const appReducer = (state: GameState, action: Actions): GameState => {
  const { type, payload } = action

  switch (type) {
    case 'set-bullet':
      return {
        ...state,
        countBullet: payload,
      }
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
    case 'undo-state': {
      const stateHistory = [...state.stateHistory]
      stateHistory.pop()
      const newState = stateHistory[stateHistory.length - 1]
      return {
        ...state,
        stateHistory,
        state: newState,
      }
    }
    case 'set-balance':
      return { ...state, balance: payload }
    case 'add-balance':
      return { ...state, balance: state.balance + payload }
    case 'set-bet':
      return { ...state, bet: payload }
    case 'set-multiplier-index':
      return { ...state, activeMultiplierIndex: payload }
    case 'set-show-helpers':
      if (state.showHelpers === payload) {
        return state
      }
      return { ...state, showHelpers: payload }
    case 'change-settings':
      return { ...state, settings: { ...state.settings, ...payload } }
    default:
      return state
  }
}
