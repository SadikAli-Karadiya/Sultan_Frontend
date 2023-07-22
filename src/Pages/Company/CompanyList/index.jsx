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
import { AxiosError } from 'axios';


function CompanyList() {

    const navigate = useNavigate();
    const [is_Edit, setIsEdit] = useState(false);
    const [CompanyDetails, setCompanyDetails] = useState();
    const [CompanyModal, setCompanyModal] = useState(false);
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
            showLoaderOnConfirm: true,
            allowOutsideClick: false
        
        }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    const response = await DeleteCompany(id);
                    if (response.data?.success == true) {
                        companies.refetch();
                        toast.success(response.data?.message);
                    }
                }
                catch(err){
                    if(err instanceof AxiosError){
                        toast.error(err.response.data.message)
                    }
                    else{
                        toast.error('Failed to delete company')
                    }
                }
                finally {
                    Swal.hideLoading(); 
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
                                                className='uppercase font-bold font-roboto text-2xl'>{item.company_name}</h1>
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
                                            className='w-full mr-2 px-3 py-1 rounded-md flex items-center space-x-2 text-sm'>
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
                                                        onClick={(e) => 
                                                            {
                                                                e.stopPropagation();
                                                                handleEditCompany(item.id)
                                                            }
                                                        }
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteCompany(item.id)
                                                        }}
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
