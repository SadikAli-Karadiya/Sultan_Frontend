import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../Component/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from 'react-query'
import { AddCompany, EditCompany } from '../../../utils/apiCalls';


function CompanyFormModal({ showModal, handleShowModal, refetchCompanies, is_Edit, CompanyDetails }) {

  // let id = InstallmentDetails?.id;

  const addCompany = useMutation(AddCompany);
  const updateCompany = useMutation(EditCompany);


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

  const companySchema = Yup.object({
    company_name: Yup.string().required("Please Enter Company Name"),
  });

  const initialValues = {
    company_name: "",
  }

  const { values, errors, resetForm, handleBlur, touched, setValues, setFieldValue, handleChange, handleSubmit } =
    useFormik({
      initialValues:
        JSON.stringify(CompanyDetails) != {} ? { company_name: CompanyDetails?.company_name } :
          initialValues,
      validationSchema: companySchema,
      async onSubmit(data) {
        // {
        //   is_Edit == true ?
        //     Object.assign(data, { id: CompanyDetails.id })
        //     :
        //     null
        // }
        try {
          if (is_Edit == true) {
            updateCompany.mutate(data)
          } else {
            addCompany.mutate(data)
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

  useEffect(() => {
    if (is_Edit && updateCompany.data?.data) {
      toast.success(updateCompany.data?.data?.message);
      handleModalClose()
    }
    else if (addCompany.data?.data) {
      toast.success(addCompany.data?.data?.message);
      handleModalClose()
    }
    refetchCompanies()
  }, [addCompany.isSuccess, updateCompany.isSuccess]);

  if (!showModal) {
    return <></>;
  }
  
  return (
    <Modal open={showModal}
      onClose={handleModalClose}
    >
      <Modal.Description className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-gray-700 shadow-xl rounded-lg ">
        <Modal.Title
          as="h3"
          className="mb-4 text-xl font-medium text-white">
          {is_Edit ? "Edit" : "Add"} Company
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
                  <label htmlFor="company" className="text-white">Company Name *</label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="company_name"
                    id="company_name"
                    value={values.company_name}
                    placeholder='Enter company name'
                    className="rounded-md w-full py-1 md:py-[5px] xl:py-[6px] px-2 outline-none"
                  />
                  {errors.company_name && touched.company_name ? (
                    <p className="form-error text-red-600 text-sm font-semibold">
                      {errors.company_name}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 text-right">
                {
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={addCompany.isLoading || updateCompany.isLoading}
                    className={`${addCompany.isLoading || updateCompany.isLoading ? 'opacity-60' : ''} w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                  >
                    {
                      addCompany.isLoading || updateCompany.isLoading
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

export default CompanyFormModal;
