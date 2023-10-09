import React, { useState } from "react";
import { toast } from 'react-toastify';
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import moment from 'moment'
import { BiRupee } from "react-icons/bi";
import { MdDelete } from "react-icons/md"
import { getSingleEmi, AddTransection, updateReceipt } from '../../../utils/apiCalls';
import { useQuery } from 'react-query'
import Tippy from '@tippyjs/react';
import { PhoneContext } from "../../../PhoneContext";
import 'tippy.js/dist/tippy.css';

function GenerateReceipt() {

    const location = useLocation();
    const { user } = React.useContext(PhoneContext);
    const Emi_Details = useQuery(['emi', location?.state?.emi_id], () => getSingleEmi(location?.state.emi_id))
    const [selectPayment, setSelectPayment] = useState("1");
    const [Charge, setCharge] = useState(false);
    const [Charge_amount, setchargeamount] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDate, setChequeDate] = useState('');
    const [upiNo, setUpiNo] = useState('');
    const [pin, setPin] = useState("");
    const [toggleCheque, setToggleCheque] = useState(false);
    const [toggleUpi, setToggleUpi] = useState(false);
    const [toggleCash, setToggleCash] = useState(true);
    const [model, setModel] = useState();
    const navigate = useNavigate();
    let todayDate = moment(Emi_Details?.data?.data?.SingleEmi?.due_date).format("yyyy-MM-D")
    const [receiptDate, setReceiptDate] = useState(todayDate);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        amount: '',
        discount: '',
        upi: '',
        cheque: '',
        chequeDate: '',
        invalid_pin: '',
        month: ''
    });
    const onSubmit = () => {
        let err = 0;

        if (toggleUpi && upiNo == '') {
            err++;
            setErrors((prevData) => {
                return {
                    ...prevData,
                    upi: '*Please Enter UPI Number'
                }
            })
        }
        if (toggleCheque && chequeNo == '') {
            err++;
            setErrors((prevData) => {
                return {
                    ...prevData,
                    cheque: '*Please enter cheque number'
                }
            })
        }

        if (toggleCheque && chequeDate == '') {
            err++;
            setErrors((prevData) => {
                return {
                    ...prevData,
                    chequeDate: '*Please select cheque date'
                }
            })
        }

        if ((errors.amount != '' && errors.amount != undefined) || (errors.upi != '' && errors.upi != undefined) || (errors.cheque != '' && errors.cheque != undefined) || (errors.chequeDate != '' && errors.chequeDate != undefined) || (errors.month != '' && errors.month != undefined)) {
            err++;
        }

        if (err == 0) {
            setSelectPayment(
                toggleCheque
                    ?
                    'Cheque'
                    :
                    toggleUpi
                        ?
                        'UPI'
                        :
                        'Cash'
            )
            setModel(true);
        }
        else {
            return;
        }

    }

    async function handlePINsubmit() {
        try {

            if (pin == "") {
                return toast.error("Please Enter Pin")
            }

            const EMIData = {
                is_by_cash: toggleCash ? 1 : 0,
                is_by_cheque: toggleCheque ? 1 : 0,
                is_by_upi: toggleUpi ? 1 : 0,
                cheque_no: chequeNo == '' ? null : Number(chequeNo),
                cheque_date: chequeDate == '' ? null : new Date(chequeDate),
                upi_no: upiNo == '' ? null : Number(upiNo),
                user_id: user.id,
                purchase_id: Emi_Details?.data?.data?.SingleEmi?.purchase?.id,
                Emi_id: Emi_Details?.data?.data?.SingleEmi?.id,
                Charge_amount: Number(Charge_amount),
                amount: totalAmount,
                security_pin: pin,
                customer_id: Emi_Details?.data?.data?.SingleEmi?.purchase?.customer?.id,
                date: new Date(receiptDate)
            };

            setIsSubmitting(true);

            if (location.state.isEdit == true) {
                Object.assign(EMIData, {emi_id: location?.state.emi_id})
                let res = await updateReceipt(EMIData)
                setIsSubmitting(false);

                if (res.data.success == true) {
                    toast.success(res.data.message)
                    navigate(`/receipt/receipt/${res?.data?.receipt_id}`, {
                        state: {
                            prevPath: "update_receipt",
                            purchase_id: res?.data?.purchase_id,
                        }
                    });
                } else {
                    setErrors((prevData) => {
                        return {
                            ...prevData,
                            invalid_pin: res.data.message
                        }
                    });
                }
            } else {
                let res = await AddTransection(EMIData)
                setIsSubmitting(false);

                if (res.data.success == true) {
                    toast.success(res.data.message)
                    navigate(`/receipt/receipt/${res?.data?.data?.receipt_id}`);
                } else {
                    setErrors((prevData) => {
                        return {
                            ...prevData,
                            invalid_pin: res.data.message
                        }
                    });
                }
            }

        }
        catch (err) {
            setIsSubmitting(false);
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message)
            }
            else {
                toast(err.message)
            }
        }
    }

    function handlePaymentMethod(e) {
        setUpiNo('')
        setChequeNo('')
        setChequeDate('');
        setErrors((prevData) => {
            return {
                ...prevData,
                upi: '',
                cheque: '',
                chequeDate: ''
            }
        })

        if (e.target.value == 1) {
            setSelectPayment(e.target.value);
            setToggleCash(true);
            setToggleCheque(false);
            setToggleUpi(false);
        }
        else if (e.target.value == 2) {
            setSelectPayment(e.target.value);
            setToggleCheque(false);
            setToggleCash(false)
            setToggleUpi(true);
        }
        else {
            setSelectPayment(e.target.value);
            setToggleUpi(false);
            setToggleCash(false);
            setToggleCheque(true);
        }
    }

    const handleUpiNo = (e) => {
        const regex = new RegExp(/^[0-9 A-Za-z@]+$/)

        if (regex.test(e.target.value)) {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    upi: ''
                }
            })
        }
        else {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    upi: '*Enter only numbers'
                }
            })
        }
        setUpiNo(e.target.value)
    }
    const handleChequeNo = (e) => {
        const regex = new RegExp(/^[0-9]+$/)

        if (regex.test(e.target.value)) {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    cheque: ''
                }
            })
        }
        else {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    cheque: '*Enter only numbers'
                }
            })
        }
        setChequeNo(e.target.value)
    }

    function isSameDay(selectedDate) {
        const date = new Date(selectedDate);
        const currentDate = new Date();

        return date.getFullYear() === currentDate.getFullYear()
            && date.getDate() === currentDate.getDate()
            && date.getMonth() === currentDate.getMonth();

    }

    const handleChequeDate = (e) => {
        if (e.target.value == '') {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    chequeDate: '*Please select cheque date'
                }
            })
        }
        else if (isSameDay(e.target.value)) {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    chequeDate: ''
                }
            })
        }
        else if (new Date(e.target.value).getTime() < new Date().getTime()) {
            setErrors((prevData) => {
                return {
                    ...prevData,
                    chequeDate: '*Cheque date should be greater than today\'s date'
                }
            })
        }
        setChequeDate(e.target.value)
    }

    const handleChangeDate = (e) => {
        setReceiptDate(e.target.value);
    }

    function handleAddCharge() {
        setCharge(true)
    }

    function handleremovecharge() {
        setchargeamount("")
        setCharge(false)
    }

    function handleCharge(event) {
        setchargeamount(event.target.value) 
    };

    React.useEffect(() => {
        setTotalAmount(Emi_Details?.data?.data?.SingleEmi?.amount)
    }, [Emi_Details.isSuccess]);


    return (
        <>
            <div className="relative bg-student-100 py-3 ">
                {model && (
                    <div className='absolute w-full h-full  z-30 ' >

                        <div className="flex justify-center xs:px-4 mt-10  bg-white ">
                            <div className="absolute xs:h-[81%] md:h-[68%] xl:h-[80%] mx-auto  opacity-100 shadow-2xl rounded bg-white h-full xs:w-[60%] xl:w-[65%] z-50">
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            setModel(!model);
                                            setErrors((prevData) => {
                                                return {
                                                    ...prevData,
                                                    invalid_pin: ''
                                                }
                                            });
                                            setIsSubmitting(false);
                                        }}
                                        className="absolute translate-x-4 -translate-y-4 font-bold text-2xl p-2 text-red-700"
                                    >
                                        <AiFillCloseCircle />
                                    </button>
                                </div>

                                <div className="mt-7">
                                    <h1 className="text-2xl font-bold text-[#0d0d48] px-6 ">
                                        Confirm Payment{" "}
                                    </h1>
                                    <div className="flex xs:flex-col sm:flex-row py-4 justify-between">
                                        <div className="flex flex-col xs:space-y-2 lg:space-y-1 xl:space-y-2 px-7 text-sm xs:order-2 sm:order-1">
                                            <div>
                                                <h2 className="font-bold text-lg tracking-wide uppercase">NAME : {Emi_Details?.data?.data?.SingleEmi?.purchase?.customer?.full_name}</h2>
                                            </div>
                                            <div className="flex xs:space-y-5 lg:space-y-1 flex-col">
                                                <div className="flex xs:flex-col xs:space-y-2 lg:flex-row lg:space-x-5 lg:space-y-0">
                                                    <h2 className="font-roboto">Company : {Emi_Details?.data?.data?.SingleEmi?.purchase?.phone?.company?.company_name}</h2>
                                                    <h2 className="font-roboto">Model : {Emi_Details?.data?.data?.SingleEmi?.purchase?.phone?.model_name}</h2>
                                                    <h2 className="font-roboto">RAM : {Emi_Details?.data?.data?.Specifications?.ram} / {Emi_Details?.data?.data?.Specifications?.storage}
                                                    </h2>
                                                </div>
                                                <h3 className="font-roboto">Net Amount : {Emi_Details?.data?.data?.SingleEmi?.purchase?.net_amount}</h3>
                                                <h3 className="font-roboto">Pending Amount : {Emi_Details?.data?.data?.SingleEmi?.purchase?.pending_amount}</h3>
                                            </div>
                                        </div>
                                        <div className="px-7 font-mono xs:order-1 sm:order-2 py-2 flex justify-end">
                                            <h3 className=""> Date : {moment(receiptDate).format("DD-MM-yyyy")}</h3>
                                        </div>
                                    </div>

                                    <div className="flex xs:flex-col xs:space-x-0 xs:space-y-4 xs:py-1 sm:flex-row sm:space-y-0 sm:space-x-5 px-12 py-5  space-x-4">
                                        <span className="px-4 py-1 bg-green-200 text-green-900 font-bold text-sm rounded shadow-xl ">
                                            Paying : {totalAmount}
                                        </span>
                                        <span className="px-4 py-1 bg-red-200 text-red-900 font-bold text-sm rounded shadow-xl ">
                                            Charge : {Charge_amount ? Charge_amount : 0}
                                        </span>
                                        <span className="px-4 py-1 bg-blue-200 text-[#0d0d48] font-bold text-sm rounded shadow-xl ">
                                            Total : {Number(totalAmount) + Number(Charge_amount)}
                                        </span>
                                    </div>
                                    <div className="flex xs:flex-col md:flex-row md:items-center justify-between xs:px-5">
                                        <div className="px-6 py-3 text-[#0d0d48] ">
                                            <h2 className="font-bold">* Paying by : <span className="font-medium text-gray-600">{selectPayment}</span></h2>
                                            {
                                                toggleCheque
                                                    ?
                                                    <h2 className="font-bold">* Cheque No: <span className="font-medium text-gray-600">{chequeNo}</span></h2>
                                                    :
                                                    toggleUpi
                                                        ?
                                                        <h2 className="font-bold">* UPI ID: <span className="font-medium text-gray-600">{upiNo}</span></h2>
                                                        :
                                                        null
                                            }
                                        </div>

                                        <div className="flex justify-center items-center">
                                            <div className="border-2 xl:mx-8 mt-6 h-8  rounded-md xl:w-fit flex xs:flex-col xs:space-y-4 sm:flex-row sm:space-y-0  items-center border-[#0d0d48]">
                                                <input
                                                    type="password"
                                                    className="px-3 outline-none "
                                                    placeholder="Enter Security PIN"
                                                    onChange={(e) => setPin(e.target.value)}
                                                />
                                                <button
                                                    disabled={isSubmitting}
                                                    className={`px-4 py-1 ${isSubmitting ? 'bg-blue-600' : 'bg-[#0d0d48]'} text-white rounded-md`}
                                                    onClick={handlePINsubmit}
                                                >
                                                    {isSubmitting ? 'Loading...' : 'Submit'}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    {
                                        errors.invalid_pin != ''
                                            ?
                                            <h1 className=" text-red-700  text-sm my-1 font-bold w-full pr-44  text-right">
                                                {errors.invalid_pin}
                                            </h1>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`mt-2 bg-student-100 xs:px-5 xl:px-12  py-2 ${model && "opacity-20"} `}>
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-[#0d0d48] text-2xl ">
                            {location.state?.isEdit ? 'Update' : 'Generate'} EMI Receipt
                        </h1>
                        <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer" id="" onClick={() => navigate(-1)}>
                            <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-[#0d0d48] mt-[3px]" />
                            <span className=" text-xl text-[#0d0d48] font-semibold group-hover:text-blue-700">Back</span>
                        </div>

                    </div>

                    <div className="flex justify-center items-center pt-10">
                        <form className="w-[90%] bg-white shadow-xl rounded-xl px-7 py-6">
                            <div className='flex flex-col justify-start w-full'>
                                <div className="flex justify-between items-center w-full">
                                    <div className="w-full">
                                        <span className="font-bold uppercase w-full">Name : {Emi_Details?.data?.data?.SingleEmi?.purchase?.customer?.full_name}</span>
                                    </div>
                                    <div className="flex w-full items-center justify-end">
                                        <span>Date : </span>
                                        <input type="date"
                                            name="receiptDate"
                                            onChange={handleChangeDate}
                                            value={moment(receiptDate).format("yyyy-MM-DD")}
                                            disabled={true}
                                            className="ml-4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 py-2">
                                <div className="space-x-5">
                                    <span className="text-[14.5px] font-roboto">Company : {Emi_Details?.data?.data?.SingleEmi?.purchase?.phone?.company?.company_name} </span>
                                    <span className="text-[14.5px] font-roboto">Model : {Emi_Details?.data?.data?.SingleEmi?.purchase?.phone?.model_name}</span>
                                    <span className="text-[14.5px] font-roboto">Storage : {Emi_Details?.data?.data?.Specifications?.ram} / {Emi_Details?.data?.data?.Specifications?.storage}</span>
                                </div>
                                <span className=" text-[14.5px] font-roboto">Net Amount : {Emi_Details?.data?.data?.SingleEmi?.purchase?.net_amount}</span>
                                <span className=" text-[14.5px] font-roboto">Pending  : {Emi_Details?.data?.data?.SingleEmi?.purchase?.pending_amount}</span>
                            </div>
                            <div className="flex items-center w-full justify-between pt-5 ">
                                <div className="flex items-center w-1/4 border-2 border-[#0d0d48] rounded-full ">
                                    <div className="bg-[#0d0d48] text-white text-xl py-[7px] px-[7px] rounded-full">
                                        <BiRupee className="" />
                                    </div>
                                    <input type="text"
                                        name="total"
                                        value={totalAmount}
                                        onChange={(e)=> setTotalAmount(e.target.value)}
                                        className="bg-white w-28 ml-2 border-transparent focus:ring-0"
                                    />

                                </div>
                                <div className="w-1/4">
                                    {
                                        Charge == false ?
                                            <div className="flex items-center justify-end"
                                                onClick={handleAddCharge}
                                            >
                                                <h1 className="bg-red-600 py-[5px] px-2 text-sm rounded-md text-white  cursor-pointer">Extra Charge</h1>
                                            </div>
                                            :
                                            ""
                                    }

                                    {
                                        Charge == true ?
                                            <div className="flex w-full justify-end">
                                                <div className="flex items-center justify-start space-x-3 border shadow-xl rounded-full px-2 py-[5px]">
                                                    <div className="flex flex-col w-full ">
                                                        <input type="text"
                                                            name="charge"
                                                            value={Charge_amount}
                                                            onChange={handleCharge}
                                                            className="outline-none w-24  pl-1 "
                                                            placeholder="Charge " />
                                                    </div>
                                                    <div className="flex items-center space-x-2 group cursor-pointer hover:bg-red-600 group py-[5px] px-[5px] rounded-full  "
                                                        onClick={handleremovecharge}
                                                    >
                                                        <MdDelete className="text-red-600 group-hover:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div className="flex pt-3">
                                <h1 className="font-bold">By</h1>
                                <div className="flex space-x-4 ml-3 ">
                                    <div
                                        className="bg-white space-x-1 rounded-md py-[4px] cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            id="sme"
                                            className=""
                                            value="1"
                                            checked={toggleCash ? 'checked' : ''}
                                            onChange={handlePaymentMethod}
                                        />
                                        <span className="font-semibold text-sm"> Cash </span>
                                    </div>
                                    <div className="bg-white space-x-1 rounded-md py-[4px] cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            id="sme"
                                            className=""
                                            value="2"
                                            onChange={handlePaymentMethod}
                                        />
                                        <span className="font-semibold text-sm"> UPI </span>
                                    </div>
                                    <div className="bg-white space-x-1 rounded-md py-[4px] cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            id="sme"
                                            className=""
                                            value="3"
                                            onChange={handlePaymentMethod}
                                        />
                                        <span className="font-semibold text-sm"> Cheque </span>
                                    </div>
                                </div>
                            </div>
                            {
                                toggleCheque
                                    ?
                                    <div className="flex w-full space-x-5">
                                        <div className="flex flex-col ">
                                            <div className="flex rounded-md w-40 ">
                                                <input
                                                    type="text"
                                                    autoFocus={true}
                                                    placeholder="Enter Cheque Number"
                                                    className="px-2 py-[5px] w-full border-2 border-slate-500 rounded-md outline-none"
                                                    value={chequeNo}
                                                    onChange={handleChequeNo}
                                                />
                                            </div>
                                            {errors.cheque != '' ? (<small className="text-red-700 mt-2">{errors.cheque}</small>) : null}
                                        </div>
                                        <div className="flex flex-col w-40">
                                            <Tippy content="Select Cheque Date">
                                                <span>
                                                    <input
                                                        type="date"
                                                        className="placeholder-black border-2 border-slate-500 p-1 w-full rounded-md outline-none"
                                                        onChange={handleChequeDate}
                                                    />
                                                </span>
                                            </Tippy>
                                            {errors.chequeDate != '' ? (<small className="text-red-700 mt-2">{errors.chequeDate}</small>) : null}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                toggleUpi
                                    ?
                                    <div className="flex flex-col">
                                        <div className="flex rounded-md w-52">
                                            <input
                                                type="text"
                                                autoFocus={true}
                                                placeholder="Enter Upi Number/id"
                                                className="px-3 py-[5px] w-full border-2 border-slate-500 rounded-md outline-none "
                                                value={upiNo}
                                                onChange={handleUpiNo}
                                            />
                                        </div>
                                        {errors.upi != '' ? (<small className="text-red-700 mt-2">{errors.upi}</small>) : null}
                                    </div>
                                    :
                                    null
                            }

                            <div className="mt-5 w-full flex items-center justify-between">
                                <span className="text-sm font-semibold">Admin : {user?.username}</span>
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    className='w-28 text-white bg-[#0d0d48] hover:shadow-md uppercase px-5 py-2 rounded-md text-sm text-center '
                                >
                                    {location.state?.isEdit ? 'Update' : 'Generate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GenerateReceipt