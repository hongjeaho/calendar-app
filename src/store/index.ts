import { atom, selectorFamily } from 'recoil'
import { format } from 'date-fns'

export const roomSelectedListState = atom<Date[]>({
  key: 'roomSelectedListState',
  default: [],
})

export const roomSelectedIndexs = selectorFamily<Record<string, number>, string>({
  key: 'roomSelectedIndexs',
  get: (dateFormat) => ({ get }) => {
    const roomSelectedList = get(roomSelectedListState);
    return roomSelectedList.reduce((acc, cur, index) => {
      const key = format(cur, dateFormat);
      return { ...acc, [key]: index + 1 };
    }, {});
  },
});