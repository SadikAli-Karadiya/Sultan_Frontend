import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getModelByCompany } from '../../../utils/apiCalls'
import { useQuery } from 'react-query'
import { IoMdInformationCircle } from "react-icons/io";

function CompanyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const AllModels = useQuery(['phones', location?.state?.id], () => getModelByCompany(location?.state?.id))

  return (
    <>
      <div className=" xl:px-10 h-full">
        <div className='w-full justify-between items-center flex py-3'>
          <div className='sm:py-5 flex justify-between items-center'>
            <h1 className='text-[#0d0d48] xs:text-xl xl:text-2xl font-bold'>
              {location?.state?.company_name}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer" id="" onClick={() => navigate(-1)}>
              <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-[#0d0d48] mt-[3px]" />
              <span className=" text-xl text-[#0d0d48] font-semibold group-hover:text-blue-700">Back</span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 justify-center items-center gap-10 px-10 w-full'>
          {AllModels?.data?.data?.AllModel?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() =>
                  navigate(`/Product/product-details/${item.id}`,
                    {
                      state: {
                        company_name: item.company_name,
                        id: item.id
                      }
                    })
                }
                className='shadow-md rounded-md py-5 bg-white px-5 flex flex-col items-center w-full'>
                <div className='flex justify-between items-center w-full'>
                  <h1 className='text-xl  font-semibold'>{item?.model_name}</h1>
                </div>
                <div className='w-full flex-col'>
                  <div
                    className='pt-5 flex justify-between w-full border-b border-[#5d88ff59] pb-1'>
                    <span className='text-sm font-semibold'> 2 / 32 </span>
                    <span className='text-sm'>13000</span>
                  </div>
                </div>
              </div>
            );
          })
          }
        </div>
        {AllModels?.data?.data?.AllModel?.length > 0 ? (
          null
        ) : (
          <div className='flex justify-center items-center w-full pt-5'>
            <div className="bg-red-200 font-bold flex justify-center items-center p-2 rounded mx-3 space-x-2">
              <IoMdInformationCircle className="text-xl text-red-600" />
              <h1 className="text-red-800 text-sm"> No Model Found </h1>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CompanyDetails