import { State, SettingsKeys } from '@/lib/constants'

interface SetBulletAction {
  type: 'set-bullet'
  payload: number
}
interface ChangeStateAction {
  type: 'change-state'
  payload: State
}

interface SetBetAction {
  type: 'set-bet'
  payload: number
}
interface SetMultiplierIndexAction {
  type: 'set-multiplier-index'
  payload: number
}

interface ChangeSettingsAction {
  type: 'change-settings'
  payload: Partial<Record<SettingsKeys, boolean>>
}
interface GameState {
  stateHistory: State[]
  state: State
  countBullet: number
  bet: number
  activeMultiplierIndex: number
  settings: Record<SettingsKeys, boolean>
}
type Actions =
  | SetBulletAction
  | ChangeStateAction
  | SetBetAction
  | SetMultiplierIndexAction
  | ChangeSettingsAction

export const initState: GameState = {
  stateHistory: ['preparation'],
  state: 'preparation',
  countBullet: 5,
  bet: 0,
  activeMultiplierIndex: -1,
  settings: {
    music: true,
    soundEffects: true,
    invertButtons: false,
    blood: false,
    declineAllDeals: false,
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
    case 'set-bet':
      return { ...state, bet: payload }
    case 'set-multiplier-index':
      return { ...state, activeMultiplierIndex: payload }
    case 'change-settings':
      return { ...state, settings: { ...state.settings, ...payload } }
    default:
      return state
  }
}
