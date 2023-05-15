import styled from '@emotion/styled/macro'
import React, { useCallback } from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, isBefore, isAfter, isToday, differenceInCalendarDays, addDays } from 'date-fns'
import { useRecoilState } from 'recoil'
import { roomSelectedListState } from '@/store'
import { css } from '@emotion/react'

interface Props {
  days: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}

const isStartBackGroundCss = css`
  background-color: blue;
`

const Day = styled.div<{
  week: number | undefined
  isSelected: boolean
  isStart: boolean
  isIng: boolean
  isEnd: boolean
  isToday: boolean
  isPast: boolean
  isDisabled: boolean
}>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};
  background-color: ${({ isSelected }) => (isSelected ? 'aqua' : '#fff')};

  ${({ isStart }) => (isStart ? '' : '')}
  ${({ isIng }) => (isIng && isStartBackGroundCss)}
  ${({ isEnd }) => (isEnd ? 'border-color: white;' : '')} 
  ${({ isToday }) => (isToday ? 'background-color: yellow;' : '')} 
  ${({ isPast }) => (isPast ? 'color: #DCDCDC' : 'color: #000')};
`

const CalendarDate = styled.div``
const CalendarPrice = styled.div``

const CalendarItem: React.FC<Props> = ({ days, accommoDatePrice, dateFormat }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => days[index])
  const [selectedList, setSelectedList] = useRecoilState<Date[]>(roomSelectedListState)
  const toDay = new Date()

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
    (currentDay: Date | null) => {
      if (currentDay == null) return

      const toDay = new Date();      
      const lastSelectedDay = selectedList[selectedList.length - 1]
      const firstSelectedDay = selectedList[0]

      if(differenceInCalendarDays(currentDay, toDay) < 0) return

      const rangeFunc = (start: Date, end: Date) => {
        const diffDay = differenceInCalendarDays(end, start)
        return Array(diffDay + 1)
          .fill(null)
          .map((_, index) => index)
          .map(day => addDays(start, day))
      }

      let tempDays: Date[] = []
      if (isSelected(currentDay) || selectedList.length === 0) {
        tempDays = [currentDay]
      } else if (firstSelectedDay !== undefined && isAfter(firstSelectedDay, currentDay)) {
        const ranges = rangeFunc(currentDay, firstSelectedDay)
        tempDays = [...ranges, ...selectedList]
      } else if (lastSelectedDay !== undefined && isBefore(lastSelectedDay, currentDay)) {
        const ranges = rangeFunc(lastSelectedDay, currentDay)
        tempDays = [...selectedList, ...ranges]
      }

      setSelectedList(tempDays)
    },
    [selectedList],
  )

  const isDisabled = useCallback((currentDay: Date | null) => {
      if (currentDay == null) return true

      return accommoDatePrice
      .filter(accommo => accommo.date === format(currentDay, dateFormat))
      .filter(accommo => accommo.price > 0 || accommo.stock > 0)
      .length === 1
      
  }, [accommoDatePrice])

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
          isToday={(item != null) && isToday(item)}
          isPast={(item != null) && differenceInCalendarDays(item, toDay) < 0}
          isDisabled={item == null || isDisabled(item)}
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
