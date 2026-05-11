import React, { useContext } from 'react'; 
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode; 
}

const PerevirkaAuth = ({ children }: PrivateRouteProps) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    

    return <>{children}</>; 
};

export default PerevirkaAuth;