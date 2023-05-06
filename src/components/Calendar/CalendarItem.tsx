import styled from '@emotion/styled/macro'
import React from 'react'
import { type AccommoDatePrice } from '@/type'
import { format } from 'date-fns'
interface Props {
  days: Array<Date | null>
  accommoDatePrice: AccommoDatePrice[]
}

const Day = styled.div<{ week: number | undefined }>`
  width: 100%;
  text-align: center;
  color: ${({ week }) => (week === 0 ? 'red' : '#000')};
`

const Date = styled.div``
const Price = styled.div``

const CalendarItem: React.FC<Props> = ({ days, accommoDatePrice }) => {
  const items = Array.from({ length: 7 }, (_, index: number) => days[index])
  console.dir(items)

  return (
    <>
      {items.map((item, index) => (
        <Day key={index} week={item?.getDay()}>
          <Date>{item?.getDate()}</Date>
          <Price>
            {item != null &&
              accommoDatePrice
                .filter(accommo => accommo.date === format(item, 'yyyy.MM.dd'))
                .map(accommo => accommo.price)}
          </Price>
        </Day>
      ))}
    </>
  )
}

export default CalendarItem
