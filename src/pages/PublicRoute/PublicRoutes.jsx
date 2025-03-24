import React, { Suspense } from 'react';

// import Loader from 'react-loaders';

import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
 
    const token = localStorage.getItem("SAAS_ECOM_customer_token")
  return token
    ? <Navigate to="/home" replace />
    : ( 
        <Outlet /> 
    );
    
};

export default PublicRoutes;