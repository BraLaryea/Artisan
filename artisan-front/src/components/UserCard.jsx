import React from 'react'
import Carpenter from '../assets/Carpenter.svg'
import image from '../assets/image copy.png'
import location from '../assets/Location.svg'
import Star from '../assets/Star.svg'

const UserCard = ({image, name, rating, profession, distance} ) => {
  return (
    <div className='bg-accent w-[60%] rounded-xl mt-5 flex'>
      <div>
        <img src={image} alt="" width={100} height={100} className='rounded-full m-3' />
      </div>
      <div className='flex flex-col justify-center ml-10'>
        <h1 className='text-2xl font-poppins-medium text-text'>
          {name}
        </h1>
        <p className='text-sm font-poppins-light text-[#D3D3D3] -mt-1'>
          {profession}
        </p>
        <div className='flex'>
          <img src={location} alt="" width={40} height={40} className=' -ml-3 mt-2 ' />
          <p className='mt-[10.5px] -ml-2 text-text font-poppins-light text-sm'>{distance} km</p>
          <img src={Star} alt="" width={30} height={30} className=' ml-3 mt-2 ' />
          <p className='mt-[12.5px] text-text font-poppins-medium text-sm'>{rating}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
