import React from 'react'
import { Link } from 'react-router-dom'
// import { HiArrowLeft } from "react-icons/hi"
import { FiKey } from "react-icons/fi"
import { useFormik } from 'formik'
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "yup-phone"
const image = "/7xm.xyz172560.jpg"

const signUpSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email")
});

const initialValues = {
  email: ""
};

function ForgetPassword() {


  const notify = () => toast("Link Send Successfully!!");
  const [isOnSubmit, setIsOnSubmit] = React.useState(false);
  const navigate = useNavigate();


  const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    onSubmit(res) {
      setIsOnSubmit(true)
      notify()
      setTimeout(function () {
        navigate("/NewPassword")
      }, 2000);

    }
  })

  return (
    <div className='flex sm:justify-center lg:justify-start xl:justify-between items-center h-screen bg-white px-10 lg:px-20'>
      <div className="img lg:w-[500px] lg:h-[500px] xl:w-[650px] xl:h-[650px] 2xl:h-[700px] 2xl:w-[700px] hidden lg:block">
        <img src={image} alt="landing" className="" />
      </div>
      <div className='lg:px-10 lg:py-10  lg:relative 2xl:right-20'>
        <div className='flex justify-center items-center mt-4 py-5 '>
          <div className='bg-blue-200 px-2 py-2 rounded-full'>
            <div className='bg-blue-300 px-2 py-2 rounded-full'>
              <FiKey className='  text-blue-800 rounded-full  text-xl ' />
            </div>
          </div>
        </div>
        <div className='py-3 space-y-3'>
          <h1 className='text-3xl font-bold text-center'>Reset your password</h1>
          <div className={`${isOnSubmit ? "hidden" : "block"}`}>
            <p className='font-semibold text-gray-500 text-center text-xs sm:text-base '>No worries. we'll send you reset password link.</p>
            <p className='font-semibold text-gray-500 text-center text-xs sm:text-base '>On your Email or SMS</p>
          </div>
          <div className={`${isOnSubmit ? "block" : "hidden"}`}>
            <p className='font-semibold text-gray-500 text-center text-xs sm:text-base '>The verification link is  send to on Mail or SMS.</p>
            <p className='font-semibold text-gray-500 text-center text-xs sm:text-base '>Please check it.</p>
          </div>
        </div>
        <div className={`${isOnSubmit ? "hidden" : "block"} py-3`}>
          <form action="" className=' space-y-2' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <label htmlFor="Email" className='font-semibold text-base'>Email</label>
              <input type="Email"
                value={values.email}
                placeholder='Enter Your Email'
                autoComplete='off'
                name='email'
                id='email'
                onChange={handleChange}
                onBlur={handleBlur}
                className='w-full rounded-md py-2 px-3 outline-non border border-slate-300 focus:outline-blue-500' />
              {errors.email && touched.email
                ?
                <p className='form-error text-red-600 text-sm font-semibold'>{errors.email}</p>
                :
                null}
            </div>

            <div className='py-5'>
              <button type='submit' className='py-2 bg-blue-500 hover:text-blue-500 active:outline-none hover:shadow-none hover:border-blue-500 border-blue-500 border hover:bg-white hover:text-bbg-blue-500 duration-500 shadow-sm font-sans shadow-blue-500 px-20 rounded-md w-full text-white font-semibold text-base'>
                Reset Password
              </button>
            </div>
          </form>

        </div>
        <Link to={"/"}>
          <div className='flex justify-center py-3 items-center font-semibold text-slate-400 cursor-pointer hover:text-black space-x-2'>
            <ion-icon name="arrow-back-outline"></ion-icon>
            <p className=''>Back to Log in</p>
          </div>
        </Link>
      </div>
    </div>
  )
}




export default ForgetPassword
