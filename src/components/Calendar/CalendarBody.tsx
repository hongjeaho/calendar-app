import { type AccommoDatePrice } from '@/type'
import React from 'react'
import CalendarItem from './CalendarItem'
import styled from '@emotion/styled/macro'

interface Props {
  currentDays: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}

const Week = styled.div`
  display: flex;
`

const CalendarBody: React.FC<Props> = ({ currentDays, accommoDatePrice, dateFormat }) => {
  const weekNum = 7
  const weeks = Math.ceil(currentDays.length / weekNum)

  return (
    <>
      {[...Array(weeks).keys()].map(week => (
        <Week key={week}>
          <CalendarItem
            days={currentDays.slice(week * weekNum, week * weekNum + weekNum)}
            accommoDatePrice={accommoDatePrice}
            dateFormat={dateFormat}
          />
        </Week>
      ))}
    </>
  )
}

export default CalendarBody
