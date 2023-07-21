import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../Component/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MdDelete } from "react-icons/md"
import { FiPlus } from "react-icons/fi"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { AddTransection, getEmiPurchasebyId } from '../utils/apiCalls';
import { useQuery } from 'react-query'
import { AxiosError } from "axios";
import moment from 'moment'

function ChargeFormModal({ showModal, handleShowModal, EMI_Details, is_Edit }) {

  if (!showModal) {
    return <></>;
  }

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = React.useState();
  const [selectPayment, setSelectPayment] = React.useState("1");
  const [status, setstatus] = React.useState("compalete");
  const [Charge, setCharge] = React.useState(false);
  const [Charge_amount, setchargeamount] = React.useState("");
  const [chequeNo, setChequeNo] = React.useState('');
  const [chequeDate, setChequeDate] = React.useState('');
  const [upiNo, setUpiNo] = React.useState('');
  const [pin, setPin] = React.useState("");
  const [toggleCheque, setToggleCheque] = React.useState(false);
  const [toggleUpi, setToggleUpi] = React.useState(false);
  const [toggleCash, setToggleCash] = React.useState(true);
  const [toggle, setToggle] = useState(false);
  const [emi_amount, setemiamount] = React.useState(EMI_Details.amount);
  const navigate = useNavigate();
  const today = new Date();
  const [receiptDate, setReceiptDate] = React.useState(today);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({
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
    if (emi_amount == '') {
      err++;
      setErrors((prevData) => {
        return {
          ...prevData,
          amount: '*Please enter amount'
        }
      })
    }

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
      setToggle(true);
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
        cheque_no: chequeNo,
        cheque_date: chequeDate,
        upi_no: upiNo,
        user_id: "3",
        purchase_id: EMI_Details?.purchase?.id,
        Emi_id: EMI_Details?.id,
        status: "compelete",
        Charge_amount: Charge_amount,
        amount: emi_amount + Charge_amount,
        security_pin: pin,
        customer_id: EMI_Details?.purchase?.customer?.id,
        date: receiptDate
      };

      setIsSubmitting(true);

      const res = await AddTransection(EMIData)

      setIsSubmitting(false);

      if (res.data.success == true) {
        toast.success('Receipt generated successfully')
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(75 85 99)",
      borderColor: "rgb(107 114 128)",
      borderRadius: "8px",
      minHeight: "44px",
      height: "44px",
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "44px",
      padding: "0 6px",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "44px",
    }),
  };

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

  const handleModalClose = () => {
    handleShowModal(false);
    setCharge(false)
  };

  function handlecharge() {
    setCharge(true)
  }

  function handleremovecharge() {
    setchargeamount("")
    setCharge(false)
  }

  function handleCharge(event) {
    setchargeamount(event.target.value)
  };

  let Total = (EMI_Details?.amount + Charge_amount)

  return (
    <Modal open={showModal}
      onClose={handleModalClose}>
      <Modal.Description className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-gray-700 shadow-xl rounded-lg ">
        <Modal.Title
          as="h3"
          className="mb-4 text-xl font-medium text-white">
          Generate EMI Receipt
        </Modal.Title>
        <button
          type="button"
          className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-hide="match-formation-modal"
          onClick={handleModalClose}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>

        <Modal.Description>
          <div className="px-4 pb-4">
            <form className="space-y-6">
              <div className='flex flex-col justify-start w-full'>
                <div className="flex items-center w-full space-x-5">
                  <div className="flex flex-col space-y-2 w-full ">
                    <input type="text"
                      name="price"
                      value={emi_amount}
                      disabled={true}
                      className="rounded-md py-[6px] px-3 outline-none w-full"
                      placeholder="Enter Phone Price " />

                  </div>
                  <div className="flex flex-col space-y-2 w-full ">
                    <input type="date"
                      name="receiptDate"
                      defaultValue={moment(receiptDate).format("DD / MM / YYYY")}
                      className="rounded-md py-[6px] px-3 outline-none w-full"
                      placeholder="Enter Phone Price " />

                  </div>
                </div>
                {
                  Charge == true ?
                    <div className="mt-5 flex flex-col ">
                      <div className="flex items-center justify-start space-x-3">
                        <div className="flex flex-col w-full ">
                          <input type="text"
                            name="charge"
                            value={Charge_amount}
                            handleCharge={handleCharge}
                            className="rounded-md py-[6px] px-3 outline-none"
                            placeholder="Enter Charge " />
                          {errors.charge && touched.charge
                            ?
                            <p className='form-error text-red-600 text-sm font-semibold'>{errors.charge}</p>
                            :
                            null}
                        </div>
                        <div className="flex items-center space-x-2 group cursor-pointer bg-red-600 py-2 px-2 rounded-md hover:bg-white "
                          onClick={handleremovecharge}
                        >
                          <MdDelete className="text-white text-lg group-hover:text-red-600" />
                        </div>
                      </div>
                      <div className="mt-5 w-full">
                        <div
                          className="rounded-md py-[6px] bg-white px-3 w-full outline-non">
                          Total : {Total}
                        </div>
                      </div>
                    </div>
                    :
                    null
                }
                {
                  Charge == false ?
                    <div className="flex items-center bg-white  mt-5 py-1 pl-1 hover:text-red-600 w-1/4  rounded-md text-gray-600 cursor-pointer"
                      onClick={handlecharge}
                    >
                      <div className="px-1 py-1 rounded-md text-lg">
                        <FiPlus />
                      </div>
                      <h1 className="font-semibold text-sm text-start">Charge</h1>
                    </div>
                    :
                    ""
                }
              </div>
              <div className="flex flex-col ">
                <div className="flex  space-x-5">
                  <div
                    className="bg-white space-x-1 px-6 rounded-md py-[4px] cursor-pointer">
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
                  <div className="bg-white space-x-1 px-6 rounded-md py-[4px] cursor-pointer">
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
                  <div className="bg-white space-x-1 px-6 rounded-md py-[4px] cursor-pointer">
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
                    <div className="flex flex-col w-full ">
                      <div className="flex rounded-md w-full ">
                        <input
                          type="text"
                          autoFocus={true}
                          placeholder="Enter Cheque Number"
                          className="px-2 py-[5px] w-full rounded-md outline-none"
                          value={chequeNo}
                          onChange={handleChequeNo}
                        />
                      </div>
                      {errors.cheque != '' ? (<small className="text-red-700 mt-2">{errors.cheque}</small>) : null}
                    </div>
                    <div className="flex flex-col w-full">
                      <Tippy content="Select Cheque Date">
                        <span>
                          <input
                            type="date"
                            className="placeholder-black p-1 w-full rounded-md outline-none"
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
                    <div className="flex rounded-md w-full">
                      <input
                        type="text"
                        autoFocus={true}
                        placeholder="Enter Upi Number/id"
                        className="px-3 py-[5px] w-full rounded-md outline-none "
                        value={upiNo}
                        onChange={handleUpiNo}
                      />
                    </div>
                    {errors.upi != '' ? (<small className="text-red-700 mt-2">{errors.upi}</small>) : null}
                  </div>
                  :
                  null
              }

              {!toggle ? (
                <div className="mt-5 text-right">
                  <button
                    type="button"
                    onClick={onSubmit}
                    className='w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 
                  py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    Done
                  </button>
                </div>
              ) : null}

              {
                toggle ? (
                  <div>
                    <div className="flex flex-col space-y-2 w-full ">
                      <input type="text"
                        name="pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="rounded-md py-[6px] px-3 outline-none"
                        placeholder="Enter Phone Pin " />
                      <span className="text-xs font-semibold text-red-600 px-1">
                        {
                          errors.invalid_pin != ''
                            ?
                            <h1 className=" text-red-700  text-sm font-bold w-full pr-44  text-right">
                              {errors.invalid_pin}
                            </h1>
                            :
                            null
                        }
                      </span>
                    </div>

                    <div className="mt-5 text-right">
                      <button
                        type="button"
                        onClick={handlePINsubmit}
                        disabled={isSubmitting}
                        className={`${isSubmitting ? 'opacity-60' : ''} w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                      >
                        {isSubmitting ? 'Loading...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                )
                  : null
              }
            </form>
          </div>
        </Modal.Description>
      </Modal.Description>
    </Modal>
  );
}

export default ChargeFormModal;
