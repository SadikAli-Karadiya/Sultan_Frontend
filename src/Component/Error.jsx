import React from "react";
import { NavLink } from "react-router-dom";

function Error() {
    return (
        <>
            <div className="w-full flex flex-col justify-center items-center min-h-screen space-y-5" style={{ minHeight: "calc(100vh - 70px)" }}>
                <h1 className="text-[115px] font-bold  text-[#0d0d48]">Oops!</h1>
                <p className="uppercase text-xl font-bold text-[#0d0d48] ">404 - Page not found</p>
                <NavLink to={"/"}>
                    <button className="uppercase bg-[#0d0d48] rounded-full px-5 text-sm py-[7px] border-2 hover:text-[#0d0d48] font-semibold hover:bg-white border-[#0d0d48] text-white">
                        Go To Back
                    </button>
                </NavLink>
            </div>
        </>
    )
}

export default Error