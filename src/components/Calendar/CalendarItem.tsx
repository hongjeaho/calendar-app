import styled from '@emotion/styled/macro'
import React, { useCallback } from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, isBefore, isAfter, isToday, differenceInCalendarDays, addDays } from 'date-fns'
import { useRecoilState } from 'recoil'
import { roomSelectedListState } from '@/store'
import { css } from '@emotion/react'

interface Props {
  weekRangeDays: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}


const Day = styled.div<{
  week: number | undefined
  isStart: boolean
  isStartEnd: boolean
  isIng: boolean
  isEnd: boolean
  isToday: boolean
  isPast: boolean
  isDisabled: boolean
}>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};

  ${({ isToday }) => (isToday && css`
    background-color: yellow;
  `)} 
  ${({ isStart }) => (isStart && css`
    background-color: red;
  `)}
  ${({ isStartEnd }) => (isStartEnd && css`
    background-color: green;
  `)}
  ${({ isIng }) => (isIng && css`
    background-color: blue;
  `)}
  ${({ isEnd }) => (isEnd && css`
    background-color: aqua;
  `)} 
  ${({ isPast }) => (isPast && css`
    color: #DCDCDC;
  `)};
  ${({ isDisabled }) => (isDisabled && css`
    color: #DCDCDC;
  `)};
`

const CalendarDate = styled.div``
const CalendarPrice = styled.div``

const CalendarItem: React.FC<Props> = ({ weekRangeDays, accommoDatePrice, dateFormat }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => weekRangeDays[index])
  const [selectedList, setSelectedList] = useRecoilState<Date[]>(roomSelectedListState)
  const toDay = new Date()

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
      if(isDisabled(currentDay)) return

      const rangeFunc = (start: Date, end: Date) => {
        const diffDay = differenceInCalendarDays(end, start)
        return Array(diffDay + 1)
          .fill(null)
          .map((_, index) => index)
          .map(day => addDays(start, day))
      }

      const isSelected = (selectedDay: Date | null) => {
        if (selectedDay == null) return false
  
        return selectedList
          .map(it => format(it, dateFormat))
          .includes(format(selectedDay, dateFormat))
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
    [selectedList, dateFormat],
  )

  const isDisabled = useCallback((currentDay: Date | null) => {
      if (currentDay == null) return true

      const isUsed = accommoDatePrice
        .map(accomm => accomm.date)
        .includes(format(currentDay, dateFormat))
      
      if(!isUsed) {
        return true
      }  

      return accommoDatePrice
      .filter(accomm => accomm.date === format(currentDay, dateFormat))
      .filter(accomm => accomm.price === 0 || accomm.stock === 0)
      .length === 1
      
  }, [accommoDatePrice])

  

  return (
    <>
      {items.map((item, index) => (
        <Day
          key={index}
          week={item?.getDay()}
          isStart={getSelectedIndex(item) === 1 && selectedList.length === 1}
          isStartEnd={getSelectedIndex(item) === 1 && selectedList.length > 1}
          isIng={getSelectedIndex(item) > 1 && getSelectedIndex(item) < selectedList.length}
          isEnd={getSelectedIndex(item) > 1 && getSelectedIndex(item) === selectedList.length}
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
