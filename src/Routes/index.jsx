import React, {useContext} from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import { PhoneContext } from '../PhoneContext'
import ErrorBoundry from '../Component/ErrorBoundry'

function AppRoutes() {
    
    const {token} = useContext(PhoneContext)

    return (
        <BrowserRouter>
            <ErrorBoundry>
                <Routes>
                    {token ? (
                        <>
                            <Route path='/*' element={<PrivateRoutes />} />
                        </>
                    ) : (
                        <>
                            <Route path='/*' element={<PublicRoutes />} />
                            <Route path='*' element={<Navigate to='/' />} />
                        </>
                    )}
                </Routes>
            </ErrorBoundry>
        </BrowserRouter>
    )
}

export default AppRoutes
