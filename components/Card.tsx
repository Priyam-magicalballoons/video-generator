import { BookHeart, BookImage, Video } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface CardProps {
    text : string
    icon : string
    onclick : ()=>void
}

const Card = ({text,icon,onclick}:CardProps) => {
  return (
    <div className='flex items-center w-full' onClick={onclick}>
      <div className='w-[40%] flex items-center justify-start pl-5'>
        <img src={icon} alt={text} height={70} width={70} className=' border-primary border rounded-full p-1'/>
      </div>
      <div className='w-[60%] flex justify-start text-primary font-semibold group-hover:text-white group'>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default Card
