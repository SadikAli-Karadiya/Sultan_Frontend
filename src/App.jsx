import React, { useState } from 'react'
import './App.css'
import AppRoutes from './Routes'
import NetworkError from '../src/Component/NetworkError'

function App() {
  const [call, setCall] = useState(false)

  const updateOnlineStatus = () => {
    if(!navigator.onLine)
    {
      return <NetworkError/>
    }
    else{
      return (
       <>
       <AppRoutes/>
       </>
      )
    }
  }

  React.useEffect(()=>{
    updateOnlineStatus()
  }, [call])
  
  const rerender = ()=>{
    setCall(!call)
  }
  
  React.useEffect(() => {
    window.addEventListener('online', rerender)
    window.addEventListener('offline', rerender)
    
    return ()=>{
      window.removeEventListener('online', rerender);
      window.removeEventListener('offline', rerender);
    }
  })
  
  return updateOnlineStatus()
}

export default App
