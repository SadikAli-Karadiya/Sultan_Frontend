import React from 'react'
import { BiSearch } from "react-icons/bi"
import "../../../App.css"
import { useNavigate, useLocation } from "react-router-dom";
import { BsPhone } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import Pagination from 'react-responsive-pagination'
import '../../../Component/Pagination/pagination.css'
import { BiFolderPlus } from "react-icons/bi";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ProductFormModel from "../../../Component/ProductFormModal";
import { useQuery, useMutation } from 'react-query'
import { getAllPhone, searchPhone, getModelByCompany } from '../../../utils/apiCalls'
import LoaderSmall from '../../../Component/LoaderSmall';

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pageNo, setPageNo] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [productFormModal, setProductFormModal] = React.useState(false);
  const [ModelDetails, setModelDetails] = React.useState();
  const [SelectedCompany, setSelectedCompany] = React.useState([]);
  const [is_Edit, setIsEdit] = React.useState(false);
  const phones = useQuery(['phones', location?.state?.id], () => getModelByCompany(location?.state?.id))

  const handleUpdatemodel = (id) => {
    let updateModel = phones?.data?.data?.AllModel?.find((n) => {
      return n?.id == id;
    });
    setIsEdit(true)
    setModelDetails(updateModel);
    setProductFormModal(true)
  };

  const handleAddModel = () => {
    setProductFormModal(true)
    setIsEdit(false);
  }

  const handlePhoneSearch = async (e) => {
    const searchedValue = e.target.value.toLowerCase();
    setSearch(searchedValue)
    if (searchedValue == '') {
      setSelectedCompany(phones?.data?.data?.AllModel)
      return;
    }

    const filteredPhones = phones.data.data.AllModel.filter((item)=>{
      const model_name = item.model_name.toLowerCase();
      let isModelFound = false;

      if (model_name?.indexOf(searchedValue) > -1) {
        isModelFound = true;
      }
      return isModelFound
    })

    setSelectedCompany(filteredPhones)
  }

  React.useEffect(() => {
    setSelectedCompany(phones?.data?.data?.AllModel)
  }, [phones.isSuccess, phones.data])


  return (
    <>
      <div className=" xl:px-10 h-full">
        <div className='w-full justify-between items-center flex py-8 px-5'>
          <h1 className='xs:text-xl xl:text-2xl text-[#0d0d48] font-bold uppercase'>{location?.state?.company_name}</h1>
          <div className='flex items-center justify-end pb-5'>
            <div className="group h-9 w-20 flex justify-center items-center gap-1 cursor-pointer mr-4" id="" onClick={() => navigate(-1)}>
              <IoIosArrowBack className="text-2xl font-bold group-hover:text-blue-700 text-[#0d0d48] mt-[3px]" />
              <span className=" text-xl text-[#0d0d48] font-semibold group-hover:text-blue-700">Back</span>
            </div>
            <Tippy content="Add New Model">
              <div
                onClick={handleAddModel}
                className=' bg-white border text-[#5d88ff] rounded-full xs:h-7 xs:w-7 sm:h-11 sm:w-11 cursor-pointer duration-300 flex justify-center items-center hover:bg-[#0d0d48] hover:text-white'>
                <BiFolderPlus className='xs:text-base sm:text-xl' />
              </div>
            </Tippy>

          </div>
        </div>
        <div className='flex justify-center items-center xs:py-3'>
          <input
            type="search"
            onChange={handlePhoneSearch}
            value={search}
            placeholder='Search Model'
            className='drop-shadow-lg border px-4 py-[6px]  focus:outline-none rounded-l-lg w-2/3'
          />
          <div className='bg-[#5d87ff] px-3 py-[7px] group rounded-r-lg flex justify-center items-center
            shadow-xl cursor-pointer text-white text-2xl '>
            <BiSearch className='search group-hover:scale-125 duration-300' />
          </div>
        </div>

        <div className='py-5'>
          <div className=' flex items-end justify-end w-full xs:px-5'>


          </div>

          <div className="bg-white shadow-md rounded-md  xs:overflow-x-scroll xl:overflow-x-hidden mx-10 px-10 py-5">
            <table
              className="w-full text-sm text-center rounded-xl  text-white "
              id="table-to-xls">
              <thead className="text-sm  text-black border-b ">
                <tr className="">
                  <th scope="col" className="pl-3 py-4">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Model
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Specs
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black bg-white items-center  overflow-x-scroll xl:overflow-x-hidden 2xl:overflow-x-hidden">
                {
                   phones.isLoading
                    ?
                    <tr>
                      <td colSpan="5">
                        <LoaderSmall />
                      </td>
                    </tr>
                    :
                    SelectedCompany?.length > 0 ? (
                      SelectedCompany?.map((item, index) => {
                        return (
                          <tr key={index} className=" border-b">
                            <td className="px-6 py-5 ">
                              {index + 1}
                            </td>
                            <td className="px-6 py-5">
                              {item.model_name}
                            </td>
                            <td className="px-6 py-5">
                              {
                                item.specifications.length > 0
                                  ?
                                  item.specifications.map((specs, i) => {
                                    return (
                                      <span key={i}>
                                        {`${specs.ram}/${specs.storage}`}
                                        {
                                          i < item.specifications.length - 1
                                            ?
                                            ', '
                                            :
                                            null

                                        }
                                      </span>
                                    )
                                  })
                                  :
                                  '--'
                              }
                            </td>
                            <td className="px-6 py-5 font-semibold text-[15px] cursor-pointer">
                              <div className='flex justify-center items-center space-x-3 ' >
                                <Tippy content="Show Specifiaction">
                                  <div onClick={() =>
                                    navigate(`/Product/product-details/${item.id}`)}>
                                    <AiFillEye className='text-[18px] cursor-pointer' />
                                  </div>
                                </Tippy>
                                <Tippy content="Update Model">
                                  <div onClick={() => handleUpdatemodel(item.id)}>
                                    <FiEdit className='text-[17px] cursor-pointer' />
                                  </div>
                                </Tippy>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <div className='flex justify-center items-center w-full rounded-b-lg py-2 text-red-900 space-x-4 bg-red-200'>
                            <BsPhone className='text-2xl' />
                            <h1 className='text-sm font-bold'>Model Not Found</h1>
                          </div>
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <ProductFormModel
        showModal={productFormModal}
        refetchPhones={phones.refetch}
        handleShowModal={setProductFormModal}
        ModelDetails={is_Edit ? ModelDetails : {}}
        is_Edit={is_Edit}
      />
    </>
  )
}

export default ProductList