import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../Component/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import CreatableSelect from 'react-select/creatable';
import { useQuery } from 'react-query'
import { AddSpecification, UpdateSpecification } from '../utils/apiCalls';
import { AxiosError } from "axios";

const productSchema = Yup.object({
  ram: Yup.string().required("Please Select RAM"),
  storage: Yup.string().required("Please Select Storage"),
  price: Yup.string().required("Please Enter Price").matches(/^[0-9]+$/, 'Please enter only numbers'),
});

function SpecificationFormModal({ showModal, handleShowModal, refetchSpecification, SpecificationDetails, is_Edit, setIsEdit }) {

  if (!showModal) {
    return <></>;
  }

  let PhoneId = useParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialValues = {
    ram: "",
    storage: "",
    price: "",
  }

  const { values, errors, resetForm, handleBlur, touched, setFieldValue, handleChange, handleSubmit } =
    useFormik({
      initialValues: JSON.stringify(SpecificationDetails) != {} ? { ram: SpecificationDetails?.ram, storage: SpecificationDetails?.storage, price: SpecificationDetails?.price } : initialValues,
      validationSchema: productSchema,
      async onSubmit(data) {
        Object.assign(data, { phone_id: PhoneId.id })
        let UpdateData = Object.assign(data, { id: SpecificationDetails?.id })

        try {
          if (is_Edit == true) {
            setIsSubmitting(true)
            const response = await UpdateSpecification(UpdateData)
            setIsSubmitting(false)
            toast.success(response.data.message);
            resetForm({ values: "" })
            refetchSpecification();
            handleModalClose(false);
          } else {
            setIsSubmitting(true)
            const response = await AddSpecification(data, { phone_id: PhoneId.id })
            setIsSubmitting(false)
            toast.success(response.data.message);
            resetForm({ values: "" })
            refetchSpecification();
            handleModalClose(false);
          }
        } catch (err) {
          if(err instanceof AxiosError){
            toast.error(err.response.data.message);
          }
          else{
            toast.error(err.message);
          }
        }
      },
    });

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

  const handleModalClose = () => {
    resetForm("")
    setIsEdit(false)
    handleShowModal(false);
  };

  return (
    <Modal open={showModal}
      onClose={handleModalClose}>
      <Modal.Description className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-gray-700 shadow-xl rounded-lg ">
        <Modal.Title
          as="h3"
          className="mb-4 text-xl font-medium text-white">
          {is_Edit ? "Update" : "Add"} Specifications
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className='flex flex-col items-center justify-start w-full space-y-5'>
                <div className='w-full'>
                  <label className="block">
                    <span className="block text-sm font-medium text-white">
                      RAM *
                    </span>
                    <select
                      name="ram"
                      id="ram"
                      value={values.ram}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className='w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                      <option value="">Select Ram</option>
                      <option value="2">2 GB</option>
                      <option value="3">3 GB</option>
                      <option value="4">4 GB</option>
                      <option value="6">6 GB</option>
                      <option value="8">8 GB</option>
                      <option value="12">12 GB</option>
                      <option value="16">16 GB</option>
                    </select>
                  </label>
                  {errors.ram &&
                    touched.ram ? (
                    <small className="form-error text-red-600 text-sm font-semibold">
                      {errors.ram}
                    </small>
                  ) : null}
                </div>
                <div className='w-full'>
                  <label className="block ">
                    <span className="block text-sm font-medium text-white">
                      Storage *
                    </span>
                    <select
                      name="storage"
                      id="storage"
                      value={values.storage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className='w-full mt-1 block  px-3 py-2 bg-white border  border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 outline-none'>
                      <option value="">Select Storage</option>
                      <option value="8">8 GB</option>
                      <option value="16">16 GB</option>
                      <option value="32">32 GB</option>
                      <option value="64">64 GB</option>
                      <option value="128">128 GB</option>
                      <option value="256">256 GB</option>
                      <option value="512">512 GB</option>
                      <option value="1024">1 TB</option>
                    </select>
                  </label>
                  {errors.storage && touched.storage
                    ?
                    <p className='form-error text-red-600 text-sm font-semibold'>{errors.storage}</p>
                    :
                    null}
                </div>
                <div className="flex flex-col space-y-2 w-full ">
                  <span className="block text-sm font-medium text-white">
                    Price *
                  </span>
                  <input type="text"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-md py-2 px-3 outline-non border border-slate-300 focus:outline-blue-500"
                    placeholder="Enter Phone Price" />
                  {errors.price && touched.price
                    ?
                    <p className='form-error text-red-600 text-sm font-semibold'>{errors.price}</p>
                    :
                    null}
                </div>
              </div>
              <div className="mt-5 text-right">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`${isSubmitting ? 'opacity-60' : ''} w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                >
                  {isSubmitting ? 'Loading...' : is_Edit ? 'Update' : 'Submit'}
                </button> 
                
              </div>
            </form>
          </div>
        </Modal.Description>
      </Modal.Description>
    </Modal>
  );
}

export default SpecificationFormModal;
