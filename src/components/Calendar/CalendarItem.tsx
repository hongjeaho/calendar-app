import styled from '@emotion/styled/macro'
import React, { useCallback } from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, getDate } from 'date-fns'
import { useRecoilState } from 'recoil'
import { roomSelectedListState } from '@/store'

interface Props {
  days: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}

const Day = styled.div<{
  week: number | undefined
  isSelected: boolean
  isStart: boolean
  isIng: boolean
  isEnd: boolean
}>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};
  background-color: ${({ isSelected }) => (isSelected ? 'aqua' : '#fff')};

  ${({ isStart }) => (isStart ? 'border-color: rosybrown' : '')}
  ${({ isIng }) => (isIng ? 'border-color: red' : '')}
  ${({ isEnd }) => (isEnd ? 'border-color: white' : '')}
`

const CalendarDate = styled.div``
const CalendarPrice = styled.div``

const CalendarItem: React.FC<Props> = ({ days, accommoDatePrice, dateFormat }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => days[index])
  const [selectedList, setSelectedList] = useRecoilState<Date[]>(roomSelectedListState)

  const isSelected = useCallback(
    (selectedDay: Date | null) => {
      if (selectedDay == null) return false

      return selectedList
        .map(it => format(it, dateFormat))
        .includes(format(selectedDay, dateFormat))
    },
    [selectedList],
  )

  const getSelectedIndex = useCallback(
    (selectedDay: Date | null) => {
      if (selectedDay == null) return -1
      if (selectedList.length === 0) return -1

      return (
        selectedList
          .map(it => format(it, dateFormat))
          .findIndex(it => it === format(selectedDay, dateFormat)) + 1
      )
    },
    [selectedList],
  )

  const onSelected = useCallback(
    (item: Date | null) => {
      if (item == null) return

      const currentDay = getDate(item)
      const lastSelectedDay = getDate(selectedList[selectedList.length - 1])
      const firstSelectedDay = getDate(selectedList[0])

      const rangeFunc = (start: number, end: number, baseDate: Date) => {
        return Array(end - start + 1)
          .fill(null)
          .map((_, index) => start + index)
          .map(day => new Date(item.getFullYear(), item.getMonth(), day))
      }

      let tempDays: Date[] = []
      if (isSelected(item) || selectedList.length === 0) {
        tempDays = [item]
      } else if (firstSelectedDay !== undefined && firstSelectedDay > currentDay) {
        const ranges = rangeFunc(currentDay, firstSelectedDay, item)
        tempDays = [...ranges, ...selectedList]
      } else if (lastSelectedDay !== undefined && lastSelectedDay < currentDay) {
        const ranges = rangeFunc(lastSelectedDay, currentDay, selectedList[selectedList.length - 1])
        tempDays = [...selectedList, ...ranges]
      }

      setSelectedList(tempDays)
    },
    [selectedList],
  )

  return (
    <>
      {items.map((item, index) => (
        <Day
          key={index}
          week={item?.getDay()}
          isSelected={isSelected(item)}
          isStart={getSelectedIndex(item) === 1}
          isIng={getSelectedIndex(item) > 1 && getSelectedIndex(item) < selectedList.length}
          isEnd={getSelectedIndex(item) === selectedList.length}
          onClick={() => {
            onSelected(item)
          }}
        >
          <CalendarDate>{item?.getDate()}</CalendarDate>
          <CalendarPrice>
            {item != null &&
              accommoDatePrice
                .filter(accommo => accommo.date === format(item, dateFormat))
                .map(accommo => accommo.price)}
          </CalendarPrice>
        </Day>
      ))}
    </>
  )
}

export default CalendarItem
