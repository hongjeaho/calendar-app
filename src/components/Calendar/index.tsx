import React from 'react'
import { type AccommoDatePrice } from '@/type'
import { format, startOfMonth, endOfMonth, getDay, getDate } from 'date-fns'
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

const Calendar: React.FC<Props> = ({ accommoDatePrice }) => {
  const currentDate = new Date()
  const DAYS = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <Base>
      <Title>{format(currentDate, 'yyyy.MM')}</Title>
      <Contents>
        <WeekHeader>
          {DAYS.map(day => (
            <Week key={day}>{day}</Week>
          ))}
        </WeekHeader>
        <CalendarBody accommoDatePrice={accommoDatePrice} currentDays={currentDays(currentDate)} />
      </Contents>
    </Base>
  )
}

export default Calendar
