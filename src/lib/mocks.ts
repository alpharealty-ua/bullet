import { addId } from './utils'

export const mockMessageList = addId([
  {
    user: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
]) satisfies Message[] as Message[]

export const mockWagerList = addId([
  {
    user: 'BILL2',
    money: 1000,
    result: 'win',
  },
  {
    user: 'HARVY',
    money: 500,
    result: 'lose',
  },
  {
    user: 'SMART',
    money: 1000,
    result: 'lose',
  },
  {
    user: 'FIREA',
    money: 2000,
    result: 'lose',
  },
]) satisfies Wager[] as Wager[]
