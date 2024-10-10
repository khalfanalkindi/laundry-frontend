import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('access_token');

    return isAuthenticated ? Element : <Navigate to="/login" />;
};

export default PrivateRoute;
