import React from "react";
import { Route, Routes } from "react-router-dom";
import CompanyList from "./CompanyList";
import CompanyFormModal from "./CompanyAddEdit/CompanyAddEditModel";
import CompanyDetails from "./CompanyDetails/CompanyDetails";


function Company() {
    return (
        <>
            <Routes>
                <Route>
                    <Route path="/" element={<CompanyList />} />
                    <Route path="/CompanyFormModal" element={<CompanyFormModal />} />
                    <Route path="/CompanyDetails/:id" element={<CompanyDetails />} />
                </Route>
            </Routes>
        </>
    )
}

export default Company