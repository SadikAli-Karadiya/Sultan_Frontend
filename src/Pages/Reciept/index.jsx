import React from "react";
import { Route, Routes } from "react-router-dom";
import SearchReciept from "./SearchReceipt";
import Receipt from "./Receipt";
import GenerateReceipt from "./ReceiptGenerate";


function Index() {
    return (
        <>
            <Routes>
                <Route>
                    <Route path="/Search" element={<SearchReciept />} />
                    <Route path="/Generate/:id" element={<GenerateReceipt />} />
                    <Route path="/Receipt/:id" element={<Receipt />} />
                </Route>
            </Routes>
        </>
    )
}

export default Index