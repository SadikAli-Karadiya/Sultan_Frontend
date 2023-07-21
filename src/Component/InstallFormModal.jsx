import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../Component/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from 'react-query'
import { AddInstallment, UpdateInstallment } from '../utils/apiCalls';


function InstallmentFormModal({ showModal, handleShowModal, refetchInstallments, InstallmentDetails, is_Edit }) {
  
  if (!showModal) {
    return <></>;
  }

  let id = InstallmentDetails?.id;

  const addInstallment = useMutation(AddInstallment);
  const updateInstallment = useMutation(UpdateInstallment);

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

  const installmentSchema = Yup.object({
    month: Yup.string().required("Please Enter Installment Name"),
    charges: Yup.string().required("Please Enter Charges").matches(/^[0-9]+$/, 'Please enter only numbers'),
  });

  const initialValues = {
    month: "",
    charges: "",
  }

  const { values, errors, resetForm, handleBlur, touched, setValues, setFieldValue, handleChange, handleSubmit } =
    useFormik({
      initialValues:
        JSON.stringify(InstallmentDetails) != {} ? { month : InstallmentDetails?.month , charges : InstallmentDetails?.charges } :
          initialValues,
      validationSchema: installmentSchema,
      async onSubmit(data) {
        Object.assign(data, { id: id })
        try {
          if (is_Edit == true) {
            updateInstallment.mutate(data)
          } else {
            addInstallment.mutate(data)
          }
        } catch (err) {
          toast.error(err.response.data.message);
        }
      },
    });

  const handleModalClose = () => {
    resetForm();
    handleShowModal(false);
  };

  React.useEffect(() => {
    if(is_Edit && updateInstallment.data?.data){
      toast.success(updateInstallment.data?.data?.message);
      refetchInstallments()
      handleModalClose()
    }
    else if(addInstallment.data?.data){
      toast.success(addInstallment.data?.data?.message);
      refetchInstallments()
      handleModalClose()
    }
  },[addInstallment.isSuccess, updateInstallment.isSuccess]);

  return (
    <Modal open={showModal}
      onClose={handleModalClose}
    >
      <Modal.Description className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-gray-700 shadow-xl rounded-lg ">
        <Modal.Title
          as="h3"
          className="mb-4 text-xl font-medium text-white">
          {is_Edit ? "Edit" : "Add"} Installment
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
          <div className="px-4 py-4">
            <form method="POST" action="/installment/addinstallment" className="space-y-6" encType='multipart/form-date' onSubmit={handleSubmit}>
              <div className="flex xs:flex-col items-center xs:space-y-4">
                <div className="flex flex-col space-y-2  w-full ">
                  <label htmlFor="company" className="text-white">Installment Name *</label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="month"
                    id="month"
                    value={values.month}
                    placeholder='Enter install name'
                    className="rounded-md w-full py-1 md:py-[5px] xl:py-[6px] px-2 outline-none"
                  />
                  {errors.month && touched.month ? (
                    <p className="form-error text-red-600 text-sm font-semibold">
                      {errors.month}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-2 w-full ">
                  <label htmlFor="model name " className="text-white">Charge *</label>
                  <input
                    type="text"
                    name="charges"
                    id="charges"
                    value={values.charges}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-md py-1 w-full md:py-[5px] xl:py-[6px] px-3 outline-none"
                    placeholder="Enter charge"
                  />
                  {errors.charges && touched.charges
                    ?
                    <p className='form-error text-red-600 text-sm font-semibold'>{errors.charges}</p>
                    :
                    null}
                </div>
              </div>

              <div className="mt-5 text-right">
                {
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={addInstallment.isLoading || updateInstallment.isLoading}
                    className={`${addInstallment.isLoading || updateInstallment.isLoading ? 'opacity-60' : ''} w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                  >
                    {
                      addInstallment.isLoading || updateInstallment.isLoading 
                      ? 
                        'Loading...' 
                      : 
                        is_Edit
                        ?
                          'Update'
                        :
                          'Submit'
                    }

                  </button>

                }
              </div>
            </form>
          </div>
        </Modal.Description>
      </Modal.Description>
    </Modal>
  );
}

export default InstallmentFormModal;
