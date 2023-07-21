import { React, useState } from 'react'
import { AiFillEye } from "react-icons/ai";
import { IoMdInformationCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useQuery } from 'react-query'
import { getallTransection } from '../../utils/apiCalls';

function Report() {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(() => {
    new Date()?.toISOString().slice(0, 10).split("-").reverse().join("-");
  });
  const [transaction, setTransaction] = useState("?");
  const [nextDate, setNextDate] = useState("");
  const reportData = useQuery(['transection'], () => getallTransection(pageNo - 1))

  const noOfTransaction = [
    {
      id: 1,
      months: "januaray",
      transection: 58,
      total: 2580
    },
    {
      id: 2,
      months: "February",
      transection: 58,
      total: 2580
    },
    {
      id: 3,
      months: "march",
      transection: 58,
      total: 2580
    },
    {
      id: 4,
      months: "april",
      transection: 58,
      total: 2580
    },
    {
      id: 5,
      months: "may",
      transection: 58,
      total: 2580
    },
    {
      id: 6,
      months: "jun",
      transection: 58,
      total: 2580
    },
    {
      id: 7,
      months: "july",
      transection: 58,
      total: 2580
    },
    {
      id: 8,
      months: "august",
      transection: 58,
      total: 2580
    },
    {
      id: 9,
      months: "september",
      transection: 58,
      total: 2580
    },
    {
      id: 10,
      months: "october",
      transection: 58,
      total: 2580
    },
    {
      id: 11,
      months: "november",
      transection: 58,
      total: 2580
    },
    {
      id: 12,
      months: "december",
      transection: 58,
      total: 2580
    },
  ]

  function handleDataFilter(filterDate) {
    const preDate = new Date(`${filterDate},23:59:00`);
    const previous = preDate.setDate(preDate.getDate() - 1);

    const postDate = new Date(`${filterDate},0:00:00`);
    const post = postDate.setDate(postDate.getDate() + 1);
    return [previous, post];
  }

  function handle_data(e) {

    const [previous, post] = handleDataFilter(e.target.value);
    setDate(e.target.value);

    if (nextDate) {
      handleNextDate(nextDate);
    } else {
      const newData = reportData?.data?.data?.AllTransaction.filter(
        (recipet) =>
          new Date(recipet.date).getTime() > previous &&
          new Date(recipet.date).getTime() < post
      );
      setData(() => newData);
    }
    setTransaction("?");
  }

  function handleNextDate(e) {
    const [_, post] = handleDataFilter(e);
    const dateData = handleDataFilter(date);

    setNextDate(() => e);

    const newData = reportData.data.data.filter(
      (recipet) =>
        new Date(recipet.date).getTime() > dateData[0] &&
        new Date(recipet.date).getTime() < post
    );
    setData(() => newData.reverse());
    setTransaction("?");
  }

  function calcaulateTotal() {
    let total = 0;
    data?.map((d) => {
      total += d.transaction[0].amount;
    });

    setTransaction(total);
    return total;
  }

  return (
    <>
      <div className='px-5 py-5'>
        <h1 className="mx-4 my-2 font-semibold"> EMI Calendar</h1>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-wrap justify-center gap-5 pt-5 w-4/5 items-center">
            {noOfTransaction?.map((data, i) => {
              return (
                <div key={i} className="rounded-xl shadow-2xl bg-white w-32 ">
                  <h1 className=" text-sm py-1 font-semibold bg-green-300 rounded-t-xl text-center">
                    {data.months}
                  </h1>
                  <span className="text-xs m-2 ">Transactions : {data.transection}</span>
                  <h2 className=" text-xs m-2">
                    Total :
                    <span className="ml-1 font-bold">
                      {data.total}
                    </span>
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
        <div className='px-5 py-5 xl:px-10 bg-white drop-shadow-md mt-10 '>
          <h1 className='font-bold px-5 pt-4 text-lg'>Transactions List</h1>
          <div className='px-6 py-7 flex xs:flex-col xs:space-y-10 lg:flex-row lg:justify-between lg:items-center'>
            <form action="" className='flex xs:flex-col xs:space-x-0 xs:space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-3 '>
              <div className='flex flex-col'>
                <label htmlFor="From" className='text-sm text-slate-400'>From</label>
                <input
                  type="date"
                  name=""
                  id=""
                  value={date}
                  onChange={(e) => handle_data(e)}
                  className='border py-2 rounded-md px-2 hover:cursor-pointer outline-none' />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="From" className='text-sm text-slate-400'>To</label>
                <input type="date"
                  name=""
                  id=""
                  value={nextDate}
                  onChange={(e) => handleNextDate(e.target.value)}
                  disabled={date ? false : true}
                  className='border py-2 rounded-md px-2 hover:cursor-pointer outline-none' />
              </div>
              <div className='flex sm:pt-5 '>
                <button

                  onClick={(e) => {
                    setData(reportData?.data?.data?.AllTransaction);
                    setDate("");
                    setNextDate("");
                  }} className=' py-[10px] text-sm rounded-md px-4 border shadow-lg hover:bg-blue-100 font-semibold'>
                  Clear Filter
                </button>
              </div>
            </form>
            <div className='flex items-center space-x-3'>
              <div className='bg-green-200 rounded-md px-3 shadow-lg py-1 flex flex-col justify-center  items-center'>
                <h1 className='font-semibold text-sm'>
                  Total : {transaction}
                </h1>
                <p className='text-sm italic'>Transection : {transaction === "?" ? "?" : ' ' + data?.length}</p>
              </div>
              <div className='flex justify-end items-end'>
                <button
                  onClick={calcaulateTotal}
                  className=' py-[10px] text-sm rounded-md px-4 border shadow-lg hover:bg-blue-100 font-semibold'>
                  Calculate Total
                </button>
              </div>
            </div>
          </div>
          {/* <div className="xs:overflow-x-scroll xl:overflow-x-hidden">
            {
              Receipt?.data?.data?.AllTransaction?.length > 0 ? <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-100 h-16 w-full text-sm leading-none text-[#0d0d48]">
                    <th className="font-normal text-left pl-10">Date</th>
                    <th className="font-normal text-left  px-2 xl:px-0">
                      Reciept No
                    </th>
                    <th className="font-normal text-left px-2 xl:px-0">
                      Student Name
                    </th>
                    <th className="font-normal text-left px-2 xl:px-0">
                      Class
                    </th>
                    <th className="font-normal text-left  px-2 xl:px-0">
                      Installment
                    </th>
                    <th className="font-normal text-left px-2 xl:px-0">
                      Amount
                    </th>
                    <th className="font-normal text-left px-2 xl:px-0">
                      Admin
                    </th>
                    <th className="font-normal text-center px-2 xl:px-0">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  <tr
                    className="h-20 text-sm leading-none text-gray-800 border-b border-gray-100"
                  >
                    <td className="pl-8">
                      02 / 05 / 2023
                    </td>
                    <td className=" px-2 font-bold xl:px-0">
                      002
                    </td>
                    <td className="px-2 xl:px-0 capitalize">
                      Shad
                    </td>
                    <td className="px-2 xl:px-0 capitalize">
                      Vivo F17 Pro
                    </td>
                    <td className=" px-2 xl:px-0">
                      002
                    </td>
                    <td>
                      <span className="bg-blue-200 px-4 text-darkblue-500 font-bold rounded">
                        1500
                      </span>
                    </td>
                    <td>
                      <span className="capitalize">Israil</span>
                    </td>
                    <td className="px-5">
                      <span className='flex justify-center items-center '>
                        <Tippy content="Show Reciept">
                          <div onClick={() =>
                            navigate(`/Receipt/Receipt`)}>
                            <AiFillEye className="text-xl cursor-pointer" />
                          </div>
                        </Tippy>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
                :
                <div className='flex w-full justify-center items-center py-[7px]  rounded-md space-x-4 bg-red-200'>
                  <IoMdInformationCircle className='text-xl text-red-600' />
                  <h1 className='text-sm font-bold text-red-800'>No Transection </h1>
                </div>
            }
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Report