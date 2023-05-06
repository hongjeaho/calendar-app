import styled from '@emotion/styled/macro'
import React from 'react'
import { type AccommoDatePrice } from '@/type'
import { format } from 'date-fns'
interface Props {
  days: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
  dateFormat: string
  selectedList: Date[]
  onSelected: (date: Date | null) => void
}

const Day = styled.div<{ week: number | undefined; isSelected: boolean }>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};
  background-color: ${({ isSelected }) => (isSelected ? 'aqua' : '#fff')};
`

const Date = styled.div``
const Price = styled.div``

const CalendarItem: React.FC<Props> = ({
  days,
  accommoDatePrice,
  dateFormat,
  selectedList,
  onSelected,
}) => {
  const items = Array.from({ length: 7 }, (_, index: number) => days[index])

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
