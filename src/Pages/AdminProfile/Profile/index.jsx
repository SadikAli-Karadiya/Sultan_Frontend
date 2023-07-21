import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { MdDone } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Admindetails, UpdateAdmin } from "../../../utils/apiCalls"
import { useQuery, useMutation } from 'react-query'
import { PhoneContext } from "../../../PhoneContext";
import LoaderBig from '../../../Component/LoaderBig'


let adminSchema = Yup.object({

  first_name: Yup.string()
    .matches(/^[A-Za-z ]+$/, 'Please enter only letters')
    .test('trim', 'Must not contain leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value;
      }
      return true;
    })
    .min(2, "Minimum 2 characters are required")
    .required("Please Enter First Name")
    .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

  last_name: Yup.string()
    .matches(/^[A-Za-z ]+$/, 'Please enter only letters')
    .test('trim', 'Must not contain leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value;
      }
      return true;
    })
    .min(2, "Minimum 2 characters are required")
    .required("Please Enter Last Name")
    .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

  username: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Please enter only letters')
    .test('trim', 'Must not contain leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value;
      }
      return true;
    })
    .required("Please Enter Username"),
    
  password: Yup.string()
    .test('trim', 'Must not contain leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value;
      }
      return true;
    })
    .min(8, "Minimum 8 characters are required")
    .max(20, "Maximum 20 characters are allowed"),

  pin: Yup.string()
    .matches(/^[0-9]+$/, 'Please enter only numbers')
    .test('trim', 'Must not contain leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value;
      }
      return true;
    })
    .min(4, "Minimum 4 digits are required")
    .max(6, "Maximum 6 digits are allowed")
    .required("Please Enter PIN"),
});


const Updateprofile = () => {
  const { user } = React.useContext(PhoneContext)
  
  const [toggle, setToggle] = React.useState(false);
  const [isEnable, setIsEnable] = useState(true);
  const adminData = useQuery(['admin', user?.admin_id], () => {
    if (user?.admin_id) {
      return Admindetails(user.admin_id);
    }
    return null;
  });

  const updateAdminData = useMutation(UpdateAdmin);
  const [adminDetails, setAdminDetails] = useState(null)

  const adminValues={
    first_name: adminDetails?.first_name,
    last_name: adminDetails?.last_name,
    username: user?.username,
    password: "1234567890",
    pin: adminDetails?.pin,
  }

  const { values, resetForm, touched, errors, setFieldValue, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues: adminValues,
      enableReinitialize: true,
      validationSchema: adminSchema,
      async onSubmit(data) {
        Object.assign(data,{id: user.id})
        updateAdminData.mutate(data)
      },
    });

  function handleedit(e) {
    e.preventDefault();
    setIsEnable(false);
    setToggle(true);
  }

  function handleCancel(e) {
    e.preventDefault();
    resetForm()
    setIsEnable(true);
    setToggle(false);
  }

  React.useEffect(()=>{
    if(adminData.data){
      setAdminDetails(adminData.data.data.SingleAdmin)
    }
  },[adminData.isSuccess, adminData.data])

  React.useEffect(() => {
    if (updateAdminData.isSuccess) {
      toast.success(updateAdminData.data.data?.message);
      setIsEnable(true);
      setToggle(false)
    }
    else if (updateAdminData.isError) {
      if(updateAdminData.error){
        toast.error(updateAdminData.error.response.data.message);
      }
      else{
        toast.error(updateAdminData.response.data.message)
      }
    }
  }, [updateAdminData.isSuccess, updateAdminData.data])

  React.useEffect(()=>{
    if(isEnable == false){
      setFieldValue('password', '')
    }
  },[isEnable])

  if(adminData.isLoading){
    return <LoaderBig/>
  }

  return (
    <>
      <section className="">
        <form
          className="flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className=" grid grid-cols-1 rounded-lg drop-shadow-md truncate bg-white p-10 mt-10">
            <div className="title mb-5">
              <h1 className="text-3xl text-center font-medium text-[#020D46]">
                Admin Profile
              </h1>
            </div>
            <div className=" flex flex-col items-center ">
              <div className="flex lg:flex-row flex-col gap-4 mt-7">
                <div className="first_name">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">
                      First Name *
                    </span>
                    <input
                      type="text"
                      name="first_name"
                      disabled={isEnable}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                      placeholder="Enter first name"
                      className='w-72 mt-1 block  px-3 py-2 bg-white border  border-slate-300 
                        rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                    />
                  </label>
                  <span className="text-xs font-semibold text-red-600 px-1">
                    {errors.first_name && touched.first_name
                      ? errors.first_name
                      : null}
                  </span>
                </div>
                <div className="last_name">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">
                      Last Name *
                    </span>
                    <input
                      type="text"
                      name="last_name"
                      disabled={isEnable}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                      placeholder="Enter last name"
                      className='w-72 mt-1 block  px-3 py-2 bg-white border  border-slate-300 
                        rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                    />
                  </label>
                  <span className="text-xs font-semibold text-red-600 px-1">
                    {errors.last_name && touched.last_name
                      ? errors.last_name
                      : null}
                  </span>
                </div>
              </div>
              <div className="flex lg:flex-row flex-col gap-4 ">
                <div className="username">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">
                      Username *
                    </span>
                    <input
                      type="text"
                      name="username"
                      disabled={isEnable}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder="Enter username"
                      className='w-72 mt-1 block  px-3 py-2 bg-white border  border-slate-300 
                        rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                    />
                  </label>
                  <span className="text-xs font-semibold text-red-600 px-1">
                    {errors.username && touched.username
                      ? errors.username
                      : null}
                  </span>
                </div>
                <div className="password">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">
                      Password
                    </span>
                    <input
                      type={isEnable ? 'password' : 'text'}
                      disabled={isEnable}
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      placeholder="Enter new password"
                      className='w-72 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm 
                        shadow-sm placeholder-slate-400 outline-none'/>
                  </label>
                  <span className="text-xs font-semibold text-red-600 px-1">
                    {errors.password && touched.password
                      ? errors.password
                      : ""}
                  </span>
                </div>
              </div>
              <div className="flex lg:flex-row md:flex-col w-full justify-start gap-4">
                <div className="security_pin">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">
                      Security pin *
                    </span>
                    <input
                      type="text"
                      disabled={isEnable}
                      name="pin"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.pin}
                      placeholder="Enter security pin"
                      className='w-72 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm 
                        shadow-sm placeholder-slate-400 outline-none'/>
                  </label>
                  <span className="text-xs font-semibold text-red-600 px-1">
                    {errors.pin && touched.pin
                      ? errors.pin
                      : ""}
                  </span>
                </div>
                <div className="btn flex items-center justify-end w-72">
                  {!toggle ? (
                    <button
                      type="button"
                      onClick={handleedit}
                      className="py-2 px-8 w-full gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center"
                    >
                      <FaUserEdit className="text-xl" />
                      Edit
                    </button>
                  ) : null}
                  {toggle ? (
                    <div className="flex justify-center items-center w-full">
                      <div className="flex w-full justify-center items-center space-x-3">
                        <button
                          type="button"
                          disabled={updateAdminData.isLoading}
                          onClick={handleCancel}
                          className={`${updateAdminData.isLoading ? "opacity-40" : "opacity-100"
                            } w-full py-2 px-4 gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center`}
                        >
                          <FcCancel className="text-xl" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updateAdminData.isLoading}
                          onSubmit={handleSubmit}
                          className={`w-full py-2 px-3 gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white 
                          ${updateAdminData.isLoading ? "opacity-40" : "opacity-100"
                            } hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center`}
                        >
                          <MdDone className="text-xl" />
                          {updateAdminData.isLoading ? "Loading..." : "Update"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-center items-center">
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Updateprofile;
