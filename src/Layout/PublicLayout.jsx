import React, { useState } from "react";
import ForgetPassword from "../Pages/ForgetPassword/Forgetpassword";
import Login from "../Pages/Login";
import { Link, Outlet } from 'react-router-dom'


function PublicLayout() {
 
   return (
     <>
      <div>
      {/* <div className="bg-black">
        <nav className="flex ">
          <Link to="/" className="text-white">
          <li>Login</li>

          </Link>
          <Link to="/Registration" className="text-white">
          <li>Register</li>

          </Link>
          <Link to="/ForgetPassword" className="text-white">
          <li>Forget</li>
          </Link>

        </nav>

      </div> */}
        <div>
          <Outlet/>
        </div>
      </div>
     </>
   );
 };

export default PublicLayout
