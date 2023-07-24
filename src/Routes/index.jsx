import React, {useContext} from 'react'
import { Route, HashRouter, Routes, Navigate } from 'react-router-dom'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import { PhoneContext } from '../PhoneContext'
import ErrorBoundry from '../Component/ErrorBoundry'

function AppRoutes() {
    
    const {token} = useContext(PhoneContext)

    return (
        <HashRouter>
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
        </HashRouter>
    )
}

export default AppRoutes
