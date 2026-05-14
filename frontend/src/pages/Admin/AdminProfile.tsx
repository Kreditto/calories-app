import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Admin/Navbar';
import '../css/Main.css';

const AdminProfile = () => {
    const { token } = useContext(AuthContext) as any;

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [userRole, setUserRole] = useState('');

    const [adminStats, setAdminStats] = useState({
        food: {
            Created: 0
        },
        recipe: {
            Created: 0,
            Approved: 0
        }
    });

    const [message, setMessage] = useState({
        type: '',
        text: ''
    });

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }), [token]);

    const loadProfileData = useCallback(async () => {
        try {
            const [response, resStat] = await Promise.all([
                fetch('http://localhost:5000/api/user', {
                    headers
                }),
                fetch('http://localhost:5000/api/admin/stats', {
                    headers
                })
            ]);

            if (response.ok) {
                const data = await response.json();

                setLogin(data.login || '');
                setEmail(data.email || '');
                setUserRole(data.UserRole || '');
            }

            if (resStat.ok) {
                const statsData = await resStat.json();

                setAdminStats(statsData);
            }

        } catch (err) {
            setMessage({
                type: 'danger',
                text: 'Помилка завантаження даних'
            });
        }
    }, [headers]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    const handleSaveProfile = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/user', {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    login
                })
            });

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Профіль оновлено!'
                });
            } else {
                setMessage({
                    type: 'danger',
                    text: 'Не вдалося оновити профіль'
                });
            }

        } catch (err) {
            setMessage({
                type: 'danger',
                text: 'Помилка збереження'
            });
        }
    };

    return (
        <>
            <Navbar />

            <div
                className="container mt-5 mb-5"
                style={{ maxWidth: '600px' }}
            >
                <div className="text-center mb-5">
                    <h2 className="mt-3 fw-bold">
                        Профіль користувача
                    </h2>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} text-center shadow-sm`}>
                        {message.text}
                    </div>
                )}

                <form
                    onSubmit={handleSaveProfile}
                    className="d-flex flex-column gap-4"
                >
                    <div className="card p-4 shadow-sm border-0 bg-white">

                        <h5 className="text-success fw-bold mb-3">
                            Інформація про акаунт
                        </h5>

                        <div className="mb-3">
                            <label
                                htmlFor="user-login"
                                className="form-label small fw-bold"
                            >
                                Логін
                            </label>

                            <input
                                id="user-login"
                                type="text"
                                className="form-control"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="user-email"
                                className="form-label small fw-bold text-muted"
                            >
                                Email
                            </label>

                            <input
                                id="user-email"
                                type="email"
                                className="form-control bg-light"
                                value={email}
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="user-role"
                                className="form-label small fw-bold text-muted"
                            >
                                Роль
                            </label>

                            <input
                                id="user-role"
                                type="text"
                                className="form-control bg-light"
                                value={userRole}
                                readOnly
                            />
                        </div>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h6>Food Created</h6>
                                        <h3>
                                            {adminStats.food?.Created ?? 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h6>Recipes Created</h6>

                                        <h3>
                                            {adminStats.recipe?.Created ?? 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card text-center shadow-sm">
                                    <div className="card-body">
                                        <h6>Recipes Approved</h6>

                                        <h3>
                                            {adminStats.recipe?.Approved ?? 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                        >
                            Зберегти
                        </button>

                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminProfile;