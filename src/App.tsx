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
      price: parseInt(`${day}000`),
    })
  }

  return sampleData
}

function App() {
  return (
    <div>
      <Calendar accommoDatePrice={getDemoData()} dateFormat={'yyyy.MM.dd'} />
    </div>
  )
}

export default App
