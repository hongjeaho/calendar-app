import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { roomSelectedListState } from '@/store'

const DebugObserver: React.FC = () => {
  
  const selectedList = useRecoilValue<Date[]>(roomSelectedListState)

  useEffect(() => {
    console.log('==========')
    console.log(selectedList)
    console.log('==========')
    
  }, [selectedList])

  return null
}

export default DebugObserver