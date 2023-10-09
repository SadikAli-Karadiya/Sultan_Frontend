import React, { useEffect, useRef, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";
import { getReceiptbyReceiptId, deleteReceiptById } from '../../../utils/apiCalls';
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import ReactToPrint from "react-to-print";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";


function Receipt() {
    const params = useParams();
    const location = useLocation()
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
                    {
                        
                            
                            <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer" id="" onClick={() => {
                                if(location?.state?.prevPath == "update_receipt"){
                                    navigate(`/Customer/EMI-History/${location.state.purchase_id}`)
                                }
                                else{
                                    navigate(-1)
                                }
                            }}>
                                <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-darkblue-500 mt-[3px]" />
                                <span className=" text-xl text-darkblue-500 font-semibold group-hover:text-blue-700">Back</span>
                            </div>
                            
                    }
                </div>
                <div className="flex justify-center items-center px-5">
                    <div ref={printRef} className="m-3  bg-white w-[790px] border h-[500px] shadow-xl rounded-md ">
                        <div className=" h-28 w-full flex flex-col justify-between">
                            <div className="flex items-center w-full justify-between  mt-2 pr-5">
                                <div className=" w-full flex justify-start items-center ml-5">
                                    <img src="/logo.jpg" alt="" className='w-[40%]' />
                                </div>
                                <div className="w-full flex justify-end items-center ">
                                    <h1 className="text-darkblue-500  text-2xl font-bold">Receipt No : </h1>
                                    <span className="text-darkblue-500 font-bold text-2xl px-3 py-1 rounded-md">{data?.data?.data?.SingleTransaction?.receipt?.receipt_id}</span>
                                </div>
                            </div>
                            <div className=" w-full bg-darkblue-500 flex justify-center items-center py-1 ">
                                <p className="text-xs text-white">ARCHANA IND . ESTATE, 10/C/23, Ajit Mill Cir, nr. NILKHANTH RESTURANT, Rakhial, Ahmedabad, Gujarat 380023</p>
                            </div>
                        </div>
                        <div className="flex justify-between w-full px-7 pt-2 space-x-5">
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
                        <div className="flex justify-between w-full px-7 pt-2 space-x-5">
                            <div className="flex items-center w-[55%] ">
                                <h1 className=" font-semibold">Model </h1>
                                <div className="ml-24 w-full flex items-center space-x-2 font-semibold rounded-md border-dotted border-b-2 border-slate-300">
                                    <span className=" text-lg">:</span>
                                    <h1>
                                        {`${data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.phone.company.company_name} 
                                            ${data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.phone.model_name}`}
                                    </h1>
                                    <span>( {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.ram} x {data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.specification.storage} )</span>
                                </div>
                            </div>
                            <div className="px-7">
                                <div className="flex justify-between w-full">

                                    <div className="flex items-center">
                                        <h1 className=" font-semibold">Installment Type </h1>
                                        <span className="pl-1 text-lg">:</span>
                                        <div className="ml-2 font-semibold rounded-md ">
                                            <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.installment.month} Months</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-7 mt-5">
                            <div className="flex justify-between items-center space-y-1 w-full space-x-5">
                                <div className="flex items-center w-full">
                                    <h1 className=" font-semibold">Total Amount </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 w-1/2 font-semibold rounded-md border-2  px-2 border-slate-200">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.net_amount}</h1>
                                    </div>
                                </div>
                                <div className="flex items-center w-full">
                                    <h1 className=" font-semibold">PaidUp </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 w-1/2 font-semibold  rounded-md border-2 px-2  border-slate-200">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.net_amount - data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.pending_amount}</h1>
                                    </div>
                                </div>
                                <div className="flex items-center w-full">
                                    <h1 className=" font-semibold">Bill No </h1>
                                    <span className="pl-1 text-lg">:</span>
                                    <div className="ml-2 w-1/2 font-semibold rounded-md px-2 ">
                                        <h1>{data?.data?.data?.SingleTransaction?.receipt?.emi.purchase.bill_number}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex  w-full px-7 py-5 ">
                            <div className="flex items-center w-full space-x-5 ">
                                <h1 className=" font-semibold ">Amount </h1>
                                <div className="bg-slate-200  rounded-full items-center w-1/2 py-2 px-3 flex ">
                                    <BiRupee className="text-2xl mt-1 text-darkblue-500" />
                                    <h1 className="font-bold text-darkblue-500 ml-3 text-2xl">
                                        {data?.data?.data?.SingleTransaction?.amount}
                                        /-</h1>
                                </div>
                            </div>
                            <div className="flex items-center w-1/2">
                                <h1 className=" font-semibold w-full ">
                                    Payment For
                                    <span className="ml-3 "> :</span>
                                </h1>
                                <div className="text-xl w-full border-dotted border-b-2 border-slate-300">
                                    <span className=" font-semibold text-[16px]  ">
                                        <span className="pr-3">Installment</span>{data?.data?.data?.emiCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-20 px-7 justify-between">
                            <div className="flex items-start ">
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
                                <h1 className="font-semibold mt-2 text-end text-sm ">Authorized Signature</h1>
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