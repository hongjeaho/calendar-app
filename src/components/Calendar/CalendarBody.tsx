import { type AccommoDatePrice } from '@/type'
import React, { useState, useCallback } from 'react'
import CalendarItem from './CalendarItem'
import styled from '@emotion/styled/macro'
import { getDate, subDays, addDays } from 'date-fns'

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
  const [selectedList, setSelectedList] = useState<Date[]>([])

  const onSelected = useCallback(
    (item: Date | null) => {
      if (item == null) return

      let days: Date[] = []

      const lastSelectedDay = getDate(selectedList[selectedList.length - 1])
      const firstSelectedDay = getDate(selectedList[0])
      const preDay = getDate(subDays(item, 1))
      const nextDay = getDate(addDays(item, 1))

      if (firstSelectedDay !== undefined && firstSelectedDay === nextDay) {
        days = [item, ...selectedList]
      } else if (lastSelectedDay !== undefined && lastSelectedDay !== preDay) {
        days = [item]
      } else if (selectedList.includes(item)) {
        days = selectedList.filter(day => item !== day)
      } else {
        days = [...selectedList, item]
      }

      setSelectedList(days)
    },
    [selectedList],
  )

  return (
    <>
      {[...Array(weeks).keys()].map(week => (
        <Week key={week}>
          <CalendarItem
            days={currentDays.slice(week * weekNum, week * weekNum + weekNum)}
            accommoDatePrice={accommoDatePrice}
            dateFormat={dateFormat}
            selectedList={selectedList}
            onSelected={onSelected}
          />
        </Week>
      ))}
    </>
  )
}

export default CalendarBody
