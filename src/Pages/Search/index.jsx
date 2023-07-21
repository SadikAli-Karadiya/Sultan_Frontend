import React from 'react'
import { BiSearch } from "react-icons/bi"
import "../../App.css"
import { AiFillEye, AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import LoaderSmall from '../../Component/LoaderSmall';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getAllCustomer } from '../../utils/apiCalls';
import { useQuery, useMutation } from 'react-query'
import { IoMdInformationCircle } from "react-icons/io";
import Pagination from 'react-responsive-pagination'
import '../../Component/Pagination/pagination.css'


function Search() {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("");
    const [pageNo, setPageNo] = React.useState(1);

    const allCustomers = useQuery(
        ['customer', pageNo, search],
        () => getAllCustomer(pageNo - 1, search),
        {
            enabled: false
        }
    )

    React.useEffect(() => {
        const listener = async (event) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                if (search == '') return;
                event.preventDefault();
                allCustomers.refetch()
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
                    <h1 className='text-[#0d0d48] text-2xl font-bold'>Search Customer</h1>
                    <div className='flex justify-center items-center mt-10 '>
                        <input
                            type="search"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search Customer (BY : Name , Whatsapp Number)'
                            className='drop-shadow-lg border px-4 py-[6px]  focus:outline-none rounded-l-lg w-2/3'
                        />
                        <button
                            onClick={() => {
                                if (search == '') return;
                                allCustomers.refetch()
                            }}
                            className="bg-[#5d88ff] px-2 py-1 rounded-r-lg shadow-2xl transition duration-200 hover:text-gray-300"
                        >
                            <AiOutlineSearch className="text-3xl font-bold hover:scale-125  text-white transition duration-400" />
                        </button>
                    </div>
                </div>
                {
                    allCustomers.isLoading
                        ?
                        <LoaderSmall />
                        :
                        allCustomers?.data?.data?.AllCustomer?.length > 0
                            ?
                            <div className="bg-white shadow-md  xs:overflow-x-scroll xl:overflow-x-hidden mx-10 px-10 py-5 mt-5">
                                <h1 className='font-bold text-lg pl-5'>Customers List</h1>
                                <table
                                    className="w-full text-sm text-center rounded-xl  text-white  mt-5"
                                    id="table-to-xls"
                                >
                                    <thead className="text-black border-b">
                                        <tr className="text-sm">
                                            <th scope="col" className="pl-3 py-4">
                                                Sr No.
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Full Name
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Mobile
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                alternate_no
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Profile
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        allCustomers?.data?.data?.AllCustomer?.map((item, index) => {
                                            return (
                                                <tbody key={index} className="bg-white text-black items-center  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden">
                                                    <tr className=" border-b">
                                                        <td className="px-6 py-5 ">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-5 font-semibold">
                                                            {item?.full_name}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            {item?.mobile}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            {item?.alternate_no ? item?.alternate_no : "--"}
                                                        </td>
                                                        <td className="px-6 py-5 flex justify-center items-center">
                                                            <div className='flex items-center space-x-2'>
                                                                <div className="flex justify-center items-center">
                                                                    <Tippy content="Customer Profile">
                                                                        <div>
                                                                            <AiFillEye
                                                                                className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                                                                onClick={() =>
                                                                                    navigate(`/InstallmentList/profile-detail/${item?.id}`)} />
                                                                        </div>
                                                                    </Tippy>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    }

                                </table>
                            </div>
                            :
                            allCustomers?.data?.data?.AllCustomer?.length == 0
                                ?
                                <div className='flex mx-20 justify-center items-center py-[7px]  rounded-md space-x-4 bg-red-200'>
                                    <IoMdInformationCircle className='text-xl text-red-600' />
                                    <h1 className='text-sm font-bold text-red-800'>No Customer Found</h1>
                                </div>
                                :
                                null
                }

                {
                    allCustomers?.data?.data?.AllCustomer?.length == 0
                        ?
                        <div className='mx-auto BGYE px-20 py-12 sm:px-24 sm:py-12 md:px-28 md:py-5'>
                            <Pagination
                                total={allCustomers?.data?.data && allCustomers?.data?.data?.totalPages ? allCustomers?.data?.data?.totalPages : 0}
                                current={pageNo}
                                onPageChange={(page) => setPageNo(page)}
                            />
                        </div>
                        :
                        null
                }
            </div>
        </>
    )
}

export default Search