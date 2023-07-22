import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import "../../Customer/CustomerRegister/Customerform.css"
import { FaUserEdit } from "react-icons/fa"
import { AiFillEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { BsPhone } from "react-icons/bs";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { BiFolderPlus } from "react-icons/bi";
import NewPhoneFormModel from '../../../Component/NewPhoneFormModal';
import { getPurchaseCustomerbyId, getCustomerByid, UpdateCustomer, DeletePurchase } from '../../../utils/apiCalls';
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import { toast } from "react-toastify";
import * as Yup from "yup";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import LoaderBig from "../../../Component/LoaderBig";
import LoaderSmall from "../../../Component/LoaderSmall";
import { AxiosError } from "axios";


const validFileExtensions = { image: ['jpg', 'png', 'jpeg'] };

function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const customerSchema = Yup.object({
    photo: Yup.mixed()
        .test("is-valid-type", "Photo should be in jpg, jpeg or png format",
            value => {
                if (!value) {
                    return true;
                }
                if (typeof value === "string" && value.startsWith("http")) {
                    return true;
                }
                return isValidFileType(value && value.name?.toLowerCase(), "image")
            })
        .test("is-valid-size", "Max allowed size is 2MB", value => {
            if (!value) {
                return true;
            }
            if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return value && value.size <= 2097152
        }),

    full_name: Yup.string()
        .test('no-numbers', 'Numbers are not allowed', (value) => {
            if (value) {
                return !/\d/.test(value); // Check if the value contains any numbers
            }
            return true;
        })
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(4, "Minimum 4 characters are required")
        .required("Please Enter Your First Name")
        .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

    mobile: Yup.string()
        .matches(/^[0-9]+$/, 'Please enter a valid number')
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .test('valid-number', 'Please enter a valid number', (value) => {
            if (value) {
                return value.length == 10;
            }
            return true;
        })
        .required("Please Enter Your Mobile Number"),

    alternate_no: Yup.string()
        .matches(/^[0-9]+$/, 'Please enter a valid number')
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .test('valid-number', 'Please enter a valid number', (value) => {
            if (value) {
                return value.length == 10;
            }
            return true;
        }),

    reference_name: Yup.string()
        .test('no-numbers', 'Numbers are not allowed', (value) => {
            if (value) {
                return !/\d/.test(value); // Check if the value contains any numbers
            }
            return true;
        })
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .nullable()
        .min(4, "Minimum 4 characters are required")
        .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

    reference_mobile: Yup.string()
        .matches(/^[0-9]+$/, 'Please enter a valid number')
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .test('valid-number', 'Please enter a valid number', (value) => {
            if (value) {
                return value.length == 10;
            }
            return true;
        }),

    adhar_front: Yup.mixed()
        .required('Please upload adhar front image')
        .test("is-valid-type", "Image should be in jpg, jpeg or png format",
            value => {
                if (!value) {
                    return true;
                }
                if (typeof value === "string" && value.startsWith("http")) {
                    return true;
                }
                return isValidFileType(value && value.name?.toLowerCase(), "image")
            })
        .test("is-valid-size", "Max allowed size is 2MB", value => {
            if (!value) {
                return true;
            }
            if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return value && value.size <= 2097152
        }),

    adhar_back: Yup.mixed()
        .required('Please upload adhar back image')
        .test("is-valid-type", "Image should be in jpg, jpeg or png format",
            value => {
                if (!value) {
                    return true;
                }
                if (typeof value === "string" && value.startsWith("http")) {
                    return true;
                }
                return isValidFileType(value && value.name?.toLowerCase(), "image")
            })
        .test("is-valid-size", "Max allowed size is 2MB", value => {
            if (!value) {
                return true;
            }
            if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return value && value.size <= 2097152
        }),

    pancard: Yup.mixed()
        .required('Please upload pancard')
        .test("is-valid-type", "Image should be in jpg, jpeg or png format",
            value => {
                if (!value) {
                    return true;
                }
                if (typeof value === "string" && value.startsWith("http")) {
                    return true;
                }
                return isValidFileType(value && value.name?.toLowerCase(), "image")
            })
        .test("is-valid-size", "Max allowed size is 2MB", value => {
            if (!value) {
                return true;
            }
            if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return value && value.size <= 2097152
        }),

    light_bill: Yup.mixed()
        .test("is-valid-type", "Image should be in jpg, jpeg or png format",
            value => {
                if (!value) {
                    return true;
                }
                if (typeof value === "string" && value.startsWith("http")) {
                    return true;
                }
                return isValidFileType(value && value.name?.toLowerCase(), "image")
            })
        .test("is-valid-size", "Max allowed size is 2MB", value => {
            if (!value) {
                return true;
            }
            if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return value && value.size <= 2097152
        }),
});

function CustomerProfile() {
    const navigate = useNavigate();
    const params = useParams();
    const [is_Edit, setIsEdit] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [isEnable, setIsEnable] = useState(true);
    const [newPhoneFormModal, setnewPhoneFormModal] = useState(false);
    const [Photo, setPhoto] = useState("");
    const [adharfront, setadharfront] = useState("");
    const [adharback, setadharback] = useState("");
    const [pan, setpan] = useState("");
    const [bill, setbill] = useState("");
    const [PhoneDetails, setPhoneDetails] = useState();

    const [SingleCustomerDetails, setSingleCustomerDetails] = useState({
        photo: "",
        full_name: "",
        mobile: "",
        alternate_no: "",
        reference_name: "",
        reference_mobile: "",
        adhar_front: "",
        adhar_back: "",
        pancard: "",
        light_bill: ""
    });

    const CustomerDetail = useQuery(['customer', params.id], () => getCustomerByid(params.id), { staleTime: Infinity })
    const purchaseDetails = useQuery(['purchase', params.id], () => getPurchaseCustomerbyId(params.id))
    const updateDetails = useMutation(UpdateCustomer)

    const { values, setValues, touched, resetForm, setTouched, setFieldValue, errors, setErrors, handleChange, handleSubmit, handleBlur } =
        useFormik({
            validationSchema: customerSchema,
            initialValues: SingleCustomerDetails,
            onSubmit: async (data) => {
                const fd = new FormData();
                fd.append("id", params.id)
                fd.append("photo", data.photo);
                fd.append("adhar_front", data.adhar_front);
                fd.append("adhar_back", data.adhar_back);
                fd.append("pancard", data.pancard);
                fd.append("light_bill", data.light_bill);
                fd.append("old_photo_url", CustomerDetail.data.data?.SingleCustomer.photo);
                fd.append("old_adhar_front_url", CustomerDetail.data?.data?.SingleCustomer.document.adhar_front);
                fd.append("old_adhar_back_url", CustomerDetail.data?.data?.SingleCustomer.document.adhar_back);
                fd.append("old_pancard_url", CustomerDetail.data?.data?.SingleCustomer.document.pancard);
                fd.append("old_light_bill_url", CustomerDetail.data?.data?.SingleCustomer.document.light_bill);
                fd.append("full_name", data.full_name)
                fd.append("mobile", data.mobile)
                fd.append("alternate_no", data.alternate_no)
                fd.append("reference_name", data.reference_name)
                fd.append("reference_mobile", data.reference_mobile)
                updateDetails.mutate(fd)

            },
        });

    function handleImageUpload(e) {
        setPhoto(() => e.target.files[0]);
        // setImg(URL.createObjectURL(e.target.files[0]));
    }

    function handleAdharFUpload(e) {
        setadharfront(() => e.target.files[0]);
        // setdefaultadharfront(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharBUpload(e) {
        setadharback(() => e.target.files[0]);
        // setdefaultadharback(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharPanUpload(e) {
        setpan(() => e.target.files[0]);
        // setdefaultpan(URL.createObjectURL(e.target.files[0]));
    }
    function handleAdharBillUpload(e) {
        setbill(() => e.target.files[0]);
        // setdefaultbill(URL.createObjectURL(e.target.files[0]));
    }

    function handleedit(e) {
        e.preventDefault();
        resetForm({ e: "" })
        setIsEnable(false);
        setToggle(true);

        const customerData = {
            photo: CustomerDetail.data.data?.SingleCustomer.photo,
            full_name: CustomerDetail.data?.data?.SingleCustomer.full_name,
            mobile: CustomerDetail.data?.data?.SingleCustomer.mobile,
            alternate_no: CustomerDetail.data?.data?.SingleCustomer.alternate_no,
            reference_name: CustomerDetail.data?.data?.SingleCustomer.reference_name,
            reference_mobile: CustomerDetail.data?.data?.SingleCustomer.reference_mobile,
            adhar_front: CustomerDetail.data?.data?.SingleCustomer.document.adhar_front,
            adhar_back: CustomerDetail.data?.data?.SingleCustomer.document.adhar_back,
            pancard: CustomerDetail.data?.data?.SingleCustomer.document.pancard,
            light_bill: CustomerDetail.data?.data?.SingleCustomer.document.light_bill,
        }

        setSingleCustomerDetails(customerData)

        setValues(customerData)
    }

    function handleCancel(e) {
        e.preventDefault();
        setIsEnable(true);
        setToggle(false);
        setErrors({});
        setTouched({}, false)

        const alternate_no = CustomerDetail.data.data?.SingleCustomer.alternate_no;
        const reference_name = CustomerDetail.data.data?.SingleCustomer.reference_name;
        const reference_mobile = CustomerDetail.data.data?.SingleCustomer.reference_mobile;

        const customerData = {
            photo: CustomerDetail.data.data?.SingleCustomer.photo,
            full_name: CustomerDetail.data.data?.SingleCustomer.full_name,
            mobile: CustomerDetail.data.data?.SingleCustomer.mobile,
            alternate_no: alternate_no == '' ? '--' : alternate_no,
            reference_name: reference_name == '' ? '--' : reference_name,
            reference_mobile: reference_mobile == '' ? '--' : reference_mobile,
            adhar_front: CustomerDetail.data.data?.SingleCustomer.document.adhar_front,
            adhar_back: CustomerDetail.data.data?.SingleCustomer.document.adhar_back,
            pancard: CustomerDetail.data.data?.SingleCustomer.document.pancard,
            light_bill: CustomerDetail.data.data?.SingleCustomer.document.light_bill,
        }
        setSingleCustomerDetails(customerData)

        setValues(customerData)
    }

    const handleEditPhone = (id) => {
        let Phone = purchaseDetails.data.data.CustomerAllPurchase?.find((n) => {
            return n?.id == id;
        });
        setIsEdit(true)
        setPhoneDetails(Phone);
        setnewPhoneFormModal(true);
    };

    React.useEffect(() => {
        if (CustomerDetail.data) {
            const alternate_no = CustomerDetail.data.data?.SingleCustomer.alternate_no;
            const reference_name = CustomerDetail.data.data?.SingleCustomer.reference_name;
            const reference_mobile = CustomerDetail.data.data?.SingleCustomer.reference_mobile;

            const customerData = {
                photo: CustomerDetail.data.data?.SingleCustomer.photo,
                full_name: CustomerDetail.data.data?.SingleCustomer.full_name,
                mobile: CustomerDetail.data.data?.SingleCustomer.mobile,
                alternate_no: alternate_no == '' ? '--' : alternate_no,
                reference_name: reference_name == '' ? '--' : reference_name,
                reference_mobile: reference_mobile == '' ? '--' : reference_mobile,
                adhar_front: CustomerDetail.data.data?.SingleCustomer.document.adhar_front,
                adhar_back: CustomerDetail.data.data?.SingleCustomer.document.adhar_back,
                pancard: CustomerDetail.data.data?.SingleCustomer.document.pancard,
                light_bill: CustomerDetail.data.data?.SingleCustomer.document.light_bill,
            }
            setSingleCustomerDetails(customerData)

            setValues(customerData)
        }
    }, [CustomerDetail.isSuccess, CustomerDetail.data])

    React.useEffect(() => {
        if (updateDetails.isError) {
            toast.error(updateDetails.error.response.data.message);
        }
        else if (updateDetails.isSuccess) {
            toast.success(updateDetails.data?.data.message);
            CustomerDetail.refetch();
            setIsEnable(true);
            setToggle(false)
            setErrors({});
            setTouched({}, false)
        }
    }, [updateDetails.isSuccess, updateDetails.isError, updateDetails.data])

    if (CustomerDetail.isLoading) {
        return <LoaderBig />
    }

    return (
        <>
            <div className="py-5">
                <div className="px-10 flex justify-between w-full">
                    <h1 className=" font-bold text-[#0d0d48] text-2xl lg:text-3xl">
                        Customer Profile
                    </h1>
                    <Tippy content="Add New Phone">
                        <div
                            onClick={() => setnewPhoneFormModal(true)}
                            className=' bg-white border  text-[#0d0d48] rounded-full xs:h-7 xs:w-7 sm:h-11 sm:w-11 cursor-pointer duration-300 flex justify-center items-center hover:bg-[#0d0d48] hover:text-white'>
                            <BiFolderPlus className='xs:text-base sm:text-xl' />
                        </div>
                    </Tippy>
                </div>
                <div className="xs:px-5 sm:px-10 py-5 ">
                    <div className="bg-white shadow-2xl rounded-md">
                        <form className="flex justify-center items-center pt-5 xl:pt-0 xs:px-5 xl:px-14" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="w-full rounded-lg truncate py-9 xl:py-5 ">
                                <div className="w-full flex flex-col xs:gap-4 xs:px-5 md:px-7 xl:px-14 ">
                                    <div className="flex flex-col justify-center items-center w-full xl:gap-1">
                                        <div className="flex flex-col justify-center items-center ">
                                            <div className="profile_img_div flex justify-center rounded-full items-center border-2 border-gray-500 shadow-lg">
                                                <img
                                                    // src={SingleCustomerDetails?.photo ? SingleCustomerDetails?.photo : img}
                                                    src={
                                                        values.photo != ''
                                                            ?
                                                            !values.photo?.size && values.photo?.split(':')[0] == 'https'
                                                                ?
                                                                values.photo
                                                                :
                                                                ""
                                                            // URL.createObjectURL(values.photo)
                                                            :
                                                            values.photo
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                    className="object-contain "
                                                    alt="profile photo"
                                                />
                                                {
                                                    !isEnable
                                                        ?
                                                        <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                            <input
                                                                type="file"
                                                                id="photo"
                                                                className="rounded-md w-16"
                                                                accept=".png, .jpg, .jpeg"
                                                                name="photo"
                                                                onChange={
                                                                    (e) => {
                                                                        handleImageUpload(e);
                                                                        setFieldValue('photo', e.target.files[0]);
                                                                    }
                                                                }
                                                                onBlur={handleBlur}
                                                                onInput={(e) => handleImageUpload(e)}
                                                            />
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                            <span className="text-xs font-semibold text-red-600 text-center block px-1 mt-4">
                                                {errors.photo && touched.photo
                                                    ? errors.photo
                                                    : null}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 mt-8 w-full ">
                                                <div className="firtname">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">
                                                            Full Name *
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            placeholder="Enter Your Full Name"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.full_name}
                                                            disabled={isEnable}
                                                            className='w-full 2xl:w-60 mt-1 block px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                                        />
                                                        <span className="text-xs font-semibold text-red-600 px-1">
                                                            {errors.full_name && touched.full_name
                                                                ? errors.full_name
                                                                : null}
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="whatsappno">
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
                                                            disabled={isEnable}
                                                            className='w-full 2xl:w-60 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                                        />
                                                        <span className="text-xs font-semibold text-red-600 px-1">
                                                            {errors.mobile && touched.mobile
                                                                ? errors.mobile
                                                                : null}
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="mobileno">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">
                                                            Alternate No
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="alternate_no"
                                                            placeholder="Enter Your Mobile No"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.alternate_no}
                                                            disabled={isEnable}
                                                            className={`w-full 2xl:w-60 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none`}
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
                                                <div className="reference">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">
                                                            Reference Name
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="reference_name"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.reference_name}
                                                            disabled={isEnable}
                                                            placeholder="Enter Refeence Name"
                                                            className='w-full 2xl:w-60 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none' />
                                                        <span className="text-xs font-semibold text-red-600 px-1">
                                                            {errors.reference_name && touched.reference_name
                                                                ? errors.reference_name
                                                                : null}
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="referencemobileno">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">
                                                            Reference Mobile No
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="reference_mobile"
                                                            placeholder="Enter Refrence Mobile No"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.reference_mobile}
                                                            disabled={isEnable}
                                                            className='w-full 2xl:w-60 mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
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
                                    <div className="flex flex-col justify-center items-center w-full xl:gap-1">
                                        <div className="flex xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 w-full">
                                            <div className="adhar_front w-full">
                                                <label className="block">
                                                    <span className="block text-sm text-center pb-2 font-medium text-slate-700">
                                                        Adhar Card Front *
                                                    </span>
                                                    <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                                        <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg ">
                                                            <img
                                                                src={
                                                                    values.adhar_front != ''
                                                                        ?
                                                                        !values.adhar_front?.size && values.adhar_front?.split(':')[0] == 'https'
                                                                            ?
                                                                            values.adhar_front
                                                                            :
                                                                            ""
                                                                        // URL.createObjectURL(values.adhar_front)
                                                                        :
                                                                        values.adhar_front
                                                                }
                                                                width="100%"
                                                                height="100%"
                                                                className="object-contain "
                                                                alt="adhar front"
                                                            />
                                                            <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                                <input
                                                                    type="file"
                                                                    id="adhar_front"
                                                                    className="rounded-md w-16"
                                                                    disabled={isEnable}
                                                                    accept=".png, .jpg, .jpeg"
                                                                    name="adhar_front"
                                                                    onChange={
                                                                        (e) => {
                                                                            handleAdharFUpload(e);
                                                                            setFieldValue('adhar_front', e.target.files[0]);
                                                                        }
                                                                    }
                                                                    onBlur={handleBlur}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-red-600 text-center block px-1 mt-4">
                                                        {errors.adhar_front && touched.adhar_front
                                                            ? errors.adhar_front
                                                            : null}
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="adhar_back w-full">
                                                <label className="block">
                                                    <span className="block text-center pb-2 text-sm font-medium text-slate-700">
                                                        Adhar Card Back *
                                                    </span>
                                                    <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                                        <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                            <img
                                                                src={
                                                                    values.adhar_back != ''
                                                                        ?
                                                                        !values.adhar_back?.size && values.adhar_back?.split(':')[0] == 'https'
                                                                            ?
                                                                            values.adhar_back
                                                                            :
                                                                            ""
                                                                        // URL.createObjectURL(values.adhar_back)
                                                                        :
                                                                        values.adhar_back
                                                                }
                                                                width="100%"
                                                                height="100%"
                                                                className="object-contain "
                                                                alt="adhar back"
                                                            />
                                                            <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                                <input
                                                                    type="file"
                                                                    id="adhar_back"
                                                                    className="rounded-md w-16"
                                                                    accept=".png, .jpg, .jpeg"
                                                                    name="adhar_back"
                                                                    disabled={isEnable}
                                                                    onChange={
                                                                        (e) => {
                                                                            handleAdharBUpload(e);
                                                                            setFieldValue('adhar_back', e.target.files[0])
                                                                        }
                                                                    }
                                                                    onBlur={handleBlur}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-red-600 text-center block px-1 mt-4">
                                                        {errors.adhar_back && touched.adhar_back
                                                            ? errors.adhar_back
                                                            : null}
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="pan w-full">
                                                <label className="block">
                                                    <span className="block text-sm text-center pb-2 font-medium text-slate-700">
                                                        PAN *
                                                    </span>
                                                    <div className="md:col-span-1 md:flex justify-center md:justify-center items-center ">
                                                        <div className="profile_img_div flex justify-center rounded-md items-center border-2 border-gray-500 shadow-lg">
                                                            <img
                                                                src={
                                                                    values.pancard != ''
                                                                        ?
                                                                        !values.pancard?.size && values.pancard?.split(':')[0] == 'https'
                                                                            ?
                                                                            values.pancard
                                                                            :
                                                                            ""
                                                                        // URL.createObjectURL(values.pancard)
                                                                        :
                                                                        values.pancard
                                                                }
                                                                width="100%"
                                                                height="100%"
                                                                className="object-contain "
                                                                alt="pan card"
                                                            />
                                                            <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                                <input
                                                                    type="file"
                                                                    id="pancard"
                                                                    className="rounded-md w-16"
                                                                    accept=".png, .jpg, .jpeg"
                                                                    name="pancard"
                                                                    disabled={isEnable}
                                                                    onChange={
                                                                        (e) => {
                                                                            handleAdharPanUpload(e);
                                                                            setFieldValue('pancard', e.target.files[0])
                                                                        }
                                                                    }
                                                                    onBlur={handleBlur}
                                                                    onInput={(e) => handleAdharPanUpload(e)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-red-600 text-center block px-1 mt-4">
                                                        {errors.pancard && touched.pancard
                                                            ? errors.pancard
                                                            : null}
                                                    </span>
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
                                                                src={
                                                                    values.light_bill != ''
                                                                        ?
                                                                        !values.light_bill?.size && values.light_bill?.split(':')[0] == 'https'
                                                                            ?
                                                                            values.light_bill
                                                                            :
                                                                            ""
                                                                        // URL.createObjectURL(values.light_bill)
                                                                        :
                                                                        values.light_bill
                                                                }
                                                                width="100%"
                                                                height="100%"
                                                                className="object-contain "
                                                                alt="light bill"
                                                            />
                                                            <div className="profile_img_overlay absolute flex flex-col justify-center items-center">
                                                                <input
                                                                    type="file"
                                                                    id="light_bill"
                                                                    className="rounded-md w-16"
                                                                    accept=".png, .jpg, .jpeg"
                                                                    name="light_bill"
                                                                    disabled={isEnable}
                                                                    onChange={
                                                                        (e) => {
                                                                            handleAdharBillUpload(e);
                                                                            setFieldValue('light_bill', e.target.files[0])
                                                                        }
                                                                    }
                                                                    onBlur={handleBlur}
                                                                    onInput={(e) => handleAdharBillUpload(e)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-red-600 text-center block px-1 mt-4">
                                                        {errors.light_bill && touched.light_bill
                                                            ? errors.light_bill
                                                            : null}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex pt-10 ">
                                            <div>
                                                {!toggle ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleedit}
                                                        className="py-2 px-8 gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center"
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
                                                                onClick={handleCancel}
                                                                disabled={updateDetails.isLoading}
                                                                className="py-2 px-4 gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center"
                                                            >
                                                                <FaUserEdit className="text-xl" />
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                onClick={handleSubmit}
                                                                disabled={updateDetails.isLoading}
                                                                className={`py-2 px-3 gap-2 bg-[#0d0d48]  hover:bg-white border-2 hover:border-[#0d0d48] text-white 
                                                                ${updateDetails.isLoading ? "opacity-40" : "opacity-100"
                                                                    } hover:text-[#0d0d48] font-medium rounded-md tracking-wider flex justify-center items-center`}
                                                            >
                                                                <FaUserEdit className="text-xl" />
                                                                {updateDetails.isLoading ? "Loading..." : "SUBMIT"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='xs:px-0 md:px-5 xl:px-10 py-10  '>
                            <div className="bg-white xs:overflow-x-scroll xl:overflow-x-hidden">
                                <h1 className='font-bold xs:p-3 sm:p-6 text-lg'>Phone Details</h1>
                                <table
                                    className="w-full bg-slate-100 text-sm text-center "
                                    id="table-to-xls">
                                    <thead className="text-xs text-gray-700 bg-class3-50 uppercase  ">
                                        <tr className="text-black text-xs ">
                                            <th scope="col" className="pl-3 py-4">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Company
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Model
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                EMI Type
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Total Amount
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Down Payment
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Pending
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    {

                                        purchaseDetails.isLoading
                                            ?
                                            <tbody>
                                                <tr>
                                                    <td colSpan="8">
                                                        <LoaderSmall />
                                                    </td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody className=" bg-white items-center bg  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden">
                                                {
                                                    purchaseDetails?.data?.data?.CustomerAllPurchase?.length > 0
                                                        ?
                                                        purchaseDetails?.data?.data?.CustomerAllPurchase?.map((item, index) => {
                                                            return (
                                                                <tr key={index} className=" border-b">

                                                                    <td className="px-6 py-5 ">
                                                                        {moment(item.createdAt).format("DD / MM / YYYY")}
                                                                    </td>
                                                                    <td className="px-6 py-5 ">
                                                                        {item?.specification.phone?.company?.company_name}
                                                                    </td>
                                                                    <td className="px-6 py-5 capitalize">
                                                                        {item.specification.phone.model_name}
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        {item.installment.month} Months
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        {item.net_amount}
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        {item.emis[0].amount}
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        {item.pending_amount}
                                                                    </td>
                                                                    <td className="px-6 py-5 flex items-center justify-center space-x-3">
                                                                        <Tippy content="Phone Detail">
                                                                            <div className="flex justify-center items-center">
                                                                                <AiFillEye
                                                                                    className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                                                                    onClick={() =>
                                                                                        navigate(`/Customer/EMI-History/${item.id}`)}
                                                                                />
                                                                            </div>
                                                                        </Tippy>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan="8">
                                                                <div className='flex justify-center items-center w-full py-5 space-x-4 text-gray-500'>
                                                                    <BsPhone className='text-3xl' />
                                                                    <h1 className='font-semibold'>No phone purchased yet</h1>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <NewPhoneFormModel
                    showModal={newPhoneFormModal}
                    handleShowModal={setnewPhoneFormModal}
                    PhoneDetails={PhoneDetails}
                    is_Edit={is_Edit}

                />
            </div>
        </>
    )
}

export default CustomerProfile

