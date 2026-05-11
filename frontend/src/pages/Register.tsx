import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import './css/Main.css'; 

const Register = () => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [isPremium, setIsPremium] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const headers = {  
        'Content-Type': 'application/json' 
    };

    const handleRegister = async (e: React.SubmitEvent) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    login,
                    email,
                    password,
                    isPremium: false
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    setEmailError(data.message);
                }
                return; 
            }

            navigate('/login');

        } catch (error) {
            console.error("рестраційна помилка:", error);
        }

        // if (res.data && res.data.token) {
        //     login(res.data.token, res.data.role || 'user');
        //     navigate('/Home');

    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="card shadow-sm auth-card">
                                <div className="card-body p-4">
                                    <h2 className="text-center mb-4 fw-bold">Реєстрація</h2>
                
                                    <form onSubmit={handleRegister}>
                                        <div className="mb-3">
                                            <label htmlFor="reg-login" className="form-label">Ваш логін (ім'я)</label>
                                            <input 
                                                id="reg-login"
                                                className="form-control"
                                                type="text" 
                                                placeholder="Як вас звати?" 
                                                value={login}
                                                onChange={(e) => setLogin(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="login-email" className="form-label">
                                                Електронна пошта
                                            </label>
                                            <input 
                                                id="reg-email"
                                                className={`form-control ${emailError ? 'is-invalid' : ''}`}  
                                                type="email" 
                                                placeholder="example@mail.com" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)} 
                                                required 
                                            />
                                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="reg-password" className="form-label">
                                                Пароль
                                            </label>
                                            <input 
                                                id="reg-password"
                                                className="form-control" 
                                                type="password" 
                                                placeholder="мінімум 6 символів" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)} 
                                                required 
                                            />
                                        </div>

                                        <button 
                                            className="btn btn-primary w-100 fw-bold py-2" 
                                            type="submit"
                                            aria-label="Зареєструватися"
                                        >
                                            Зареєструватися
                                        </button>
                                    </form>

                                    <div className="mt-4 text-center">
                                        <span className="text-muted small">
                                            Вже є аккаунт?
                                            <Link to="/login" className="text-decoration-none fw-medium">
                                                Увійти тут 
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;