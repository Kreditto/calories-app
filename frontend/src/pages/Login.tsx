import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import './css/Main.css'; 

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [errorField, setErrorField] = useState<'email' | 'password' | 'all' | null>(null); // підсвітка полів бутстреп
    const auth = useContext(AuthContext)!;
    const { login } = auth;
    const navigate = useNavigate();

    const headers = {  
        'Content-Type': 'application/json' 
    };

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoginError(null);
        setErrorField(null);

       try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers,
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    setLoginError(data.message);
                    setErrorField('email'); 
                } else if (response.status === 400) {
                    setLoginError(data.message);
                    setErrorField('password'); 
                } else {
                    setLoginError(data.message);
                    setErrorField('all');
                }
                return;
            }

            if (data && data.token) {

                login(data.token, data.role || 'user');

                if (data.role === 'admin') {
                    navigate('/Moder');
                } else {
                    navigate('/Home');
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="card shadow-sm auth-card">
                                <div className="card-body p-4">
                                    <h2 className="text-center mb-4 fw-bold">Вхід у систему</h2>
                                    
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label htmlFor="login-email" className="form-label">
                                                Електронна пошта
                                            </label>
                                            <input 
                                                id="login-email"
                                                className={`form-control ${errorField === 'email' || errorField === 'all' ? 'is-invalid' : ''}`}
                                                type="email" 
                                                placeholder="example@mail.com" 
                                                value={email}
                                                onChange={e => setEmail(e.target.value)} 
                                                required
                                            />
                                            {errorField === 'email' && <div className="invalid-feedback">{loginError}</div>}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label htmlFor="login-password" className="form-label">
                                                Пароль
                                            </label>
                                            <input 
                                                id="login-password"
                                                className={`form-control ${errorField === 'password' || errorField === 'all' ? 'is-invalid' : ''}`}
                                                type="password" 
                                                placeholder="Ваш пароль" 
                                                value={password}
                                                onChange={e => setPassword(e.target.value)} 
                                                required
                                            />
                                            {errorField === 'password' && <div className="invalid-feedback">{loginError}</div>}
                                        </div>

                                        <button className="btn btn-primary w-100 fw-bold py-2" type="submit" aria-label="Увійти"> 
                                            Увійти
                                        </button>
                                    </form>
                                    
                                    <div className="mt-4 text-center">
                                        <span className="text-muted small">
                                            Немає аккаунту? 
                                            <Link to="/register" className="text-decoration-none fw-medium">
                                                Зареєструватися
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

export default Login;