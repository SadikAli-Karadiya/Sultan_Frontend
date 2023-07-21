import React, { useState } from 'react'
import "../../../App.css"
import { AiFillEye, AiOutlineSearch } from "react-icons/ai";
import { IoMdInformationCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { onerecieptDetailsbyNumber, getallReceipt } from '../../../utils/apiCalls';
import { useQuery } from 'react-query'
import moment from 'moment'
import LoaderSmall from '../../../Component/LoaderSmall';

function SearchReciept() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const receipt = useQuery(
    ['receipt', pageNo, search],
    () => onerecieptDetailsbyNumber({
      pageNo: pageNo - 1,
      search
    }),
    {
      enabled: false,
    }
  )

  React.useEffect(() => {
    const listener = async (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        if (search == '') return;
        event.preventDefault();
        receipt.refetch()
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  })

  return (
    <>
      <div className=' sm:px-5 xl:px-10 py-5 h-full'>
        <div className=' py-5 px-5'>
          <h1 className='text-[#0d0d48] text-2xl font-bold'>Search Receipt</h1>
          <div className='flex justify-center items-center mt-10 '>
            <input
              type="search"
              autoFocus={true}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder='Search Receipt (BY : Receipt ID , Name , Whatsapp Number)'
              className='drop-shadow-lg border px-4 py-[6px]  focus:outline-none rounded-l-lg w-2/3'
            />
            <button
              onClick={() => {
                if (search == '') return;
                receipt.refetch()
              }}
              className="bg-[#5d88ff] px-2 py-1 rounded-r-lg shadow-2xl transition duration-200 hover:text-gray-300"
            >
              <AiOutlineSearch className="text-3xl font-bold hover:scale-125  text-white transition duration-400" />
            </button>
          </div>
        </div>
        {
          receipt.isLoading
            ?
            <LoaderSmall />
            :
            receipt?.data?.data?.data?.length > 0 ?
              (
                <div className="bg-white shadow-md  xs:overflow-x-scroll xl:overflow-x-hidden pt-5 mt-10 mx-10">
                  <h1 className='font-bold text-lg pl-10'>Customer List</h1>
                  <table
                    className="w-full text-sm text-center rounded-xl"
                    id="table-to-xls">
                    <thead className="bg-gray-100">
                      <tr className="font-light">
                        <th scope="col" className="pl-3 py-4 font-normal">
                          Date
                        </th>
                        <th scope="col" className="pl-3 py-4 font-normal">
                          Receipt No
                        </th>
                        <th scope="col" className="px-6 py-4 font-normal">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-4 text-start font-normal">
                          Model
                        </th>
                        <th scope="col" className="px-3 py-4 text-start font-normal">
                          Specs
                        </th>
                        <th scope="col" className="px-6 py-4 font-normal">
                          Paid
                        </th>
                        <th scope="col" className="px-6 py-4 font-normal">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-4 font-normal">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {

                      receipt?.data?.data?.data?.map((item, index) => {
                        return (
                          <tbody key={index} className="bg-white text-black items-center overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden h-20">
                            <tr className=" border-b">
                              <td className="px-6 py-5">
                                {moment(item.createdAt).format("D/MM/YYYY")}
                              </td>
                              <td className="px-6 py-5 font-bold">
                                {item.receipt_id}
                              </td>
                              <td className="px-6 py-5">
                                {item.emi.purchase.customer.full_name}
                              </td>
                              <td className="px-3 text-start py-5">
                                <span>{item.emi.purchase.specification.phone.company.company_name}</span> |  <span>{item.emi.purchase.specification.phone.model_name}</span>
                              </td>
                              <td className="px-3 text-start py-5">
                                <span>{item.emi.purchase.specification.ram}</span> |  <span>{item.emi.purchase.specification.storage}</span>
                              </td>
                              <td className="px-6 py-5">
                                <h1 className='bg-green-300 text-green-900 font-bold rounded-md'>
                                  {item.emi.amount}
                                </h1>
                              </td>
                              <td className="px-6 py-5">
                                <h1 className='bg-blue-200 text-blue-900 font-bold rounded-md'>
                                  {item.emi.purchase.net_amount}
                                </h1>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex justify-center items-center">
                                  <Tippy content="Show Reciept">
                                    <div>
                                      <AiFillEye
                                        className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                        onClick={() =>
                                          navigate(`/receipt/receipt/${item.id}`)}
                                      />
                                    </div>
                                  </Tippy>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })
                    }
                  </table>
                </div>
              )
              :
              (

                receipt?.data?.data?.data?.length == 0 ?
                  <div className='flex mx-20 justify-center items-center py-[7px]  rounded-md space-x-4 bg-red-200'>
                    <IoMdInformationCircle className='text-xl text-red-600' />
                    <h1 className='text-sm font-bold text-red-800'>No Receipt Found </h1>
                  </div>
                  :
                  null
              )
        }
      </div>
    </>
  )
}

export default SearchReciept
