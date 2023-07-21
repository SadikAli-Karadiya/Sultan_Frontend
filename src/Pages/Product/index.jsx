import React from "react";
import { Route, Routes } from "react-router-dom";
import ProductList from "./Productlist";
import ProductDetails from "./ProductDetails";


function Product() {
    return (
        <>
            <Routes>
                <Route>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product-details/:id" element={<ProductDetails />} />

                </Route>
            </Routes>
        </>
    )
}

export default Product