import React from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, startOfMonth, endOfMonth, getDay, getDate, parse, differenceInCalendarMonths, addMonths } from 'date-fns'
import styled from '@emotion/styled/macro'
import CalendarBody from './CalendarBody'

const Base = styled.div``

const Title = styled.div`
  margin: 0;
  padding: 8ox 24px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  color: #000;
`

const Contents = styled.div``

const WeekHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Week = styled.div`
  width: 100%;
  text-align: center;
`

interface Props {
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
  startDate: string
  endDate: string
}

const currentDays = (currentDay: Date) => {
  const startDay = startOfMonth(currentDay)
  const lastDay = endOfMonth(currentDay)

  const blank = Array(getDay(startDay)).fill(null)
  const range = Array(getDate(lastDay))
    .fill(null)
    .map((_, index) => new Date(currentDay.getFullYear(), currentDay.getMonth(), index + 1))

  return [...blank, ...range]
}

const Calendar: React.FC<Props> = ({ accommoDatePrice, dateFormat, startDate, endDate }) => {
  const currentDate = new Date()
  const start = parse(startDate, dateFormat, currentDate)
  const end = parse(endDate, dateFormat, currentDate)
  const diffMonthNumber = differenceInCalendarMonths(end, start) + 1
  const loopMonths = Array.from({length: diffMonthNumber}).map((_, index) => index)

  const DAYS = ['일', '월', '화', '수', '목', '금', '토']

/***
 * startEnd css
 * past / disaveld >> 선택 못하게...
 *    >> 제고가 없거나, 가격이 0이거나, 가격이 없는경우 : disabled
 *    >> 오늘날짜 이전은 선택못하게
 */



  return (
    <div>
      {loopMonths.map(month => (
        <Base key={month}>
          <Title>{format(addMonths(start, month), 'yyyy.MM')}</Title>
          <Contents>
            <WeekHeader>
              {DAYS.map(day => (
                <Week key={day}>{day}</Week>
              ))}
            </WeekHeader>
            <CalendarBody
              accommoDatePrice={accommoDatePrice}
              currentDays={currentDays(addMonths(start, month))}
              dateFormat={dateFormat}
            />
          </Contents>
        </Base>
      ))}
    </div>
  )
}

export default Calendar
