import { addId } from '@/lib/utils'
import { Message } from '@/components/bar/side-chat'
import { Wager } from '@/components/bar/live-wagers'

export const mockMessageUSAList = addId([
  {
    user: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    user: 'DeucesDive',
    message: 'This should be interesting.',
  },
]) satisfies Message[] as Message[]

export const mockMessageChinaList = addId([
  {
    user: 'ChinaUser',
    message: '',
  },
]) satisfies Message[] as Message[]

export const mockMessageMexicoList = addId([
  {
    user: 'MexicoUser',
    message: '',
  },
]) satisfies Message[] as Message[]

export const mockRooms = {
  usa: mockMessageUSAList,
  china: mockMessageChinaList,
  mexico: mockMessageMexicoList,
}

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
