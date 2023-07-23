import React, { useEffect, useRef, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getReceiptbyReceiptId, deleteReceiptById } from '../../../utils/apiCalls';
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import ReactToPrint from "react-to-print";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";


function Receipt() {
    const params = useParams();
    const navigate = useNavigate();
    const printRef = useRef();
    const [print, setPrint] = useState(false);
    const data = useQuery(['transection', params.id], () => getReceiptbyReceiptId(params.id));
    const deleteReceipt = useMutation(deleteReceiptById);

    function inWords(num) {
        let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        if ((num = num?.toString())?.length > 9) return 'overflow';
        let n = ('000000000' + num)?.substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

        return str.toUpperCase() + ' ONLY';
    }

    let amountInWords = inWords(data?.data?.data?.SingleTransaction?.amount)

    const handleDeleteReceipt = async () => {
        Swal.fire({
            title: "Are you sure to delete the receipt?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                deleteReceipt.mutate(params.id)
            }
        });
    };

    const handlePayEMI = (id) => {
        navigate(`/receipt/Generate/${id}`, {
            state: {
                isEdit: true,
                emi_id: id,
            }
        })
    };

    useEffect(() => {
        if (deleteReceipt.isError) {
            toast.error(deleteReceipt.error.response.data.message)
        }
        else if (deleteReceipt.isSuccess) {
            toast.success(deleteReceipt.data?.data.message)
            navigate(-1)
        }
    }, [deleteReceipt.isSuccess, deleteReceipt.isError])

    return (
        <>
            <div className=' sm:px-5 xl:px-10 h-full'>
                <div className=' py-5 px-5 flex justify-between'>
                    <h1 className='text-[#0d0d48] text-2xl font-bold'>Receipt</h1>
                    <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer" id="" onClick={() => {
                        navigate(-1)
                    }}>
                        <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-darkblue-500 mt-[3px]" />
                        <span className=" text-xl text-darkblue-500 font-semibold group-hover:text-blue-700">Back</span>
                    </div>
                </div>
                <div className="flex justify-center items-center px-5">
                    <div ref={printRef} className="m-3 py-7 bg-white w-[790px] border h-[550px] shadow-xl rounded-md ">
                        <div className="px-7 flex items-center justify-between">
                            <div className="flex items-center ">
                                <div className="logo">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl text-[#2908C7] font-bold">SULTAN </h2>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl text-[#2908C7] font-bold">MOBILE </h2>
                                </div>
                                <div className="address pl-20">
                                    <span>Phone : +91 7600199352</span>
                                    <p>Ajit Mill Char Rasta</p>
                                    <p>Rakhial Road Ahmedabad</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <h1 className="text-2xl">Receipt No : </h1>
                                <div className="bg-slate-200 py-[10px] px-9 rounded-full ml-4">
                                    <span className="text-2xl text-gray-600 font-bold">{data?.data?.data?.SingleTransaction?.receipt?.receipt_id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between w-full px-7 pt-4 space-x-5">
                            <div className="flex items-center w-[65%] py-5">
                                <h1 className=" font-semibold w-[230px]">Customer Name <span className="ml-5">:</span></h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className=" uppercase font-semibold text-[16px] space-x-2">
                                        <span>{data?.data?.data?.SingleTransaction?.receipt?.emi?.purchase?.customer?.full_name}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center w-[35%]">
                                <h1 className=" font-semibold w-[100px]">Date <span className="ml-3 "> :</span></h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className="uppercase font-semibold text-[16px]  ">
                                        {moment(data?.data?.data?.SingleTransaction?.createdAt).format("DD / MM / YYYY")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between w-full px-7 ">
                            <div className="flex items-center w-full">
                                <h1 className=" font-semibold w-[200px]">Amount <span className="ml-[80px] ">:  </span> </h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className="uppercase font-semibold text-[16px]  ">{amountInWords}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-200 mx-16 rounded-full items-center px-6 py-2 h-12 flex  ml-48 mt-5">
                            <BiRupee className="text-3xl mt-1" />
                            <h1 className="font-bold ml-3 text-3xl">
                                {data?.data?.data?.SingleTransaction?.amount}
                                /-</h1>
                        </div>
                        <div className="flex justify-between w-full px-7 space-x-8">
                            <div className="flex items-center w-[50%] py-5">
                                <h1 className=" font-semibold w-[230px]">Extra Charge <span className="ml-5">:</span></h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className=" uppercase font-semibold text-[16px] space-x-2">
                                        <span>{data?.data?.data?.SingleTransaction?.receipt?.extra_charge}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center w-[50%]">
                                <h1 className=" font-semibold w-[200px]">
                                    Payment For
                                    <span className="ml-3 "> :</span>
                                </h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className="uppercase font-semibold text-[16px]  ">
                                        {data?.data?.data?.emiCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-7">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center">
                                    <h1 className=" font-semibold">Model </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 flex items-center space-x-2 font-semibold rounded-md text-slate-600">
                                        <h1>
                                            {`${data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.phone.company.company_name} 
                                            ${data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.phone.model_name}`}
                                        </h1>
                                        <span>( {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.ram} x {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.storage} )</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <h1 className=" font-semibold">Installment Type </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold rounded-md text-slate-600">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.installment.month} Months</h1>
                                    </div>
                                </div>
                                {/* <div className="w-64 flex items-center">
                                    <h1 className=" font-semibold">RAM </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold rounded-md text-slate-600">
                                        <h1>
                                            {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.ram}
                                        </h1>
                                    </div>
                                </div>
                                <div className="w-64 flex items-center">
                                    <h1 className=" font-semibold">Storage </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold rounded-md text-slate-600">
                                        <h1>
                                            {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.storage}
                                        </h1>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="px-7 pt-5">
                            <div className="flex justify-between space-y-1">
                                <div className="flex items-center">
                                    <h1 className=" font-semibold">Total Amount </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold rounded-md text-slate-600">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.net_amount}</h1>
                                    </div>
                                </div>
                                <div className="flex items-center ">
                                    <h1 className=" font-semibold">Paid Amount </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold  rounded-md text-slate-600 ">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.net_amount - data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.pending_amount}</h1>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <h1 className=" font-semibold">Pending Amount </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 font-semibold rounded-md text-slate-600 ">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.pending_amount}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mt-14 justify-between">
                                <div className="flex items-start text-slate-600">
                                    <h1 className="font-semibold">Payment By</h1>
                                    <div className="flex flex-col items-start ml-1">
                                        <div className="font-semibold">
                                            {
                                                data?.data?.data?.SingleTransaction?.is_by_cash == true
                                                    ?
                                                    (<span>Cash</span>)
                                                    :
                                                    data?.data?.data?.SingleTransaction?.is_by_upi == true ?
                                                        <span>UPI ( {data?.data?.data?.SingleTransaction?.upi_no} ) </span>
                                                        :
                                                        data?.data?.data?.SingleTransaction?.is_by_cheque == true
                                                            ?
                                                            <div className="flex">
                                                                <span> Cheque </span>
                                                                <div>
                                                                    <span className="ml-2">( {data?.data?.data?.SingleTransaction?.cheque_no} )</span>
                                                                    <span className="ml-2"> {moment(data?.data?.data?.SingleTransaction?.cheque_date).format("DD / MM / YYYY")}</span>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[20%]">
                                    <div className="border-b-2">

                                    </div>
                                    <h1 className="font-semibold mt-2 text-end text-sm text-slate-500">Authorized Signature</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center py-8 space-x-5">
                    <button
                        onClick={() => handlePayEMI(data?.data?.data?.SingleTransaction?.receipt?.emi?.id)}
                        disabled={deleteReceipt.isLoading}
                        className={`${deleteReceipt.isLoading ? 'opacity-60' : ''} bg-[#0d0d48] flex items-center space-x-1 px-4 py-1.5 hover:bg-slate-600 rounded-md text-white`}>
                        <MdModeEdit className="text-blue-400" />
                        <h1 className="text-sm">Edit</h1>
                    </button>
                    <button
                        onClick={handleDeleteReceipt}
                        disabled={deleteReceipt.isLoading}
                        className={`${deleteReceipt.isLoading ? 'opacity-60' : ''} bg-[#0d0d48] flex items-center space-x-1 px-3 py-1.5 hover:bg-slate-500 rounded-md text-white`}>
                        <MdDelete className="text-blue-400" />
                        <h1 className="text-sm">{deleteReceipt.isLoading ? 'Deleting...' : 'Delete'}</h1>
                    </button>
                    <ReactToPrint
                        trigger={() => (
                            <button className="bg-[#0d0d48]  py-1 px-3 rounded-md hover:opacity-60">
                                <span className="text-white text-sm">Download/Print</span>
                            </button>
                        )}
                        content={() => printRef.current}
                        onBeforeGetContent={() => {
                            return new Promise((resolve) => {
                                setPrint(true);
                                resolve();
                            });
                        }}
                        onAfterPrint={() => setPrint(false)}
                    />
                </div>
            </div>
        </>
    )
}

export default Receipt