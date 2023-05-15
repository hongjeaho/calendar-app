import React from 'react'
import { type AccommoDatePrice } from './type'
import { format, endOfMonth } from 'date-fns'
import Calendar from './components/Calendar'

function getDemoData() {
  const toDay = new Date()
  const sampleData: AccommoDatePrice[] = []
  const lastDate = endOfMonth(toDay)

  for (let day = 1; day <= lastDate.getDate(); day++) {
    sampleData.push({
      date: format(new Date(toDay.getFullYear(), toDay.getMonth(), day), 'yyyy.MM.dd'),
      stock: day - 1,
      price: parseInt(`${day}000`),
    })
  }

  return sampleData
}

function App() {
  return (
    <div>
      <Calendar accommoDatePrice={getDemoData()} dateFormat={'yyyy.MM.dd'} startDate='2023.05.01'  endDate='2023.09.30'/>
    </div>
  )
}

export default App
