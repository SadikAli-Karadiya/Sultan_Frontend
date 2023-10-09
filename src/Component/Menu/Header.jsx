import React, { useEffect, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { AiOutlineSearch, AiFillEye } from "react-icons/ai";
import '../../App.css';
import { PhoneContext } from '../../PhoneContext';
import { getAllCustomer } from '../../utils/apiCalls';
import { useQuery, useMutation } from 'react-query'
import { IoMdInformationCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LoaderSmall from '../../Component/LoaderSmall';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const image = 'user.png';

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { logout, user } = React.useContext(PhoneContext);
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

  const [isMenu, setismenu] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setismenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setismenu(!isMenu);
  };

  return (
    <div className="h-14 z-[101] lg:h-16 sticky top-0 bg-white w-full flex justify-between items-center px-3 lg:px-5 drop-shadow-md">
      <div className='flex flex-col  w-full relative'>
        <div className='flex justify-between items-center border-2 pl-3 py-1 w-1/4 rounded-md'>
          <input
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder='Search Customer (BY : Name , Whatsapp Number)'
            className='w-full focus:outline-none'
          />
          <button
            onClick={() => {
              if (search == '') return;
              allCustomers.refetch()
            }}
            className="mr-2"
          >
            <AiOutlineSearch className="text-xl  font-bold hover:scale-125  text-slate-500 transition duration-400" />
          </button>
        </div>
        <div className='absolute top-16 px-2 w-1/3 '>
          {
            allCustomers.isLoading
              ?
              <LoaderSmall />
              :
              allCustomers?.data?.data?.AllCustomer?.length > 0
                ?
                <table
                  className="w-full bg-blue-100"
                  id="table-to-xls">
                  {
                    allCustomers?.data?.data?.AllCustomer?.map((item, index) => {
                      return (
                        <tbody key={index} className=" text-black items-center justify-between">
                          <tr className=" border-b justify-between">
                            <td className="px-5 py-5 font-semibold">
                              {item?.full_name}
                            </td>
                            <td className="px-5 py-5  font-semibold">
                              {item?.mobile}
                            </td>
                            <td className="py-5 px-5 ">
                              <Tippy content="Customer Profile">
                                <div>
                                  <AiFillEye
                                    className="xs:text-base md:text-sm lg:text-[19px] hover:cursor-pointer "
                                    onClick={() => { setSearch(''); navigate(`/InstallmentList/profile-detail/${item?.id}`);  }} />
                                </div>
                              </Tippy>
                            </td>
                          </tr>
                        </tbody>
                      )
                    })
                  }

                </table>
                :
                allCustomers?.data?.data?.AllCustomer?.length == 0
                  ?
                  <div className='flex w-full justify-center items-center py-2 rounded-md space-x-4 bg-red-200'>
                    <IoMdInformationCircle className='text-xl text-red-600' />
                    <h1 className='text-sm font-bold text-red-800'>No Customer Found</h1>
                  </div>
                  :
                  null
          }
        </div>
      </div>
      <div>
        <div
          onClick={(e) => { e.stopPropagation(); handleToggle() }}
          className="flex justify-center items-center space-x-1 lg:space-x-3 cursor-pointer"
        >
          <div className="right w-10 lg:w-10">
            <img src={image} alt="" className="rounded-full border-2" />
          </div>
          <div className="hidden xl:block">
            <h1 className="text-sm">{user?.username ? user.username : 'Loading...'}</h1>
          </div>
          <div className="text-lg text-slate-600 hidden xl:block">
            <BiDotsVerticalRounded />
          </div>
        </div>
        <div
          ref={dropdownRef}
          className={`${isMenu ? 'active top-[80px] lg:top-[75px] 2xl:top-[78px] ' : ' inactive'
            } dropdown-menu bg-white duration-500 ease-in shadow-lg p-2 absolute right-8 w-52 top-[70px] rounded-md`}
        >
          <ul className="">
            <Link to="/admin/Updateprofile">
              <li
                onClick={handleToggle}
                className="flex items-center justify-between my-2 cursor-pointer hover:bg-gray-200 duration-150 px-2  py-1 rounded-md"
              >
                <div className="flex items-center space-x-3 text-blue-500">
                  <div className="rounded-full h-8 w-8 text-lg bg-blue-200 text-blue-500 flex justify-center items-center">
                    <FaRegUserCircle />
                  </div>
                  <h1 className="text-sm font-roboto">Admin Profile</h1>
                </div>
                <FiChevronRight className="text-blue-500" />
              </li>
            </Link>

            <Link>
              <li
                onClick={() => logout()}
                className="flex items-center justify-between my-2 cursor-pointer hover:bg-gray-200 duration-150 px-2  py-1 rounded-md"
              >
                <div className="flex items-center space-x-3 text-blue-500">
                  <div className="rounded-full h-8 w-8 text-lg bg-blue-200 text-blue-500 flex justify-center items-center">
                    <RiLogoutCircleRLine />
                  </div>
                  <h1 className="text-sm font-roboto">Logout</h1>
                </div>
                <FiChevronRight className="text-blue-500" />
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
