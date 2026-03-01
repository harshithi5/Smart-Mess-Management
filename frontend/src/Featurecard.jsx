// src/Featurecard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Featurecard(props) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (props.path) navigate(props.path)
  }

  return (
    <div
      className={`flex flex-col gap-3 items-center justify-center w-22 ${props.path ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={handleClick}
    >
      <div className='h-25 w-25 rounded-full bg-white flex justify-center items-center'>
        <img src={props.link} className='h-16' />
      </div>
      <div className='text-white font-medium text-center'>{props.content}</div>
    </div>
  )
}

export default Featurecard