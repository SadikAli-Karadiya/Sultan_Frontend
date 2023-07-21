import React from 'react'
import { Route, Routes } from "react-router-dom";
import Updateprofile from './Profile';

function Admin() {
  return (
    <>
      <Routes>
        <Route>
          <Route path="/UpdateProfile" element={<Updateprofile />} />
        </Route>
      </Routes>
    </>
  )
}

export default Admin
