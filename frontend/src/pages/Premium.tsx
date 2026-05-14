import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
    const { token, setRol } = useContext(AuthContext) as any;
    const navigate = useNavigate();
    const [cardData, setCardData] = useState({
        number: '',
        date: '',
        holder: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const handlePayment = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/user/buy-premium', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    cardNumber: cardData.number,
                    expiryDate: cardData.date,
                    cardHolder: cardData.holder,
                    cvv: cardData.cvv
                })
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.removeItem('token');
                if (setRol) setRol(''); 
                navigate('/login');
            } else { 
                console.error("помилка покупки преміума:", result.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold text-success">Оберіть свій план</h1>
                    <p className="lead text-muted">Отримайте повний контроль над своїм раціоном</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card mb-4 shadow-lg border-success h-100">
                            <div className="card-header py-3 text-white bg-success text-center">
                                <h4 className="my-0 fw-normal">Premium</h4>
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h1 className="card-title pricing-card-title text-center">99 <small className="text-muted fw-light">грн/міс</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Додавання Полуденку та Перекусу</li>
                                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Необмежена кількість рецептів</li>
                                </ul>
                                
                                <hr />
                                
                                <form onSubmit={handlePayment}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Номер картки</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={16}
                                            required
                                            onChange={e => setCardData({...cardData, number: e.target.value})}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold">Термін дії</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                                onChange={e => setCardData({...cardData, date: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold">CVV</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="***"
                                                maxLength={3}
                                                required
                                                onChange={e => setCardData({...cardData, cvv: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">Власник картки</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="IVAN IVANOV"
                                            required
                                            onChange={e => setCardData({...cardData, holder: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div className="alert alert-warning py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
                                        Після активації ви будете <strong>автоматично розлогінені</strong>. Будь ласка, увійдіть знову, щоб оновити функції.
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-lg btn-success w-100 shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? "Обробка..." : "Активувати Premium"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Premium;