import React from 'react'
import { type AccommoDatePrice } from './type'
import { format, getDate, parse, differenceInCalendarDays, addDays } from 'date-fns'
import Calendar from './components/Calendar'

function getDemoData(start: string, end: string, dateFormat: string) {
  const toDay = new Date()

  const sampleData: AccommoDatePrice[] = []
  const firstDate = parse(start, dateFormat, toDay)
  const lastDate = parse(end, dateFormat, toDay)
  const diffDays = differenceInCalendarDays(lastDate, firstDate)

  for (let day = getDate(firstDate); day <= diffDays; day++) {
    const stock = day - 5 < 0 ? 0 : day - 5
    sampleData.push({
      date: format(addDays(firstDate, day), dateFormat),
      stock,
      price: parseInt(`${day}000`),
    })
  }

  return sampleData
}

function App() {
  const startDate = '2023.05.05'
  const endDate = '2023.09.22'
  const dateFormat = 'yyyy.MM.dd'

  return (
    <div>
      <Calendar
        accommoDatePrice={getDemoData(startDate, endDate, dateFormat)}
        dateFormat={dateFormat}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}

export default App
