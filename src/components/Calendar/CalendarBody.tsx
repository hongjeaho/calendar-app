import { type AccommoDatePrice } from '@/type'
import React, { useCallback } from 'react'
import CalendarItem from './CalendarItem'
import styled from '@emotion/styled/macro'
import { format } from 'date-fns'

interface Props {
  rangeDays: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}

const Week = styled.div`
  display: flex;
`

const CalendarBody: React.FC<Props> = ({ rangeDays, accommoDatePrice, dateFormat }) => {
  const weekNum = 7
  const weeks = Math.ceil(rangeDays.length / weekNum)

  const rangeDisabledDays = useCallback((rangeDays: Array<Date | null>, accommoDatePrice: AccommoDatePrice[], dateFormat: string) => {
    
    const rangeDisabledDay: Record<string, boolean> = {}; 
    const monthDays = rangeDays.map(date => date !== null ? format(date, dateFormat) : '')
      
    monthDays.forEach((day, index) => {
      if(day === null) {
        rangeDisabledDay[day] = false
        return
      }

      const accomm = accommoDatePrice
        .filter(accomm => accomm.date === day)[0]
  
      const isDisabled = accomm !== undefined ? (accomm.price === 0 || accomm.stock === 0) : true
      rangeDisabledDay[day] = isDisabled
    })
  
    return rangeDisabledDay
  }, [rangeDays, accommoDatePrice, dateFormat])

  return (
    <>
      {[...Array(weeks).keys()].map(week => (
        <Week key={week}>
          <CalendarItem
            weekRangeDays={rangeDays.slice(week * weekNum, week * weekNum + weekNum)}
            accommoDatePrice={accommoDatePrice}
            dateFormat={dateFormat}
            rangeDisabledDay={rangeDisabledDays(rangeDays, accommoDatePrice, dateFormat )}
          />
        </Week>
      ))}
    </>
  )
}

export default CalendarBody
