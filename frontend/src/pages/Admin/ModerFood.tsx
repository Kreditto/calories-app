import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import '../css/Main.css';

const Moder = () => {
    const { token, role } = useContext(AuthContext) as any;
    const [allPendingFood, setPendingFood] = useState<any[]>([]);
    const [pedModer, setPedModer] = useState<any[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pedFood' | 'pedRecipe'>('pedFood');
    const [showModal, setShowModal] = useState(false);

    const headers = useMemo(() => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }), [token]);
    
        const fetchPedFood = useCallback(async () => {
            try {
                const response = await fetch('http://localhost:5000/api/food/pending', {
                    method: 'GET',
                    headers
                });
                const data = await response.json();
                if (response.ok) {
                    setPendingFood(data);
                } else {
                    console.error("помилка завантаження:", data.message);
                }
            } catch (err) {
                console.error(err);
            }
        }, [headers]);
    
        useEffect(() => {
            fetchPedFood();
        }, [fetchPedFood]);








    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Рецепти</h2>
                </div>

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'pedFood' ? 'active' : ''}`} onClick={() => setActiveTab('pedFood')}>Страви на модерацію</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'pedRecipe' ? 'active' : ''}`} onClick={() => setActiveTab('pedRecipe')}>Рецепти на модерацію</button>
                    </li>
                </ul>

                <div className="row">
                    {/* {pedModer
                        } */}
                </div>


                {showModal && (
                    <div className="modal show d-block" tabIndex={-1}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Підтвердження видалення</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Ви впевнені, що хочете видалити цей продукт?</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Скасувати
                                    </button>
                                    <button className="btn btn-danger" onClick={() => {
                                        console.log("delete", deleteId);
                                        setShowModal(false);
                                    }}
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}                   
            </div> 
        </>
    );
};

export default Moder;