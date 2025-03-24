import React, { Suspense } from 'react';

// import Loader from 'react-loaders';

import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {

    const token = localStorage.getItem("SAAS_ECOM_customer_token")
    return token
        ? (
            <Outlet />
        )
        : <Navigate to="/login" />;

};

export default PrivateRoutes;