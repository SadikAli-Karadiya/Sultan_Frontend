import React, { useEffect, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { NavLink, Link } from 'react-router-dom';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { BiUserPlus } from 'react-icons/bi';
import { VscKey } from 'react-icons/vsc';
import { FiChevronRight } from 'react-icons/fi';
import '../../App.css';
import { PhoneContext } from '../../PhoneContext';

const image = 'user.png';

function Header() {
  const dropdownRef = useRef(null);
  const { logout, user } = React.useContext(PhoneContext);

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
    <div className="h-14 z-[101] lg:h-16 sticky top-0 bg-white w-full flex justify-end items-center px-3 lg:px-5 drop-shadow-md">
      <div>
        <div
          onClick={(e)=>{e.stopPropagation(); handleToggle()}}
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
          className={`${
            isMenu ? 'active top-[80px] lg:top-[75px] 2xl:top-[78px] ' : ' inactive'
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
