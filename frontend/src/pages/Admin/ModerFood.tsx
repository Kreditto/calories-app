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
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'food' | 'recipe' } | null>(null);
    const [formMode, setFormMode] = useState<'addFood' | 'addRecipe' | 'editFood' | 'editRecipe'>('addFood');
    const [editId, setEditId] = useState<string | null>(null);
    const [portions, setPortions] = useState<{ [key: string]: number }>({});

    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        ingredients: [
            { name: '', calories100: 0, bilky100: 0, zhyry100: 0, vuglevody100: 0, gramsInPortion: 100 }
        ]
    });

    const [foodForm, setFoodForm] = useState({
        name: '',
        caloriesPer100: 0,
        bilkyPer100: 0,
        zhyryPer100: 0,
        vuglevodyPer100: 0,
    });

    const [recipeForm, setRecipeForm] = useState({
        name: '',
        description: '',
        ingredients: [
            { name: '', calories100: 0, bilky100: 0, zhyry100: 0, vuglevody100: 0, gramsInPortion: 100 }
        ]
    });

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }), [token]);

    const fetchAllFood = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-food', { headers });
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

    useEffect(() => { 
        fetchAllFood(); 
    }, [fetchAllFood]);

    const fetchAllRecipes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-recipes', { headers });
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

    useEffect(() => { 
        fetchAllRecipes(); 
    }, [fetchAllRecipes]);

    const fetchPendingRecipes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/pending-recipes', { headers });
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
        fetchPendingRecipes(); 
    }, [fetchPendingRecipes]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const url = deleteTarget.type === 'food'
            ? `http://localhost:5000/api/admin/delete-food/${deleteTarget.id}`
            : `http://localhost:5000/api/admin/delete-recipe/${deleteTarget.id}`;
        try {
            const response = await fetch(url, { method: 'DELETE', headers });
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

    const addIngredientRow = () => {
        setNewRecipe(prev => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                { name: '', calories100: 0, bilky100: 0, zhyry100: 0, vuglevody100: 0, gramsInPortion: 0 }
            ]
        }));
    };

    const DelIngredientRow = () => {
        setNewRecipe({
            ...newRecipe,
            ingredients: newRecipe.ingredients.slice(0, -1) 
        });
    };

    const handleInputChange = (index: number, field: string, value: string | number) => {
        const updatedIngredients = [...newRecipe.ingredients];
        (updatedIngredients[index] as any)[field] = value;
        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
    };

    const handleCreateRecipe = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        let totalCal = 0, totalB = 0, totalZ = 0, totalV = 0;
        newRecipe.ingredients.forEach(ing => {
            const factor = ing.gramsInPortion / 100;
            totalCal += ing.calories100 * factor;
            totalB += ing.bilky100 * factor;
            totalZ += ing.zhyry100 * factor;
            totalV += ing.vuglevody100 * factor;
        });

        const recipeToSave = {
            name: newRecipe.name,
            description: newRecipe.description,
            authorId: null,
            caloriesPer100: Math.round(totalCal),
            bilkyPer100: Math.round(totalB),
            zhyryPer100: Math.round(totalZ),
            vuglevodyPer100: Math.round(totalV),
            ingredients: newRecipe.ingredients,
            isPublic: true,
            statusRep: 'approved'
        };

        try {
            const response = await fetch('http://localhost:5000/api/admin/create-recipe', {
                method: 'POST',
                headers,
                body: JSON.stringify(recipeToSave)
            });
            const result = await response.json();
            if (response.ok) {
                setShowCreate(false);
                fetchAllRecipes();
                fetchPendingRecipes();
            } else {
                console.error('помилка на сервері', result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveForm = async () => {
        const isEditFood = formMode === 'editFood';
        const isFood = formMode === 'addFood' || formMode === 'editFood';
        let url = '';
        let method = '';

        if (isFood) {
            if (isEditFood) {
                url = `http://localhost:5000/api/admin/food/${editId}`;
             method = 'PUT';
            } else {
                url = `http://localhost:5000/api/admin/create-food`;
                method = 'POST';
            }
        } else {
            url = `http://localhost:5000/api/admin/create-recipe`;
            method = 'POST';
        }
        const body = isFood ? foodForm : recipeForm;
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body)
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
                            setFoodForm({ name: '', caloriesPer100: 0, bilkyPer100: 0, zhyryPer100: 0, vuglevodyPer100: 0 });
                            setEditId(null);
                            setFormMode('addFood');
                            setShowFormModal(true);
                        }}>+ Додати їжу</button>
                        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
                            + Додати рецепт
                        </button>
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
                                                setFoodForm({
                                                    name: item.name,
                                                    caloriesPer100: item.caloriesPer100,
                                                    bilkyPer100: item.bilkyPer100,
                                                    zhyryPer100: item.zhyryPer100,
                                                    vuglevodyPer100: item.vuglevodyPer100,
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
                        {allRecipes.
                        map(item => {
                            const portion = portions[item._id] || 1;
                            return (
                                <div className="col-md-4 mb-3" key={item._id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex flex-column">
                                            <h5>{item.name}</h5>
                                            <p className="small text-muted flex-grow-1">{item.description}</p>

                                            {item.authorId && (
                                                <p className="small text-muted mb-2">АВТОР: {item.authorId.login}</p>
                                            )}
                                            
                                            {item.ingredients && item.ingredients.length > 0 && (
                                                <div className="mb-2">
                                                    <small className="text-muted fw-bold">Інгредієнти:</small>
                                                    <ul className="list-unstyled mt-1 mb-0">
                                                        {item.ingredients.map((ing: any, i: number) => (
                                                            <li key={i} className="small d-flex justify-content-between">
                                                                <span>{ing.name}</span>
                                                                <span className="text-muted">{ing.gramsInPortion * portion}г — {Math.round(ing.calories100 * ing.gramsInPortion * portion / 100)} ккал</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="p-2 border rounded bg-light mb-2">
                                                <small className="text-muted fw-bold">На {portion} порц.:</small>
                                                <div className="d-flex gap-1 flex-wrap mt-1">
                                                    <span className="badge bg-warning text-dark">{Math.round(item.caloriesPer100 * portion)} ккал</span>
                                                    <span className="badge border text-dark">Б: {Math.round(item.bilkyPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">Ж: {Math.round(item.zhyryPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">В: {Math.round(item.vuglevodyPer100 * portion)}г</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-danger w-50" onClick={() => {
                                                    setDeleteTarget({ id: item._id, type: 'recipe' });
                                                    setShowDeleteModal(true);
                                                }}>Видалити</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div className="row">
                        {pendingRecipes.length === 0 && (
                            <p className="text-muted">Немає рецептів на модерацію</p>
                        )}
                        {pendingRecipes
                        .map(item => {
                            const portion = portions[item._id] || 1;
                            return (
                                <div className="col-md-4 mb-3" key={item._id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex flex-column">
                                            <h5>{item.name}</h5>
                                            <p className="small text-muted flex-grow-1">{item.description}</p>

                                            {item.authorId && (
                                                <p className="small text-muted mb-2">АВТОР: {item.authorId.login}</p>
                                            )}
                                            
                                            {item.ingredients && item.ingredients.length > 0 && (
                                                <div className="mb-2">
                                                    <small className="text-muted fw-bold">Інгредієнти:</small>
                                                    <ul className="list-unstyled mt-1 mb-0">
                                                        {item.ingredients.map((ing: any, i: number) => (
                                                            <li key={i} className="small d-flex justify-content-between">
                                                                <span>{ing.name}</span>
                                                                <span className="text-muted">{ing.gramsInPortion * portion}г — {Math.round(ing.calories100 * ing.gramsInPortion * portion / 100)} ккал</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="p-2 border rounded bg-light mb-2">
                                                <small className="text-muted fw-bold">На {portion} порц.:</small>
                                                <div className="d-flex gap-1 flex-wrap mt-1">
                                                    <span className="badge bg-warning text-dark">{Math.round(item.caloriesPer100 * portion)} ккал</span>
                                                    <span className="badge border text-dark">Б: {Math.round(item.bilkyPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">Ж: {Math.round(item.zhyryPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">В: {Math.round(item.vuglevodyPer100 * portion)}г</span>
                                                </div>
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
                            );
                        })}
                    </div>
                )}

                {showCreate && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', overflowY: 'auto' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <form onSubmit={handleCreateRecipe}>
                                    <div className="modal-header"><h5>Створення рецепта (на 1 порцію)</h5></div>
                                    <div className="modal-body">
                                        <input type="text" className="form-control mb-3" placeholder="Назва страви" required
                                            onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })} />
                                        <h6>Інгредієнти:</h6>
                                        {newRecipe.ingredients.map((ing, index) => (
                                            <div key={index} className="border p-2 mb-2 rounded bg-light">
                                                <input type="text" className="form-control form-control-sm mb-1" placeholder="Назва продукту"
                                                    onChange={e => handleInputChange(index, 'name', e.target.value)} />
                                                <div className="row g-2">
                                                    <div className="col-3"><input type="number" className="form-control form-control-sm" placeholder="Ккал/100г" onChange={e => handleInputChange(index, 'calories100', Number(e.target.value))} /></div>
                                                    <div className="col-2"><input type="number" className="form-control form-control-sm" placeholder="Б" onChange={e => handleInputChange(index, 'bilky100', Number(e.target.value))} /></div>
                                                    <div className="col-2"><input type="number" className="form-control form-control-sm" placeholder="Ж" onChange={e => handleInputChange(index, 'zhyry100', Number(e.target.value))} /></div>
                                                    <div className="col-2"><input type="number" className="form-control form-control-sm" placeholder="В" onChange={e => handleInputChange(index, 'vuglevody100', Number(e.target.value))} /></div>
                                                    <div className="col-3"><input type="number" className="form-control form-control-sm" placeholder="Грам у порції" onChange={e => handleInputChange(index, 'gramsInPortion', Number(e.target.value))} /></div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={addIngredientRow}>+ Додати інгредієнт</button>
                                        <button type="button" className="btn btn-sm btn-danger mt-2 ms-3" onClick={DelIngredientRow}>- Видалити інгредієнт</button>
                                        <textarea className="form-control mt-3" placeholder="Опис приготування" onChange={e => setNewRecipe({ ...newRecipe, description: e.target.value })} />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-light" onClick={() => setShowCreate(false)}>Скасувати</button>
                                        <button type="submit" className="btn btn-primary">Зберегти рецепт</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showFormModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {formMode === 'addFood' && 'Додати їжу'}
                                        {formMode === 'editFood' && 'Редагувати їжу'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {(formMode === 'addFood' || formMode === 'editFood') && (
                                        <>
                                            <div className="mb-2">
                                                <label className="form-label small">Назва</label>
                                                <input className="form-control" value={foodForm.name}
                                                    onChange={e => setFoodForm(prev => ({ ...prev, name: e.target.value }))} />
                                            </div>
                                            <div className="row g-2 mb-3">
                                                <div className="col-6">
                                                    <label className="form-label small">Ккал / 100г</label>
                                                    <input type="number" className="form-control" value={foodForm.caloriesPer100}
                                                        onChange={e => setFoodForm(prev => ({ ...prev, caloriesPer100: Number(e.target.value) }))} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label small">Білки</label>
                                                    <input type="number" className="form-control" value={foodForm.bilkyPer100}
                                                        onChange={e => setFoodForm(prev => ({ ...prev, bilkyPer100: Number(e.target.value) }))} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label small">Жири</label>
                                                    <input type="number" className="form-control" value={foodForm.zhyryPer100}
                                                        onChange={e => setFoodForm(prev => ({ ...prev, zhyryPer100: Number(e.target.value) }))} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label small">Вуглеводи</label>
                                                    <input type="number" className="form-control" value={foodForm.vuglevodyPer100}
                                                        onChange={e => setFoodForm(prev => ({ ...prev, vuglevodyPer100: Number(e.target.value) }))} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>Скасувати</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveForm}>
                                        {formMode === 'addFood' ? 'Додати' : 'Зберегти'}
                                    </button>
                                </div>
                            </div>
                        </div>
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