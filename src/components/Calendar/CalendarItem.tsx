import styled from '@emotion/styled/macro'
import React, { useCallback } from 'react'
import { type AccommoDatePrice } from '@/type'
import { addDays, format, getDate, subDays } from 'date-fns'
import { useRecoilState } from 'recoil'
import { roomSelectedListState } from '@/store'

interface Props {
  days: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
}

const Day = styled.div<{ week: number | undefined; isSelected: boolean }>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};
  background-color: ${({ isSelected }) => (isSelected ? 'aqua' : '#fff')};
`

const Date = styled.div``
const Price = styled.div``

const CalendarItem: React.FC<Props> = ({ days, accommoDatePrice, dateFormat }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => days[index])
  const [selectedList, setSelectedList] = useRecoilState<Date[]>(roomSelectedListState)

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
      {items.map((item, index) => (
        <Day
          key={index}
          week={item?.getDay()}
          isSelected={item !== null && selectedList.includes(item)}
          onClick={() => {
            onSelected(item)
          }}
        >
          <Date>{item?.getDate()}</Date>
          <Price>
            {item != null &&
              accommoDatePrice
                .filter(accommo => accommo.date === format(item, dateFormat))
                .map(accommo => accommo.price)}
          </Price>
        </Day>
      ))}
    </>
  )
}

export default CalendarItem
