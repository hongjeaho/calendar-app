import { atom } from 'recoil'

export const roomSelectedListState = atom<Date[]>({
  key: 'roomSelectedListState',
  default: [],
})
