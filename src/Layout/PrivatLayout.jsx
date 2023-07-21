import React from 'react'
import Sidebar from '../Component/Menu/Sidebar'
import { AiFillCloseCircle } from "react-icons/ai"
import { FaUserLock } from "react-icons/fa"

function PrivatLayout() {
  const [model, setModel] = React.useState(true);

  return (
    <>
      <div className=''>
        <Sidebar />
      </div>
    </>
  )
}

export default PrivatLayout