import { React, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { customerSchema, initialValues } from "../../../Component/CustomerSchema";
import "../../Customer/CustomerRegister/Customerform.css"
import { AddCustomer } from "../../../utils/apiCalls"
import { useMutation, useQuery } from 'react-query'
const defaultadharfront = "/images/adhar.webp";
const defaultadharback = "/images/adhar_back.jpg";
const defaultpan = "/images/pan.webp";
const defaultbill = "/images/bill.webp";
const defaultImage = "/images/user.png";

function CustomerRegister() {
    const [img, setImg] = useState(defaultImage);
    const [DefaultadharFront, setdefaultadharfront] = useState(defaultadharfront);
    const [DefaultadharBack, setdefaultadharback] = useState(defaultadharback);
    const [DefaultPan, setdefaultpan] = useState(defaultpan);
    const [DefaultBill, setdefaultbill] = useState(defaultbill);
    const [photo, setPhoto] = useState("");
    const [Adhar_front, setadharfront] = useState("");
    const [Adhar_back, setadharback] = useState("");
    const [Pan, setpan] = useState("");
    const [Bill, setbill] = useState("");
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { values, touched, resetForm, errors, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues: initialValues,
            validationSchema: customerSchema,
            async onSubmit(data) {
                try {
                    const fd = new FormData();
                    let ok = JSON.stringify({
                        CustomerInfo: data,
                    });
                    fd.append("data", ok);
                    fd.append("photo", photo);
                    fd.append("adhar_front", Adhar_front);
                    fd.append("adhar_back", Adhar_back);
                    fd.append("pancard", Pan);
                    fd.append("light_bill", Bill);
                    setIsSubmitting(true);
                    const response = await AddCustomer(fd)
                    setIsSubmitting(false);
                    toast.success(response.data.message);
                    resetForm({ values: "" })
                    navigate(`/InstallmentList/profile-detail/${response?.data?.data?.id}`)
                } catch (err) {
                    setIsSubmitting(false);
                    toast.error(err.response.data.message);
                }
            },
        });

    function handleImageUpload(e) {
        setPhoto(() => e.target.files[0]);
        setImg(URL.createObjectURL(e.target.files[0]));
    }

    function handleAdharFUpload(e) {
        setadharfront(() => e.target.files[0]);
        setdefaultadharfront(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharBUpload(e) {
        setadharback(() => e.target.files[0]);
        setdefaultadharback(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharPanUpload(e) {
        setpan(() => e.target.files[0]);
        setdefaultpan(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharBillUpload(e) {
        setbill(() => e.target.files[0]);
        setdefaultbill(URL.createObjectURL(e.target.files[0]));
    }

    const handleClick = (e) => {
        resetForm({ values: "" })
    };

    return (
        <>
            <div className="py-5">
                <div className="px-10">
                    <h1 className=" font-bold text-[#0d0d48] text-2xl">
                        Customer Registration
                    </h1>
                </div>
                <form className="flex justify-center items-center pt-5 xs:px-5 xl:px-14" onSubmit={handleSubmit} >
                    <div className="w-3/4 rounded-lg truncate bg-white py-9 shadow-2xl  xs:px-5 md:px-7 xl:px-14  ">
                        <div className="w-full items-end flex xs:flex-col xs:gap-4 xl:flex-row xl:space-x-8">
                            <div className="flex flex-col justify-center items-center w-full xl:gap-1">
                                <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                    <div className="profile_img_div flex justify-center rounded-full items-center border-2 border-gray-500 shadow-lg">
                                        <img
                                            src={img}
                                            width="100%"
                                            height="100%"
                                            className="object-contain "
                                            alt="customer profile"
                                        />
                                        <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                            <input
                                                type="file"
                                                id="logo"
                                                className="rounded-md w-16"
                                                accept=".png, .jpg, .jpeg"
                                                name="logo"
                                                onChange={(e) => handleImageUpload(e)}
                                                onBlur={handleBlur}
                                                onInput={(e) => handleImageUpload(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 mt-8 w-full ">
                                    <div className="firtname w-full">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-slate-700">
                                                Full Name *
                                            </span>
                                            <input
                                                type="text"
                                                name="full_name"
                                                placeholder="Enter Your First Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.full_name}
                                                className='w-full mt-1 block px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                            />
                                            <span className="text-xs font-semibold text-red-600 px-1">
                                                {errors.full_name && touched.full_name
                                                    ? errors.full_name
                                                    : null}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 w-full">
                                    <div className="whatsappno w-full">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-slate-700">
                                                WhatsApp No *
                                            </span>
                                            <input
                                                type="text"
                                                name="mobile"
                                                placeholder="Enter Your WhatsApp No"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.mobile}
                                                className='w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                            />
                                            <span className="text-xs font-semibold text-red-600 px-1">
                                                {errors.mobile && touched.mobile
                                                    ? errors.mobile
                                                    : null}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="mobileno w-full">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-slate-700">
                                                Mobile No
                                            </span>
                                            <input
                                                type="text"
                                                name="alternate_no"
                                                placeholder="Enter Your Mobile No"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.alternate_no}
                                                className={`w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none ${errors.alternate_no && 'border-red-600'}`}
                                            />
                                            <span className="text-xs font-semibold text-red-600 px-1">
                                                {errors.alternate_no && touched.alternate_no
                                                    ? errors.alternate_no
                                                    : null}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 w-full">
                                    <div className="reference w-full">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-slate-700">
                                                Refrence Name
                                            </span>
                                            <input
                                                type="text"
                                                name="reference_name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.reference_name}
                                                placeholder="Enter Reference Name"
                                                className='w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none' />
                                            <span className="text-xs font-semibold text-red-600 px-1">
                                                {errors.reference_name && touched.reference_name
                                                    ? errors.reference_name
                                                    : null}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="mobileno w-full">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-slate-700">
                                                Mobile No
                                            </span>
                                            <input
                                                type="text"
                                                name="reference_mobile"
                                                placeholder="Enter Reference Mobile No"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.reference_mobile}
                                                className='w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                            />
                                            <span className="text-xs font-semibold text-red-600 px-1">
                                                {errors.reference_mobile && touched.reference_mobile
                                                    ? errors.reference_mobile
                                                    : null}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center w-full xl:gap-1 mt-8">
                            <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 w-full">
                                <div className="adhar_front w-full">
                                    <label className="block">
                                        <span className="block text-sm text-center pb-2 font-medium text-slate-700">
                                            Adhar Card Front
                                        </span>
                                        <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                            <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                <img
                                                    src={DefaultadharFront}
                                                    width="100%"
                                                    height="100%"
                                                    className="object-contain "
                                                    alt="student profile"
                                                />
                                                <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                    <input
                                                        type="file"
                                                        id="adhar_front"
                                                        className="rounded-md w-16"
                                                        accept=".png, .jpg, .jpeg"
                                                        name="adhar_front"
                                                        onChange={(e) => handleAdharFUpload(e)}
                                                        onBlur={handleBlur}
                                                        onInput={(e) => handleAdharFUpload(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="adhar_back w-full">
                                    <label className="block">
                                        <span className="block text-center pb-2 text-sm font-medium text-slate-700">
                                            Adhar Card Back
                                        </span>
                                        <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                            <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                <img
                                                    src={DefaultadharBack}
                                                    width="100%"
                                                    height="100%"
                                                    className="object-contain "
                                                    alt="student profile"
                                                />
                                                <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                    <input
                                                        type="file"
                                                        id="adhar_back"
                                                        className="rounded-md w-16"
                                                        accept=".png, .jpg, .jpeg"
                                                        name="adhar_back"
                                                        onChange={(e) => handleAdharBUpload(e)}
                                                        onBlur={handleBlur}
                                                        onInput={(e) => handleAdharBUpload(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="pan w-full">
                                    <label className="block">
                                        <span className="block text-sm text-center pb-2 font-medium text-slate-700">
                                            PAN
                                        </span>
                                        <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                            <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                <img
                                                    src={DefaultPan}
                                                    width="100%"
                                                    height="100%"
                                                    className="object-contain "
                                                    alt="student profile"
                                                />
                                                <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                    <input
                                                        type="file"
                                                        id="pan"
                                                        className="rounded-md w-16"
                                                        accept=".png, .jpg, .jpeg"
                                                        name="pan"
                                                        onChange={(e) => handleAdharPanUpload(e)}
                                                        onBlur={handleBlur}
                                                        onInput={(e) => handleAdharPanUpload(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="lightbill w-full">
                                    <label className="block">
                                        <span className="block text-sm text-center pb-2 font-medium text-slate-700">
                                            Light Bill
                                        </span>
                                        <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                            <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                <img
                                                    src={DefaultBill}
                                                    width="100%"
                                                    height="100%"
                                                    className="object-contain "
                                                    alt="student profile"
                                                />
                                                <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                    <input
                                                        type="file"
                                                        id="light_bill"
                                                        className="rounded-md w-16"
                                                        accept=".png, .jpg, .jpeg"
                                                        name="light_bill"
                                                        onChange={(e) => handleAdharBillUpload(e)}
                                                        onBlur={handleBlur}
                                                        onInput={(e) => handleAdharBillUpload(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex pt-10 ">
                                <button type="button" disabled={isLoadingOnSubmit} className="px-8 mr-4 h-10  border-[#0d0d48] border-2 hover:bg-[#0d0d48] text-[#0d0d48] hover:text-white font-medium rounded-md tracking-wider flex justify-center items-center" onClick={handleClick}>
                                    CLEAR
                                </button>
                                <button type="submit"
                                    disabled={isSubmitting}
                                    className={`${isSubmitting ? 'opacity-60' : ''} bg-[#0d0d48] px-8 h-10 border-2 border-[#0d0d48] text-white font-medium rounded-md tracking-wider flex justify-center items-center`}>
                                    {isSubmitting ? 'Loading...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CustomerRegister

