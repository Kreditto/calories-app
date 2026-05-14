import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Admin/Navbar';
import '../css/Main.css';

const Moder = () => {
    const { token } = useContext(AuthContext) as any;
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allRecipes, setAllRecipes] = useState<any[]>([]);
    const [pendingRecipes, setPendingRecipes] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'food' | 'recipes' | 'moderation'>('food');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'food' | 'recipe' } | null>(null);
    const [formMode, setFormMode] = useState<'addFood' | 'addRecipe' | 'editFood' | 'editRecipe'>('addFood');
    const [editId, setEditId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        caloriesPer100: 0,
        bilkyPer100: 0,
        zhyryPer100: 0,
        vuglevodyPer100: 0,
        isPublic: true
    });

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }), [token]);

    const fetchAllFood = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-food', { 
                method: 'GET', 
                headers 
            });
            const data = await response.json();
            if (response.ok) {
                setAllFood(data);
            } else {
                console.error('помилка завантаження їжі:', data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    const fetchAllRecipes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-recipes', { 
                method: 'GET', 
                headers 
            });
            const data = await response.json();
            if (response.ok) {
                setAllRecipes(data.recipes);
            } else {
                console.error('помилка завантаження рецептів:', data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    const fetchPendingRecipes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/pending-recipes', { 
                method: 'GET', 
                headers 
            });
            const data = await response.json();
            if (response.ok) {
                setPendingRecipes(data);
            } else {
                console.error('помилка завантаження pending рецептів:', data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    useEffect(() => {
        fetchAllFood();
        fetchAllRecipes();
        fetchPendingRecipes();
    }, [fetchAllFood, fetchAllRecipes, fetchPendingRecipes]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const url = deleteTarget.type === 'food'
            ? `http://localhost:5000/api/admin/delete-food/${deleteTarget.id}`
            : `http://localhost:5000/api/admin/delete-recipe/${deleteTarget.id}`;
        try {
            const response = await fetch(url, { 
                method: 'DELETE', 
                headers 
            });

            if (response.ok) {
                if (deleteTarget.type === 'food') {
                    fetchAllFood();
                } else {
                    fetchAllRecipes();
                    fetchPendingRecipes();
                }
            }
        } catch (err) {
            console.error(err);
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const handleApproveRecipe = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/approve-recipe/${id}`, { 
                method: 'PATCH', 
                headers 
            });
            if (response.ok) {
                fetchAllRecipes();
                fetchPendingRecipes();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveForm = async () => {
        const isEdit = formMode === 'editFood' || formMode === 'editRecipe';
        const isFood = formMode === 'addFood' || formMode === 'editFood';

        const url = isEdit
            ? `http://localhost:5000/api/admin/${isFood ? 'food' : 'recipe'}/${editId}`
            : `http://localhost:5000/api/admin/${isFood ? 'create-food' : 'create-recipe'}`;

        try {
            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers,
                body: JSON.stringify(form)
            });

            if (response.ok) {
                if (isFood) {
                    fetchAllFood();
                } else {
                    fetchAllRecipes();
                    fetchPendingRecipes();
                }
            }
        } catch (err) {
            console.error(err);
        }
        setShowFormModal(false);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Адмін-панель</h2>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={() => {
                            
                        }}>+ Додати їжу</button>
                        <button className="btn btn-success" onClick={() => {
                            
                        }}>+ Додати рецепт</button>
                    </div>
                </div>

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>
                            Їжа ({allFood.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
                            Рецепти ({allRecipes.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'moderation' ? 'active' : ''}`} onClick={() => setActiveTab('moderation')}>
                            Модерація {pendingRecipes.length > 0 && <span className="badge bg-danger ms-1">{pendingRecipes.length}</span>}
                        </button>
                    </li>
                </ul>

                {activeTab === 'food' && (
                    <div className="row">
                        {allFood.map(item => (
                            <div className="col-md-4 mb-3" key={item._id}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item.name}</h5>
                                        <div className="badge bg-warning text-dark mb-2 d-block">{item.caloriesPer100} ккал / 100г</div>
                                        <div className="d-flex gap-1 mb-3">
                                            <span className="badge border text-dark">Б: {item.bilkyPer100}г</span>
                                            <span className="badge border text-dark">Ж: {item.zhyryPer100}г</span>
                                            <span className="badge border text-dark">В: {item.vuglevodyPer100}г</span>
                                        </div>
                                        <div className="mt-auto d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary w-50" onClick={() => {
                                                setForm({
                                                    name: item.name,
                                                    description: item.description || '',
                                                    caloriesPer100: item.caloriesPer100,
                                                    bilkyPer100: item.bilkyPer100,
                                                    zhyryPer100: item.zhyryPer100,
                                                    vuglevodyPer100: item.vuglevodyPer100,
                                                    isPublic: item.isPublic ?? true
                                                });
                                                setEditId(item._id);
                                                setFormMode('editFood');
                                                setShowFormModal(true);
                                            }}>Редагувати</button>
                                            <button className="btn btn-sm btn-outline-danger w-50" onClick={() => {
                                                setDeleteTarget({ id: item._id, type: 'food' });
                                                setShowDeleteModal(true);
                                            }}>Видалити</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'recipes' && (
                    <div className="row">
                        {allRecipes.map(item => (
                            <div className="col-md-4 mb-3" key={item._id}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="small text-muted flex-grow-1">{item.description}</p>
                                        <div className="badge bg-primary mb-2 d-block">{item.caloriesPer100} ккал / 100г</div>
                                        <div className="d-flex gap-1 mb-3">
                                            <span className="badge border text-dark">Б: {item.bilkyPer100}г</span>
                                            <span className="badge border text-dark">Ж: {item.zhyryPer100}г</span>
                                            <span className="badge border text-dark">В: {item.vuglevodyPer100}г</span>
                                        </div>
                                        <div className="mt-auto d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary w-50" onClick={() => {
                                                setForm({
                                                    name: item.name,
                                                    description: item.description || '',
                                                    caloriesPer100: item.caloriesPer100,
                                                    bilkyPer100: item.bilkyPer100,
                                                    zhyryPer100: item.zhyryPer100,
                                                    vuglevodyPer100: item.vuglevodyPer100,
                                                    isPublic: item.isPublic ?? true
                                                });
                                                setEditId(item._id);
                                                setFormMode('editRecipe');
                                                setShowFormModal(true);
                                            }}>Редагувати</button>
                                            <button className="btn btn-sm btn-outline-danger w-50" onClick={() => {
                                                setDeleteTarget({ id: item._id, type: 'recipe' });
                                                setShowDeleteModal(true);
                                            }}>Видалити</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div className="row">
                        {pendingRecipes.length === 0 && (
                            <p className="text-muted">Немає рецептів на модерацію</p>
                        )}
                        {pendingRecipes.map(item => (
                            <div className="col-md-4 mb-3" key={item._id}>
                                <div className="card shadow-sm h-100 border-warning">
                                    <div className="card-body d-flex flex-column">
                                        <span className="badge bg-warning text-dark mb-2" style={{ width: 'fit-content' }}>⏳ Очікує</span>
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="small text-muted flex-grow-1">{item.description}</p>
                                        <div className="badge bg-primary mb-2 d-block">{item.caloriesPer100} ккал / 100г</div>
                                        <div className="d-flex gap-1 mb-3">
                                            <span className="badge border text-dark">Б: {item.bilkyPer100}г</span>
                                            <span className="badge border text-dark">Ж: {item.zhyryPer100}г</span>
                                            <span className="badge border text-dark">В: {item.vuglevodyPer100}г</span>
                                        </div>
                                        <div className="mt-auto d-flex gap-2">
                                            <button className="btn btn-sm btn-success w-50" onClick={() => handleApproveRecipe(item._id)}>Схвалити</button>
                                            <button className="btn btn-sm btn-danger w-50" onClick={() => {
                                                setDeleteTarget({ id: item._id, type: 'recipe' });
                                                setShowDeleteModal(true);
                                            }}>Відхилити</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Підтвердження видалення</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Ви впевнені, що хочете видалити цей елемент?</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Скасувати</button>
                                    <button className="btn btn-danger" onClick={handleDelete}>Видалити</button>
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
