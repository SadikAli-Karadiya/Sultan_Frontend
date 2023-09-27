import React, { useEffect, useState } from 'react'
import { IoMdInformationCircle } from "react-icons/io"
import { AiFillEye } from "react-icons/ai";
import "../../../App.css"
import { useNavigate, useParams } from "react-router-dom";
import { getEmiPurchasebyId } from '../../../utils/apiCalls';
import { useQuery } from 'react-query'
import moment from 'moment'
import LoaderSmall from '../../../Component/LoaderSmall';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IoIosArrowBack } from "react-icons/io";


function EMIHistory() {
    const navigate = useNavigate();
    const params = useParams();
    const [is_Edit, setIsEdit] = useState(false);
    const [EMI_Details, setEMIDetails] = useState();
    const [emiId, setEmiId] = useState(null)
    const data = useQuery(['emi', params.id], () => getEmiPurchasebyId(params.id));
    // console.log(data.data.data.AllEmi)
    const handlePayEMI = (id) => {
        navigate(`/receipt/Generate/${id}`,
            {
                state: {
                    emi_id: id,
                }
            })
    };

    useEffect(() => {
        if (data.data) {
            for (let i = 0; i < data.data.data.AllEmi.length; i++) {
                if (data.data.data.AllEmi[i].status == 'pending') {
                    setEmiId(data.data.data.AllEmi[i].id)
                    break;
                }
            }
        }
    }, [data.isSuccess, data.data])


    return (
        <>
            <div className='xs:px-5 sm:px-10 sm:py-5 h-full'>
                <div className='sm:py-5 flex justify-between items-center'>
                    <h1 className='text-[#0d0d48] text-2xl font-bold'>EMI Details</h1>
                    <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer" id="" onClick={() => navigate(-1)}>
                        <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-[#0d0d48] mt-[3px]" />
                        <span className=" text-xl text-[#0d0d48] font-semibold group-hover:text-blue-700">Back</span>
                    </div>
                </div>
                <div className='px-20'>
                    <div className="flex flex-col bg-white shadow-md rounded-md px-10   mb-10 py-5 justify-center items-center w-full xl:gap-1">
                        <div className="flex items-center xs:flex-col xs:gap-0 md:flex-row md:gap-4 xl:gap-4 w-full">
                            <div className="date w-full">
                                <label className="block">
                                    <span className="block text-sm font-medium text-black">
                                        Date
                                    </span>
                                    <div className='w-full  mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                                        {moment(data?.data?.data?.AllEmi[0]?.createdAt).format("DD/MM/YYYY")}                                    </div>
                                </label>
                            </div>
                            <div className="selectinst w-full">
                                <label className="block">
                                    <span className="block text-sm font-medium text-black">
                                        Bill Number
                                    </span>
                                    <input
                                        type="text"
                                        value="10"
                                        className='w-full  mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'
                                    />
                                </label>
                            </div>
                            <div className="selectinst w-full">
                                <label className="block">
                                    <span className="block text-sm font-medium text-black">
                                        Phone
                                    </span>
                                    <div className='w-full  mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                                        {data?.data?.data?.AllEmi[0]?.purchase?.specification?.phone?.model_name} ( {data?.data?.data?.AllEmi[0]?.purchase?.specification?.ram} X {data?.data?.data?.AllEmi[0]?.purchase?.specification?.storage} )
                                    </div>
                                </label>
                            </div>
                            <div className="date w-full">
                                <label className="block">
                                    <span className="block text-sm font-medium text-black">
                                        IEMI No
                                    </span>
                                    <div className='w-full  mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                                        {data?.data?.data?.AllEmi[0]?.purchase?.iemi}
                                    </div>
                                </label>
                            </div>
                            <div className="date w-full">
                                <label className="block">
                                    <span className="block text-sm font-medium text-black">
                                        Total Amount
                                    </span>
                                    <div className='w-full  mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                                        {data?.data?.data?.AllEmi[0]?.purchase?.net_amount}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    data?.isLoading == true ?
                        <LoaderSmall />
                        :
                        (
                            data?.data?.data?.AllEmi?.length > 0 ?
                                <div className='xs:px-0 xs:py-5 xl:px-20 mb-10'>
                                    <div className="bg-white xs:overflow-x-scroll xl:overflow-x-hidden">
                                        <table className="w-full bg-[#0d0d48] text-sm text-center  " id="table-to-xls" >
                                            <thead className="text-xs text-gray-700 bg-[#0d0d48] uppercase  ">
                                                <tr className="text-white text-xs ">
                                                    <th scope="col" className="pl-3 py-4">
                                                        Receipt No
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Due Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Paid Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Type
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Extra charge
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        status
                                                    </th>
                                                    <th scope="col" className="px-6 py-4">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            {
                                                data?.data?.data?.AllEmi?.map((item, index) => {
                                                    return (
                                                        <tbody key={index} className="bg-white items-center bg  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden">
                                                            <tr className=" border-b">
                                                                <th className="py-5 px-6">
                                                                    {
                                                                        item.status == "pending"
                                                                            ?
                                                                            '--'
                                                                            :
                                                                            item?.receipt?.receipt_id
                                                                    }
                                                                </th>
                                                                <td className="px-6 py-5 ">
                                                                    {moment(item.due_date).format("DD/MM/YYYY")}
                                                                </td>
                                                                <td className="px-6 py-5 ">
                                                                    {
                                                                        item.paid_date ?
                                                                            moment(item.paid_date).format("DD/MM/YYYY")
                                                                            :
                                                                            "--"
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-5 uppercase" >
                                                                    {item.type}
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    {item.amount}
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    {item.status == "pending"
                                                                        ? '--'
                                                                        : item?.receipt?.extra_charge}
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    {
                                                                        item.status == "pending" ?
                                                                            <h1 className=' text-red-700 font-bold px-1 py-[2px] rounded-md'>
                                                                                Pending
                                                                            </h1>
                                                                            :
                                                                            <h1 className='bg-green-300 text-green-900 font-bold px-1 py-[2px] rounded-md'>
                                                                                Paid
                                                                            </h1>
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-5">
                                                                    {
                                                                        item.status == "pending" ?
                                                                            <Tippy content="Pay EMI">
                                                                                <button
                                                                                    disabled={item.id != emiId}
                                                                                    onClick={() => handlePayEMI(item.id)}
                                                                                    className={`${item.id != emiId ? 'opacity-60' : null} w-full flex justify-center items-center bg-green-600 hover:bg-green-500 py-[5px] rounded-lg text-white font-semibold`}>
                                                                                    Pay
                                                                                </button>
                                                                            </Tippy>

                                                                            :
                                                                            <Tippy content="Show Receipt">
                                                                                <div className="flex justify-center items-center">
                                                                                    <AiFillEye
                                                                                        className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                                                                        onClick={() =>
                                                                                            navigate(`/Receipt/Receipt/${item?.receipt?.id}`)}
                                                                                    />
                                                                                </div>
                                                                            </Tippy>

                                                                    }
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                })
                                            }
                                        </table>
                                    </div>
                                </div>
                                :
                                (
                                    <div className='flex mx-20 justify-center items-center py-[7px]  rounded-md space-x-4 bg-red-200'>
                                        <IoMdInformationCircle className='text-xl text-red-600' />
                                        <h1 className='text-sm font-bold text-red-800'>No Customer Receipt Found </h1>
                                    </div>
                                )
                        )
                }
            </div>
        </>
    )
}

export default EMIHistory