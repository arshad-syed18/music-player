import { useState } from 'react'
import AudioPlayer from './AudioPlayer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <AudioPlayer />
      </div>
    </>
  )
}

export default App
