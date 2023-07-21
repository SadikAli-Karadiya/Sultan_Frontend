import React from 'react'
import { Link} from 'react-router-dom'
import { HiArrowLeft } from "react-icons/hi"
const image = "/Screenshot (66).png"
import Newpassword from '../../assets/Newpassword'




function NewPassword() {




    return (
        <div className='flex sm:justify-center lg:justify-start xl:justify-between items-center h-screen bg-white px-10 lg:px-20'>
            <div className="img  hidden lg:block">
                <img src={image} alt="landing" className="lg:w-[500px] lg:h-[400px]  xl:w-[650px] xl:h-[500px] 2xl:h-[500px] 2xl:w-[700px]" />
            </div>
            <div className='lg:px-10 lg:py-10  lg:relative 2xl:right-20'>
                <Newpassword />
                <Link to={"/"}>
                    <div className='flex justify-center  items-center font-semibold text-slate-400 cursor-pointer hover:text-black space-x-2'>
                        <HiArrowLeft className='text-xl' />
                        <p className=''>Back to Log in</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default NewPassword