import React, { useRef, useState, useEffect } from 'react'
import { BiSearch } from "react-icons/bi"
import { AiFillEye } from "react-icons/ai";
import { BiFolderPlus } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import InstallmentFormModal from '../../Component/InstallFormModal';
import { getAllInstallment, getCustomersByInstallment, getAllPurchase, DeleteInstallment } from '../../utils/apiCalls';
import { useQuery, useMutation } from 'react-query'
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from 'react-responsive-pagination'
import '../../Component/Pagination/pagination.css'
import LoaderSmall from '../../Component/LoaderSmall';

function InstallmentList() {
    const navigate = useNavigate();
    const [isHoverEdit, setIsHoverEdit] = useState(false);
    const [isHoverDelete, setIsHoverDelete] = useState(false);
    const [selectedEmiCustomer, setSelectedEmiCustomer] = useState([]);
    const [search, setSearch] = useState("");
    const [installmentFormModal, setInstallmentFormModal] = useState(false);
    const [is_Edit, setIsEdit] = useState(false);
    const [InstallmentDetails, setInstallmentDetails] = useState();
    const [Selectemi, setSelectemi] = useState("")
    const installment = useQuery('installment', getAllInstallment)
    const customersByInstallment = useMutation(getCustomersByInstallment)
    const [pageNo, setPageNo] = useState(1);
    const purchase = useQuery(['purchase', pageNo], () => getAllPurchase({ pageNo: pageNo - 1, }))

    const bgColors = [
        "#fa8a6b30",
        "#5d88ff24",
        "#c1d1d8",
        "#ffedd5",
        "#f4d5ff",
        "#fbc8bd",
        "#ccfbf1",
        "#d8bbbc",
        "#fef9c3",
    ];
    const headingBgColor = [
        "#f3797e",
        "#3b82f6",
        "#2f667e",
        "#9a4947",
        "#e08aff",
        "#f24822",
        "#14b8a6",
        "#7e1b1f",
        "#ca8a04",
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

    const handlePendingPaidUpClick = (e) => {
        const filteredCustomer = purchase?.data?.data?.AllPurchase?.filter((item) => {

            const emiToBePaid = item.pending_amount;

            const paidAmount = item.net_amount - item.pending_amount;

            //   // 0 == all
            //   // 1 == pending
            //   // 2 == paidup
            if (e.target.value == 1 && emiToBePaid) {
                return item
            }
            else if (e.target.value == 2 && emiToBePaid <= paidAmount) {
                return item
            }
            else if (e.target.value == 0) {
                return item
            }
        });
        // setSelectedEMI(filteredCustomer)

    };

    const handleEditEMI = (id) => {
        let Installment = installment?.data?.data?.AllInstallment?.find((n) => {
            return n.id == id;
        });
        setIsEdit(true)
        setInstallmentDetails(Installment);
        setInstallmentFormModal(true);
    };

    const handleSelectEMI = (id) => {
        customersByInstallment.mutate(id)
        setSelectemi(id)
    };

    const handleDeleteInstallment = async (id) => {
        Swal.fire({
            title: "Are you sure to delete installment?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const deleteClassResponse = await DeleteInstallment(id);
                installment.refetch()
                if (deleteClassResponse.data.success) {
                    toast.success(deleteClassResponse.data.message);
                } else if (deleteClassResponse.data.success == false) {
                    toast.error(deleteClassResponse.data.message);
                }
            }
        });
    };

    const handleSearchCustomer = (e) => {
        setSearch(e.target.value)
        const searchedValue = e.target.value.toLowerCase();

        if (searchedValue == '') {
            setSelectedEmiCustomer(customersByInstallment.data?.data.allCustomers);
            return;
        }

        //considering search value as phone model
        let model = customersByInstallment.data?.data.allCustomers.filter((item) => {
            const model_name = item.phone.model_name?.toLowerCase();

            if (model_name.indexOf(searchedValue) > -1) {
                return true;
            }
            return false
        })
        if (model.length > 0) {
            setSelectedEmiCustomer(model)
            return
        }

        setSelectedEmiCustomer(() =>
            customersByInstallment.data?.data.allCustomers?.filter((data) => {
                const full_name = data?.customer?.full_name?.toLowerCase();
                let isNameFound = false;

                if (full_name.indexOf(searchedValue) > -1) {
                    isNameFound = true;
                }

                return (
                    isNameFound || data?.customer?.mobile == searchedValue
                );
            })
        );
    };

    const handleAddInstallment = () => {
        setInstallmentFormModal(true);
        setIsEdit(false)
    }

    const handlePayEMI = (id) => {
        setChargeFormModal(true);
        setIsEdit(true)
        setEMIDetails(id);
    };

    React.useEffect(() => {
        setSelectedEmiCustomer(customersByInstallment.data?.data.allCustomers)
    }, [customersByInstallment.isSuccess, customersByInstallment.data])

    React.useEffect(() => {
        if (installment?.data?.data.AllInstallment.length > 0) {
            const installmentId = installment?.data?.data.AllInstallment[0].id
            customersByInstallment.mutate(installmentId)
            setSelectemi(installmentId)
        }

    }, [installment?.data?.data])

    return (
        <>
            <div className='xl:px-5 h-full'>
                <div className='py-5 px-5'>
                    <div className='flex items-center justify-end pb-5'>
                        <Tippy content="Add New EMI">
                            <div
                                onClick={handleAddInstallment}
                                className=' bg-white border  text-[#0d0d48] rounded-full xs:h-7 xs:w-7 sm:h-11 sm:w-11 cursor-pointer duration-300 flex justify-center items-center hover:bg-[#0d0d48] hover:text-white'>
                                <BiFolderPlus className='xs:text-base sm:text-xl' />
                            </div>
                        </Tippy>
                    </div>
                    <div className='bg-white flex gap-10 px-5 flex-wrap justify-center items-center py-5 rounded-md'>
                        {installment?.data?.data.AllInstallment?.length > 0 ? (
                            installment?.data?.data.AllInstallment?.map((item, index) => {
                                return (
                                    <div
                                        style={{
                                            backgroundColor: bgColors[index % bgColors.length],
                                        }}
                                        className={`${Selectemi != item.id ? "opacity-70" : ""} px-5 py-3 my-3 group hover:cursor-pointer rounded-md drop-shadow-lg space-y-3`}
                                        key={index}
                                        onClick={() => handleSelectEMI(item.id)}>
                                        <div className='flex justify-between items-center '>
                                            <div>
                                                <h1 className='text-slate-600 font-semibold'><span className='text-sm'>{item.charges} Charge</span></h1>
                                            </div>
                                            <div className='flex justify-end items-center space-x-2'>
                                                <Tippy content="Edit EMI">
                                                    <div
                                                        style={{
                                                            color: isHoverEdit
                                                                ? "#fff"
                                                                : headingBgColor[
                                                                index % headingBgColor.length
                                                                ],
                                                            backgroundColor: isHoverEdit
                                                                ? headingBgColor[
                                                                index % headingBgColor.length
                                                                ]
                                                                : "#fff",
                                                        }}
                                                        onMouseEnter={handleMouseEnterEdit}
                                                        onMouseLeave={handleMouseLeaveEdit}
                                                        onClick={() => handleEditEMI(item.id)}
                                                        className={`${Selectemi == item.id ? "block" : "hidden"} edit_delete_btns rounded-md px-[3px] py-[3px] group-hover:block `}
                                                    >
                                                        <MdModeEdit className='' />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Delete EMI">
                                                    <div
                                                        style={{
                                                            color: isHoverDelete
                                                                ? "#fff"
                                                                : headingBgColor[
                                                                index % headingBgColor.length
                                                                ],
                                                            backgroundColor: isHoverDelete
                                                                ? headingBgColor[
                                                                index % headingBgColor.length
                                                                ]
                                                                : "#fff",
                                                        }}
                                                        onMouseEnter={handleMouseEnterDelete}
                                                        onMouseLeave={handleMouseLeaveDelete}
                                                        onClick={() => handleDeleteInstallment(item.id)}
                                                        className={`${Selectemi == item.id ? "block" : "hidden"} edit_delete_btns rounded-md px-[3px] py-[3px] group-hover:block `}
                                                    >
                                                        <MdDelete className=' ' />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className={`${item._id} flex items-center justify-start space-x-7 py-2`}>
                                            <div className=''>
                                                <h1
                                                    style={{
                                                        color:
                                                            headingBgColor[
                                                            index % headingBgColor.length
                                                            ],
                                                    }}
                                                    className='text-4xl font-bold'>{item.month} <span className='uppercase text-2xl'>month</span></h1>
                                            </div>
                                        </div>
                                        <div className='rounded-md px-7 py-1'
                                            style={{
                                                backgroundColor:
                                                    headingBgColor[index % headingBgColor.length],
                                            }}
                                        >
                                            <p className='text-white text-center text-sm font-roboto'>Total Customer : {item?.purchases?.length}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='flex justify-center items-center w-full'>
                                <div className="bg-red-200 font-bold flex justify-center items-center p-2 rounded mx-3 space-x-2">
                                    <IoMdInformationCircle className="text-xl text-red-600" />
                                    <h1 className="text-red-800 text-sm">Installment not found </h1>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-md  xs:overflow-x-scroll xl:overflow-x-hidden px-7 mx-5 my-5 py-5">
                    <h1 className='font-bold text-lg'>Customer List</h1>
                    <div className='flex xs:flex-col sm:flex-row  sm:justify-between items-center py-5'>
                        <div className='flex justify-start items-center lg:w-1/3 '>
                            <input
                                type="search"
                                placeholder='Search Customer'
                                value={search}
                                onChange={handleSearchCustomer}
                                className='border px-4 py-[6px] focus:outline-none text-sm rounded-lg placeholder-black/70 w-2/3 '
                            />
                        </div>
                        <div
                            id="year-btn"
                            className=" flex items-center border bg-white px-1 shadow-md xl:py-1 rounded-lg  space-x-1 outline-none xs:mt-8 sm:mt-0">
                            <select
                                onChange={handlePendingPaidUpClick}
                                name=""
                                id=""
                                className="cursor-pointer text-darkblue-500 text-base">
                                <option value={0}>All</option>
                                <option value={1}>Pending</option>
                                <option value={2}>Paidup</option>
                            </select>
                        </div>
                    </div>
                    <table
                        className="w-full text-sm text-center rounded-xl text-white "
                        id="table-to-xls" >
                        <thead className="text-black border-b py-5 h-12">
                            <tr className="">
                                <th scope="col" className="pl-3 py-2">
                                    Sr no
                                </th>
                                <th scope="col" className="pl-3 py-2">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Mobile
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Model
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Specs
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Pending
                                </th>
                                <th scope="col" className="px-6 py-2">
                                    Profile
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-black items-center  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden">
                        {
                            customersByInstallment.isLoading
                            ?
                                <tr>
                                    <td colSpan="8">
                                        <LoaderSmall />
                                    </td>
                                </tr>
                            :
                                selectedEmiCustomer?.length > 0 
                                ? (
                                selectedEmiCustomer?.map((item, index) => {
                                    return (
                                            <tr key={index} className="border-b">
                                                <th className="py-5 px-6 font-normal">
                                                    {index + 1}
                                                </th>
                                                <td className="px-6 py-5 font-semibold  text-slate-700 ">
                                                    {item.customer.full_name}
                                                </td>
                                                <td className="px-6 py-5 capitalize">
                                                    {item?.customer?.mobile}
                                                </td>
                                                <td className="px-6 py-5 capitalize">
                                                    {item?.specification.phone?.company?.company_name} | {item?.specification.phone?.model_name}
                                                </td>
                                                <td className="px-6 py-5 capitalize">
                                                    {item?.specification.ram} | {item?.specification.storage}
                                                </td>
                                                <td className="px-6 py-5 capitalize">
                                                    {item?.net_amount}
                                                </td>
                                                <td className="px-6 py-5 capitalize">
                                                    {item?.pending_amount}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center items-center">
                                                        <Tippy content="Customer Profile">
                                                            <div>
                                                                <AiFillEye
                                                                    className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                                                    onClick={() =>
                                                                        navigate(`/InstallmentList/profile-detail/${item.customer.id}`)
                                                                    }
                                                                />
                                                            </div>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            </tr>
                                    )
                                })
                                ) 
                                : (
                                    <tr>
                                        <td colSpan="8">
                                            <div className='flex justify-center items-center w-full rounded-b-lg py-[5px] text-red-900 space-x-4 bg-red-200'>
                                                <FaUsers className='text-2xl' />
                                                <h1 className='text-sm font-bold'>No customers </h1>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {
                    search == '' && selectedEmiCustomer?.length > 0 ?
                        <div className='mx-auto px-20 py-12 sm:px-24 sm:py-12 md:px-28 md:py-5'>
                            <Pagination
                                total={purchase && purchase?.data?.data?.pageCount ? purchase?.data?.data?.pageCount : 0}
                                current={pageNo}
                                onPageChange={(page) => setPageNo(page)}
                            />
                        </div>
                        :
                        null
                }

                <InstallmentFormModal
                    showModal={installmentFormModal}
                    refetchInstallments ={installment.refetch}
                    handleShowModal={setInstallmentFormModal}
                    InstallmentDetails={is_Edit ? InstallmentDetails : {}}
                    is_Edit={is_Edit}
                />
            </div>

        </>
    )
}

export default InstallmentList

