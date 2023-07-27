import React from "react";
import { NavLink, Outlet } from 'react-router-dom'
import { FaUserPlus, FaMobileAlt, FaRupeeSign, FaSearch, FaThList } from "react-icons/fa"
import { FaReceipt } from "react-icons/fa"
import Header from "./Header";
import "../../App.css"
import { RiDashboardFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";

const Sidebar = () => {
  const [isLoading, setIsloading] = React.useState(false)

  return isLoading == true ?
    (

      <div className="flex flex-col justify-center items-center min-h-screen ">
        <div className="bg-[#0d0d48] rounded-full w-7 h-7 animate-bounce">
          .
        </div>
        <h1 className="loading uppercase ml-11 font-bold text-lg mt-1 font-roboto text-[#0d0d48]">Loading...</h1>
      </div>

    )
    :
    (
      <div className="relative bg-[#f5f7ff] min-h-screen flex w-full">
        <div className="h-full bg-white sticky left-0 top-0">
          <div className="sidebar h-screen xs:w-20 w-20 xl:w-56 bg-white drop-shadow-md">
            <div className="sidebar-top flex justify-center pt-3 px-2">
              <h2 className="text-base xl:text-xl text-[#2908C7] font-bold font-moirai">SULTAN MOBILE</h2>
            </div>
            <div className="mt-9 px-5">
              <ul className="text-center">
                <li className="xs:px-5 my-3 xl:my-0">
                  <NavLink
                    activeclassname="active"
                    to="/">
                    <div className="flex justify-center pl-3 items-center xl:justify-start py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <RiDashboardFill className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Dashboard</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/InstallmentList">
                    <div className="flex justify-center pl-3 items-center xl:justify-start py-2 xs:px-3  rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white">
                      <FaWallet className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Installments</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Product">
                    <div className="flex justify-center pl-3 items-center xl:justify-start  py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaMobileAlt className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Phones</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Company">
                    <div className="flex justify-center pl-3 items-center xl:justify-start  py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaThList className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Companies</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/EMI">
                    <div className="flex justify-center pl-3 items-center xl:justify-start  py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaRupeeSign className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Pay EMI</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Receipt/Search">
                    <div className="flex justify-center pl-3 items-center xl:justify-start  py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaReceipt className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Search Receipt</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Customer/add-edit">
                    <div className="flex justify-center pl-3 items-center xl:justify-start  py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaUserPlus className="text-lg" />
                      <h1 className="text-sm hidden xl:block">New Customer</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Search">
                    <div className="flex justify-center pl-3 items-center xl:justify-start py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaSearch className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Search Customer</h1>
                    </div>
                  </NavLink>
                </li>
                <li className="xs:px-5 my-3">
                  <NavLink
                    activeclassname="active"
                    to="/Report">
                    <div className="flex justify-center pl-3 items-center xl:justify-start py-2 xs:px-3 rounded-md space-x-2  hover:bg-[#5d88ff] hover:text-white ">
                      <FaWpforms className="text-lg" />
                      <h1 className="text-sm hidden xl:block">Report</h1>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-full w-full" style={{ minHeight: "calc(100vh - 70px)" }}>
          <Header />
          <div className='h-full' >
            <Outlet />
          </div>
        </div>
      </div>
    );
};

export default Sidebar;