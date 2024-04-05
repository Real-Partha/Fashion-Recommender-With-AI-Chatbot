import { useState } from 'react'
import './App.css'
import Chatbot from './components/Chatbot'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Chatbot userId={1234}/>
    </>
  )
}

export default App
