import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout, role } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/Home">
                    Трекер Калорій
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/Home">Щоденник</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Profile">Профіль</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-warning fw-bold" to="/recipes">
                                Рецепти {role !== 'premium' && <span className="text-warning"></span>}
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {role === 'premium' && <span className="badge bg-warning text-dark me-3">PREMIUM</span>}
                        {token && (
                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Вийти
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;