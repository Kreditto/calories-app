import React, { useContext } from 'react'; 
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode; 
    allowedRoles?: string[];
}

const PerevirkaAuth = ({ children, allowedRoles }: PrivateRouteProps) => {
    const { token, role } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)){
        return <Navigate to="/Home" replace />;
    } 

    return <>{children}</>; 
};

export default PerevirkaAuth;