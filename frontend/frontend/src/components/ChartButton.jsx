// src/components/ChartButton.jsx
import { useState } from 'react'
import ChartModal from './ChartModal'

export default function ChartButton() {
  const [showChart, setShowChart] = useState(false)
  
  return (
    <>
      <ChartModal open={showChart} onClose={()=>setShowChart(false)} />
      <button className='btn-primary' onClick={()=>setShowChart(true)}>
        View Research Output Chart
      </button>
    </>
  )
}