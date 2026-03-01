import React from 'react'

function Featurecard(props) {
  return (
    <div className='flex flex-col gap-3 items-center justify-center w-22'>
      <div className='h-25 w-25 rounded-full bg-white flex justify-center items-center'>
        <img src={props.link} className='h-16'/>
      </div>
      <div className='text-white  font-medium text-center'>{props.content}</div>
    </div>
  )
}

export default Featurecard
