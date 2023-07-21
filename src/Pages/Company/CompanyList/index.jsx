import { React, useState, useEffect } from 'react'
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiFolderPlus } from "react-icons/bi";
import { IoMdInformationCircle } from "react-icons/io";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CompanyFormModal from '../CompanyAddEdit/CompanyAddEditModel';
import { DeleteCompany, getAllCompanies } from '../../../utils/apiCalls';
import { useQuery } from 'react-query'
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


function CompanyList() {

    const navigate = useNavigate();
    const [is_Edit, setIsEdit] = useState(false);
    const [CompanyDetails, setCompanyDetails] = useState();
    const [CompanyModal, setCompanyModal] = useState(false);
    const [isHoverEdit, setIsHoverEdit] = useState(false);
    const [isHoverDelete, setIsHoverDelete] = useState(false);
    const companies = useQuery('companies', getAllCompanies)

    const headingColor = [
        "#0072b8",
        "#16a34a",
        "#000000",
        "#eb0029",
        "#FF6600",
        "#ffc916",
    ];

    const headingBGColor = [
        "#0072b82d",
        "#16a34a2f",
        "#0000002f",
        "#eb002734",
        "#ff660030",
        "#ffc91634",
    ];

    const handleMouseEnterEdit = () => {
        setIsHoverEdit(true);
    };

    const handleMouseLeaveEdit = () => {
        setIsHoverEdit(false);
    };

    const handleMouseEnterDelete = () => {
        setIsHoverDelete(true);
    };

    const handleMouseLeaveDelete = () => {
        setIsHoverDelete(false);
    };

    function handleEditCompany(id) {
        let Companydetails = companies?.data?.data?.all_companies?.find((n) => {
            return n.id == id;
        });
        setIsEdit(true)
        setCompanyDetails(Companydetails);
        setCompanyModal(true);
    };

    const handleAddInstallment = () => {
        setCompanyModal(true);
        setIsEdit(false)
    }

    const handleDeleteCompany = async (id) => {
        Swal.fire({
            title: "Are you sure to delete company?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let response = await DeleteCompany(id);
                if (response.data?.success == true) {
                    toast.success(response.data?.message);
                }
            }
        });
    };


    return (
        <>
            <div className='sm:px-5 xl:px-10 pt-5 h-full'>
                <div className='flex justify-between items-center mb-10'>
                    <h1 className='text-2xl font-bold'>All Companies</h1>
                    <div className='flex items-center justify-end pb-5'>
                        <Tippy content="Add New Company">
                            <div
                                onClick={handleAddInstallment}
                                className=' bg-white border  text-[#0d0d48] rounded-full xs:h-7 xs:w-7 sm:h-11 sm:w-11 cursor-pointer duration-300 flex justify-center items-center hover:bg-[#0d0d48] hover:text-white'>
                                <BiFolderPlus className='xs:text-base sm:text-xl' />
                            </div>
                        </Tippy>
                    </div>

                </div>
                <div className='flex flex-wrap justify-center items-center gap-10 px-12 '>
                    {companies?.data?.data?.all_companies?.length > 0 ? (
                        companies?.data?.data?.all_companies?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() =>
                                        navigate(`/Company/CompanyDetails/${item.id}`,
                                            {
                                                state: {
                                                    company_name : item.company_name,
                                                    id : item.id
                                                }
                                            })
                                    }
                                    className='bg-white drop-shadow-md cursor-pointer px-5 py-5 rounded-lg w-60 h-30 group' >
                                    <div className='flex items-center justify-between mb-5'>
                                        <div className='py-2 rounded-md '>
                                            <h1
                                                style={{
                                                    color:
                                                        headingColor[
                                                        index % headingColor.length
                                                        ],
                                                }}
                                                className='uppercase font-semibold font-roboto text-2xl'>{item.company_name}</h1>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div
                                            style={{
                                                background:
                                                    headingBGColor[
                                                    index % headingBGColor.length
                                                    ],
                                            }}
                                            className='w-full mr-2 px-3 py-0.5 rounded-md flex items-center space-x-2 text-sm'>
                                            <h1
                                                style={{
                                                    color:
                                                        headingColor[
                                                        index % headingColor.length
                                                        ],
                                                }}
                                                className='font-semibold text-[#ffc91634]'>Total Models : </h1>
                                            <span
                                                style={{
                                                    color:
                                                        headingColor[
                                                        index % headingColor.length
                                                        ],
                                                }}
                                                className='font-semibold text-white'>{item.phones.length}</span>

                                        </div>
                                        <div className=''>
                                            <div className='flex items-center space-x-1 h-full'>
                                                <Tippy content="Edit Company">
                                                    <div
                                                        style={{
                                                            color: "#fff",

                                                            backgroundColor:
                                                                headingColor[
                                                                index % headingColor.length
                                                                ]
                                                        }}
                                                        onMouseEnter={handleMouseEnterEdit}
                                                        onMouseLeave={handleMouseLeaveEdit}
                                                        onClick={() => handleEditCompany(item.id)}
                                                        className='rounded-md px-[3px] py-[3px] cursor-pointer '>
                                                        <MdModeEdit className='' />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete Company">
                                                    <div
                                                        style={{
                                                            color: "#fff",

                                                            backgroundColor:
                                                                headingColor[
                                                                index % headingColor.length
                                                                ]
                                                        }}
                                                        onMouseEnter={handleMouseEnterDelete}
                                                        onMouseLeave={handleMouseLeaveDelete}
                                                        onClick={() => handleDeleteCompany(item.id)}
                                                        className='rounded-md px-[3px] py-[3px] cursor-pointer '>
                                                        <MdDelete className='' />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='flex justify-center items-center w-full'>
                            <div className="bg-red-200 font-bold flex justify-center items-center p-2 rounded mx-3 space-x-2">
                                <IoMdInformationCircle className="text-xl text-red-600" />
                                <h1 className="text-red-800 text-sm"> No Company Found </h1>
                            </div>
                        </div>
                    )}
                    {/* <div className='bg-white drop-shadow-md px-5 py-5 rounded-lg w-60 h-40 group'>
                        <div className='bg-[#16a34a] px-3 py-1 rounded-md flex items-center space-x-2'>
                            <h1 className='font-semibold text-white'>Total Model : </h1>
                            <span className='font-semibold text-white'>15</span>
                        </div>
                        <div className='flex items-center justify-between mt-14'>
                            <div className=' py-2 rounded-md '>
                                <h1 className='uppercase font-semibold text-green-600 font-roboto text-2xl'>oppo</h1>
                            </div>
                            <div className='hidden group-hover:block'>
                                <div className='flex items-center space-x-1 mt-2'>
                                    <div className='hover:bg-green-600 hover:text-white text-green-600 border-2 border-green-600 bg-white rounded-md px-1 py-1 cursor-pointer '>
                                        <MdModeEdit className='' />
                                    </div>
                                    <div className='hover:bg-green-600 hover:text-white text-green-600 border-2 border-green-600 bg-white rounded-md px-1 py-1 cursor-pointer '>
                                        <MdDelete className='' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white drop-shadow-md px-5 py-5 rounded-lg w-60 h-40 group'>
                        <div className='bg-black px-3 py-1 rounded-md flex items-center space-x-2'>
                            <h1 className='font-semibold text-white'>Total Model : </h1>
                            <span className='font-semibold text-white'>15</span>
                        </div>
                        <div className='flex items-center justify-between mt-14 '>
                            <div className='py-2 rounded-md '>
                                <h1 className='uppercase font-semibold text-black font-roboto text-2xl'>Samsung</h1>
                            </div>
                            <div className='hidden group-hover:block'>
                                <div className='flex items-center space-x-1 mt-2'>
                                    <div className='hover:bg-black hover:text-white bg-white text-black border-2 border-black rounded-md px-1 py-1 cursor-pointer '>
                                        <MdModeEdit className='' />
                                    </div>
                                    <div className='hover:bg-black hover:text-white bg-white text-black border-2 border-black rounded-md px-1 py-1 cursor-pointer '>
                                        <MdDelete className='' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white drop-shadow-md px-5 py-5 rounded-lg w-60 h-40 group'>
                        <div className='bg-[#eb0029] px-3 py-1 rounded-md flex items-center space-x-2'>
                            <h1 className='font-semibold text-white'>Total Model : </h1>
                            <span className='font-semibold text-white'>15</span>
                        </div>
                        <div className='flex items-center justify-between mt-14 '>
                            <div className='py-2 rounded-md '>
                                <h1 className='uppercase font-semibold text-[#eb0029] font-roboto text-2xl'>onepluse</h1>
                            </div>
                            <div className='hidden group-hover:block'>
                                <div className='flex items-center space-x-1 '>
                                    <div className='hover:bg-[#eb0029] hover:text-white bg-white border-2 border-[#eb0029] text-[#eb0029] rounded-md px-1 py-1 cursor-pointer '>
                                        <MdModeEdit className='' />
                                    </div>
                                    <div className='hover:bg-[#eb0029] hover:text-white bg-white border-2 border-[#eb0029] text-[#eb0029] rounded-md px-1 py-1 cursor-pointer '>
                                        <MdDelete className='' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white drop-shadow-md px-5 py-5 rounded-lg w-60 h-40 group'>
                        <div className='bg-[#FF6600] px-3 py-1 rounded-md flex items-center space-x-2'>
                            <h1 className='font-semibold text-white'>Total Model : </h1>
                            <span className='font-semibold text-white'>15</span>
                        </div>
                        <div className='flex items-center justify-between mt-12 '>
                            <div className='py-2 rounded-md '>
                                <h1 className='uppercase font-semibold text-orange-600 font-roboto text-2xl'>MI</h1>
                            </div>
                            <div className='hidden group-hover:block'>
                                <div className='flex items-center space-x-1 mt-2'>
                                    <div className='hover:bg-orange-600 hover:text-white text-orange-600 border-2 border-orange-600 bg-white rounded-md px-1 py-1 cursor-pointer '>
                                        <MdModeEdit className='' />
                                    </div>
                                    <div className='hover:bg-orange-600 hover:text-white text-orange-600 border-2 border-orange-600 bg-white rounded-md px-1 py-1 cursor-pointer '>
                                        <MdDelete className='' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white drop-shadow-md px-5 py-5 rounded-lg w-60 h-40 group'>
                        <div className='bg-[#ffc916] px-3 py-1 rounded-md flex items-center space-x-2'>
                            <h1 className='font-semibold text-black'>Total Model : </h1>
                            <span className='font-semibold text-black'>15</span>
                        </div>
                        <div className='flex items-center justify-between mt-12 '>
                            <div className='py-2 rounded-md '>
                                <h1 className='uppercase font-semibold text-[#ffc916] font-roboto text-2xl'>onepluse</h1>
                            </div>
                            <div className='hidden group-hover:block'>
                                <div className='flex items-center space-x-1 mt-2'>
                                    <div className='hover:bg-[#ffc916] hover:text-black bg-white text-[#ffc916] border-2 border-[#ffcd16] rounded-md px-1 py-1 cursor-pointer '>
                                        <MdModeEdit className='' />
                                    </div>
                                    <div className='hover:bg-[#ffc916] hover:text-black bg-white text-[#ffc916] border-2 border-[#ffc916] rounded-md px-1 py-1 cursor-pointer '>
                                        <MdDelete className='' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div >
            <CompanyFormModal
                showModal={CompanyModal}
                refetchCompanies={companies.refetch}
                handleShowModal={setCompanyModal}
                CompanyDetails={is_Edit ? CompanyDetails : {}}
                is_Edit={is_Edit}
            />
        </>
    )
}

export default CompanyList
