import React, { useState } from 'react'
import { AiFillEye } from "react-icons/ai";
import moment from 'moment';
import "../../App.css"
import { useNavigate } from "react-router-dom";
import LoaderSmall from '../../Component/LoaderSmall';
import Tippy from '@tippyjs/react';
import { IoMdInformationCircle } from 'react-icons/io';
import 'tippy.js/dist/tippy.css';
import { useQuery } from 'react-query'
import { getEMICustomers } from '../../utils/apiCalls';
import ChargeFormModal from '../../Component/ChargeFormModal';
import Pagination from 'react-responsive-pagination'
import '../../Component/Pagination/pagination.css'
import { AiOutlineSearch } from "react-icons/ai";

function PayEMI() {
  const navigate = useNavigate();
  const [chargeFormModal, setChargeFormModal] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [showNotFound, setShowNotFound] = useState(-1)
  const [EMI_Details, setEMIDetails] = useState("");
  const [is_Edit, setIsEdit] = useState(false);
  const EMI = useQuery(
    ['emi', pageNo, search],
    () => 
      getEMICustomers({
        pageNo: pageNo - 1,
        search
      }), 
    {
      enabled: false,
    },

  )

  const handleSearch = () => {
    if(search == '') return;
    EMI.refetch()
  }
  
  const handlePayEMI = (id) => {
    setChargeFormModal(true);
    setIsEdit(true)
    setEMIDetails(id);
  };

  React.useEffect(()=>{
    const listener = async (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        if(search == '') return;
        event.preventDefault();
        EMI.refetch()
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  })

  return (
    <>
      <div className=' sm:px-5 xl:px-10 pt-5 h-full'>
        <div className=' py-5 px-5'>
          <h1 className='text-[#0d0d48] text-2xl font-bold'>Pay EMI</h1>
          <div className='flex justify-center items-center mt-10 '>
            <input
              type="search"
              autoFocus={true}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder='Search Customer  (BY : Name , Whatsapp Number)'
              className='drop-shadow-lg border px-4 py-[6px]  focus:outline-none rounded-l-lg w-2/3'
            />
            <button
              onClick={handleSearch}
              className="bg-[#5d88ff] px-2 py-1 rounded-r-lg shadow-2xl transition duration-200 hover:text-gray-300"
            >
              <AiOutlineSearch className="text-3xl font-bold hover:scale-125  text-white transition duration-400" />
          </button>
          </div>
        </div>
        {
          EMI.isLoading
          ?
            <LoaderSmall />
          :
            EMI?.data?.data?.emiDetails?.length > 0 && EMI?.data?.data?.emiDetails[0].purchases.length > 0 ?
            (
              <div className="bg-white shadow-md  xs:overflow-x-scroll xl:overflow-x-hidden mx-10 pt-5 mt-10">
                <h1 className='font-bold text-lg pl-7'>Customer List</h1>
                <table
                  className="w-full text-sm text-center rounded-xl  text-white mt-5"
                  id="table-to-xls">
                  <thead className="text-black border-b h-12 ">
                    <tr className="">
                      <th scope="col" className="px-6 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Specs
                      </th>
                      <th scope="col" className="px-6 py-4">
                        EMI Date
                      </th>
                      <th scope="col" className="px-6 py-4">
                        EMI Amount
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Pending
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Profile
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {
                    EMI?.data?.data?.emiDetails?.map((item, index) => {
                      return item.purchases.map((purchase, idx) =>{  
                        return (
                          <tbody key={index + idx} className={`bg-red-100 text-black items-center  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden`}>
                            <tr className=" border-b">
                              <td className="px-6 py-5 font-semibold space-x-2">
                                <span>{item.full_name}</span>
                              </td>
                              <td className="px-6 py-5">
                                {item.mobile}
                              </td>
                              <td className="px-6  py-5">
                                <span className="capitalize">{purchase.specification.phone.company.company_name}</span> | <span>{purchase.specification.phone.model_name}</span>
                              </td>
                              <td className="px-6  py-5">
                                <span className="capitalize">{purchase.specification.ram}</span> | <span>{purchase.specification.storage}</span>
                              </td>
                              <td className="px-6 py-5">
                                {
                                  moment(purchase.emis[0].due_date).format("D/MM/YYYY")
                                }
                              </td>
                              <td className="px-6 py-5">
                                {purchase.emis[0].amount}
                              </td>
                              <td className="px-6 py-5">
                                {purchase.pending_amount}
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex justify-center items-center">
                                  <Tippy content="Customer Profile">
                                    <div>
                                      <AiFillEye
                                        className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                        onClick={() =>
                                          navigate(`/InstallmentList/profile-detail/${item.id}`)}
                                      />
                                    </div>
                                  </Tippy>
                                </div>
                              </td>
                              <td className="px-6 py-5 ">
                                <Tippy content="Pay EMI">
                                  <div className="flex justify-center space-x-3">
                                    <button
                                      onClick={() => handlePayEMI(purchase.emis[0].id)}
                                      className='bg-green-800 hover:bg-green-700 px-4 text-white py-[3px] text-sm font-semibold rounded-md'>
                                      Pay
                                    </button>
                                  </div>
                                </Tippy>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })                      
                    })
                  }
                </table>
              </div>
            )
            :
            (
              EMI?.data?.data?.emiDetails?.length == 0 || EMI?.data?.data?.emiDetails[0].purchases?.length == 0 ?
                <div className='flex mx-20 justify-center items-center py-[7px]  rounded-md space-x-4 bg-red-200'>
                  <IoMdInformationCircle className='text-xl text-red-600' />
                  <h1 className='text-sm font-bold text-red-800'>No Customer Found</h1>
                </div>
                :
                null
            )
        }

        {
          EMI?.data?.data?.emiDetails?.length > 0 && EMI?.data?.data?.emiDetails[0].purchases.length > 0 ?
            <div className='mx-auto px-20 py-12 sm:px-24 sm:py-12 md:px-28 md:py-5'>
              <Pagination
                total={EMI?.data?.data?.emiDetails?.totalPages || 0}
                current={pageNo}
                onPageChange={(page) => setPageNo(page)}
              />
            </div>
            :
            null
        }

        <ChargeFormModal
          showModal={chargeFormModal}
          handleShowModal={setChargeFormModal}
          is_Edit={is_Edit}
          EMI_Details={EMI_Details}
        />

      </div>
    </>
  )
}

export default PayEMI