import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './css/Main.css';

const Profile = () => {
    const { token, setRole } = useContext(AuthContext) as any;
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [userRole, setUserRole] = useState('def');
    const [showModal, setShowModal] = useState(false);

    const [vaga, setVaga] = useState('');
    const [zrist, setZrist] = useState('');
    const [vik, setVik] = useState('');
    const [stat, setStat] = useState('female');
    const [activity, setActivity] = useState('1.2');
    const [goal, setGoal] = useState('maintain');

    const [kaloriyi, setKaloriyi] = useState(0);
    const [bilky, setBilky] = useState(0);
    const [zhyry, setZhyry] = useState(0);
    const [vuglevody, setVuglevody] = useState(0);

    const [message, setMessage] = useState({ type: '', text: '' });

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }), [token]);

    const loadProfileData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user', { 
                headers 
            });
            if (!response.ok) throw new Error(`Помилка: ${response.status}`);
            const data = await response.json();
            const user = data.user;

            setLogin(user.login || '');
            setEmail(user.email || '');
            setUserRole(user.userRole || 'def');
            setVaga(user.vaga || '');
            setZrist(user.zrist || '');
            setVik(user.vik || '');
            setStat(user.stat || 'female');
            setActivity(user.activity || '1.2');
            setGoal(user.goal || 'maintain');
            setKaloriyi(user.calories || 0);
            setBilky(user.bilky || 0);
            setZhyry(user.zhyry || 0);
            setVuglevody(user.vuglevody || 0);
        } catch (e) {
            setMessage({ type: 'danger', text: 'Помилка завантаження даних' });
        }
    }, [headers]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    useEffect(() => {
        if (vaga && zrist && vik && Number(vaga) > 0) {
            let bmr = (10 * Number(vaga)) + (6.25 * Number(zrist)) - (5 * Number(vik));
            bmr = stat === 'male' ? bmr + 5 : bmr - 161;
            let total = bmr * Number(activity);
            if (goal === 'lose') total *= 0.85;
            else if (goal === 'gain') total *= 1.15;
            const kcal = Math.round(total);
            setKaloriyi(kcal);
            setBilky(Math.round((kcal * 0.25) / 4));
            setZhyry(Math.round((kcal * 0.25) / 9));
            setVuglevody(Math.round((kcal * 0.5) / 4));
        }
    }, [vaga, zrist, vik, stat, activity, goal]);

    const handleSaveProfile = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/user', {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    login, vaga, zrist, vik, stat, activity, goal,
                    calories: kaloriyi, bilky, zhyry, vuglevody
                })
            });
            if (response.ok) setMessage({ type: 'success', text: 'Профіль оновлено!' });
        } catch (e) {
            setMessage({ type: 'danger', text: 'Помилка збереження.' });
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/cancel-premium', {
                method: 'POST',
                headers
            });
            if (response.ok) {
                setUserRole('def');
                if (setRole) setRole('def');
                setShowModal(false);
                setMessage({ type: 'success', text: 'Підписку скасовано.' });
            }
        } catch (e) {
            setMessage({ type: 'danger', text: 'Не вдалося скасувати підписку.' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 mb-5" style={{ maxWidth: '600px' }}>
                <div className="text-center mb-5">
                    {/* додати потім додавання зображеняя
                     <img src="" alt="User Avatar" className="rounded-circle shadow-sm border border-3 border-success" style={{ width: '120px', height: '120px' }} /> */}
                    <h2 className="mt-3 fw-bold">Профіль користувача</h2>
                </div>

                {message.text && <div className={`alert alert-${message.type} text-center shadow-sm`}>{message.text}</div>}

                <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-4">
                    <div className="card p-4 shadow-sm border-0 bg-white">
                        <h5 className="text-success fw-bold mb-3">Інформація про акаунт</h5>
                        <div className="mb-3">
                            <label htmlFor="user-login" className="form-label small fw-bold">Логін</label>
                            <input id="user-login" type="text" className="form-control" value={login} onChange={(e) => setLogin(e.target.value)} />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="user-email" className="form-label small fw-bold text-muted">Email</label>
                            <input id="user-email" type="email" className="form-control bg-light" value={email} readOnly />
                        </div>
                    </div>

                    <div className="card p-4 shadow-sm border-0" style={{ background: userRole === 'premium' ? '#fff9e6' : '#f8f9fa' }}>
                        <h5 className="fw-bold mb-2">Мій план</h5>
                        {userRole === 'premium' ? (
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="badge bg-warning text-dark p-2 mb-1">PREMIUM ПЛАН АКТИВНО</span>
                                    <p className="small text-muted mb-0">Вам доступні всі функції</p>
                                </div>
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowModal(true)}>Скасувати</button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="small mb-3">Ви використовуєте безкоштовну версію.</p>
                                <a href="/premium" className="btn btn-warning btn-sm w-100 fw-bold">Отримати Premium</a>
                            </div>
                        )}
                    </div>

                    <div className="card p-4 shadow-sm border-0">
                        <h5 className="text-success fw-bold mb-3">Фізичні дані</h5>
                        <div className="d-flex flex-column gap-3">
                            <div>
                                <label htmlFor="vaga" className="form-label small fw-bold">Вага (кг)</label>
                                <input id="vaga" type="number" className="form-control" value={vaga} onChange={e => setVaga(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="zrist" className="form-label small fw-bold">Зріст (см)</label>
                                <input id="zrist" type="number" className="form-control" value={zrist} onChange={e => setZrist(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="vik" className="form-label small fw-bold">Вік</label>
                                <input id="vik" type="number" className="form-control" value={vik} onChange={e => setVik(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="stat" className="form-label small fw-bold">Стать</label>
                                <select id="stat" className="form-select" value={stat} onChange={e => setStat(e.target.value)}>
                                    <option value="male">Чоловік</option>
                                    <option value="female">Жінка</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="activity" className="form-label small fw-bold">Активність</label>
                                <select id="activity" className="form-select" value={activity} onChange={e => setActivity(e.target.value)}>
                                    <option value="1.2">Мінімальна (сидяча робота)</option>
                                    <option value="1.375">Низька (1-2 тренування)</option>
                                    <option value="1.55">Середня (3-5 тренувань)</option>
                                    <option value="1.725">Висока (щодня)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="cil" className="form-label small fw-bold">Ціль</label>
                                <select id="cil" className="form-select" value={goal} onChange={e => setGoal(e.target.value)}>
                                    <option value="lose">Схуднення</option>
                                    <option value="maintain">Підтримка</option>
                                    <option value="gain">Набір маси</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 shadow-sm bg-success text-white">
                        <h5 className="fw-bold mb-3">Денна норма КДЖВ</h5>
                        <div className="mb-3">
                            <label htmlFor="kcal" className="form-label small opacity-75">Калорії</label>
                            <input id="kcal" type="number" className="form-control form-control-lg bg-white"value={kaloriyi} onChange={e => setKaloriyi(Number(e.target.value))} />
                        </div>
                        <div className="row g-2 text-dark">
                            <div className="col-4">
                                <label htmlFor="bilky" className="small text-white">Білки</label>
                                <input id="bilky" type="number" className="form-control" value={bilky} onChange={e => setBilky(Number(e.target.value))} />
                            </div>
                            <div className="col-4">
                                <label htmlFor="zhyry" className="small text-white">Жири</label>
                                <input id="zhyry" type="number" className="form-control" value={zhyry} onChange={e => setZhyry(Number(e.target.value))} />
                            </div>
                            <div className="col-4">
                                <label htmlFor="vuglevody" className="small text-white">Вуглев.</label>
                                <input id="vuglevody" type="number" className="form-control" value={vuglevody} onChange={e => setVuglevody(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success btn-lg fw-bold shadow mt-2">Зберегти всі зміни</button>
                </form>
            </div>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Підтвердження</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body py-4 text-center">
                                <p className="mb-0">Ви впевнені, що хочете <strong>скасувати Premium підписку</strong>?</p>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Назад</button>
                                <button type="button" className="btn btn-danger" onClick={handleCancelSubscription}>Так, скасувати</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;