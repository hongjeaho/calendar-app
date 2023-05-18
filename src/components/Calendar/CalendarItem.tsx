import styled from '@emotion/styled/macro'
import React, { useCallback } from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, isBefore, isAfter, isToday, differenceInCalendarDays, addDays } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import { roomSelectedIndexs, roomSelectedListState } from '@/store'
import { css } from '@emotion/react'

interface Props {
  weekRangeDays: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
  rangeDisabledDay: Record<string, boolean>
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

const CalendarItem: React.FC<Props> = ({ weekRangeDays, accommoDatePrice, dateFormat, rangeDisabledDay }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => weekRangeDays[index])
  const [selectedList, setSelectedList] = useRecoilState<Date[]>(roomSelectedListState)
  const selectedIndexs = useRecoilValue(roomSelectedIndexs(dateFormat))

  const toDay = new Date()

  const onSelected = useCallback(
    (currentDay: Date | null) => {
      if (currentDay == null) return

      const toDay = new Date();      
      const lastSelectedDay = selectedList[selectedList.length - 1]
      const firstSelectedDay = selectedList[0]

      if(differenceInCalendarDays(currentDay, toDay) < 0) return
      if(rangeDisabledDay[format(currentDay, dateFormat)]) return

      const rangeFunc = (start: Date, end: Date, isLast:boolean) => {
        const diffDay = differenceInCalendarDays(end, start)
        
        return Array(diffDay + (isLast ? 0 : 1))
          .fill(null)
          .map((_, index) => index + (isLast ? 1 : 0))
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
        const ranges = rangeFunc(currentDay, firstSelectedDay, false)
        tempDays = [...ranges, ...selectedList]
      } else if (lastSelectedDay !== undefined && isBefore(lastSelectedDay, currentDay)) {
        const ranges = rangeFunc(lastSelectedDay, currentDay, true)
        tempDays = [...selectedList, ...ranges]
      }

      setSelectedList(tempDays)
    },
    [selectedList, dateFormat],
  )

  return (
    <>
      {items.map((item, index) => {
        const formattedDate = (item != null) ? format(item, dateFormat) : ''
        return (
          <Day
            key={index}
            week={item?.getDay()}
            isStart={selectedIndexs[formattedDate] === 1 && selectedList.length === 1}
            isStartEnd={selectedIndexs[formattedDate] === 1 && selectedList.length > 1}
            isIng={selectedIndexs[formattedDate] > 1 && selectedIndexs[formattedDate] < selectedList.length}
            isEnd={selectedIndexs[formattedDate] > 1 && selectedIndexs[formattedDate] === selectedList.length}
            isToday={(item != null) && isToday(item)}
            isPast={(item != null) && differenceInCalendarDays(item, toDay) < 0}
            isDisabled={item == null || rangeDisabledDay[formattedDate]}
            onClick={() => {
              onSelected(item)
            }}
          >
            <CalendarDate>{item?.getDate()}</CalendarDate>
            <div>{}</div>
            <CalendarPrice>
              {item != null &&
                accommoDatePrice
                  .filter(accommo => accommo.date === format(item, dateFormat))
                  .map(accommo => `${accommo.price} (${accommo.stock})`)}
            </CalendarPrice>
          </Day>
        )
      })}
    </>
  )
}

export default CalendarItem
