import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
// import Footer from '../components/Footer';
import '../css/Main.css';

const Recipes = () => {
    const { token } = useContext(AuthContext);
    const [recepty, setRecepty] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'system' | 'community'>('system');
    const [showCreate, setShowCreate] = useState(false);
    const [selections, setSelections] = useState<{ [key: string]: {foodType: string } }>({});
    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        ingredients: [
            { name: '', calories100: 0, bilky100: 0, zhyry100: 0, vuglevody100: 0, gramsInPortion: 100 }
        ]
    });
    const [portions, setPortions] = useState<{ [key: string]: number }>({});

    const headers = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }), [token]);

    const fetchRecipes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipes', {
                method: 'GET',
                headers
            });

            const data = await response.json();
            if (response.ok) {
                setRecepty(data.recipes);
            } else {
                console.error("помилка завантаження:", data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const addIngredientRow = () => {
        setNewRecipe({
            ...newRecipe,
            ingredients: [
                ...newRecipe.ingredients,
                { name: '', calories100: 0, bilky100: 0, zhyry100: 0, vuglevody100: 0, gramsInPortion: 0 }
            ]
        });
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
            caloriesPer100: Math.round(totalCal), 
            bilkyPer100: Math.round(totalB),
            zhyryPer100: Math.round(totalZ),
            vuglevodyPer100: Math.round(totalV),
            ingredients: newRecipe.ingredients,
            isPublic: true
        };

        try {
            const response = await fetch('http://localhost:5000/api/recipes/create', {
                method: 'POST',
                headers,
                body: JSON.stringify(recipeToSave)
            });
            const result = await response.json();

            if (response.ok) {
                setShowCreate(false);
                fetchRecipes();
            } else {
                console.error('помилка на сервері', result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectionChange = (recipeId: string, field: string, value: any) => {
        setSelections(prev => ({
            ...prev,
            [recipeId]: {
                ...(prev[recipeId] || { grams: 100, foodType: 'snidanok' }),
                [field]: value
            }
        }));
    };

    const addRecipeToDiary = async (recipeId: string) => {
        const selection = selections[recipeId] || { grams: 100, foodType: 'snidanok' };
        const portion = portions[recipeId] || 1;

        try {
            const response = await fetch("http://localhost:5000/api/meals/add-recipe", {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    recipeId,
                    FoodType: selection.foodType,
                    portions: portion
                })
            });

            const result = await response.json();
            if (response.ok) {
                fetchRecipes();
            } else { 
                console.error('помилка створення рецепту:', result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Рецепти</h2>
                    <button className="btn btn-success" onClick={() => setShowCreate(true)}>+ Запропонувати рецепт</button>
                </div>

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>Системні</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>Користувацькі</button>
                    </li>
                </ul>

                <div className="row">
                    {recepty
                        .filter(r => (activeTab === 'system' ? !r.authorId : r.authorId))
                        .map(r => {
                            const current = selections[r._id] || { foodType: 'snidanok' };
                            const portion = portions[r._id] || 1;

                            return (
                                <div className="col-md-4 mb-3" key={r._id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex flex-column">
                                            <h5>{r.name}</h5>
                                            <p className="small text-muted flex-grow-1">{r.description}</p>

                                            {r.authorId && (
                                                <p className="small text-muted mb-2">АВТОР: {r.authorId.login}</p>
                                            )}

                                            {r.ingredients && r.ingredients.length > 0 && (
                                                <div className="mb-2">
                                                    <small className="text-muted fw-bold">Інгредієнти:</small>
                                                    <ul className="list-unstyled mt-1 mb-0">
                                                        {r.ingredients.map((ing: any, i: number) => (
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
                                                    <span className="badge bg-warning text-dark">{Math.round(r.caloriesPer100 * portion)} ккал</span>
                                                    <span className="badge border text-dark">Б: {Math.round(r.bilkyPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">Ж: {Math.round(r.zhyryPer100 * portion)}г</span>
                                                    <span className="badge border text-dark">В: {Math.round(r.vuglevodyPer100 * portion)}г</span>
                                                </div>
                                            </div>

                                            <div className="p-2 border rounded bg-light">
                                                <div className="row g-1 mb-2">
                                                    <div className="col-5">
                                                        <label className="form-label small mb-1">Порцій:</label>
                                                        <input type="number" className="form-control form-control-sm" min={1} max={10} value={portion} onChange={e => setPortions(prev => ({
                                                             ...prev, [r._id]: Number(e.target.value) }))} />
                                                    </div>
                                                    <div className="col-7">
                                                        <label className="form-label small mb-1">Прийом їжі:</label>
                                                        <select className="form-select form-select-sm"
                                                            value={current.foodType} onChange={e => handleSelectionChange(r._id, 'foodType', e.target.value)}>
                                                            <option value="snidanok">Сніданок</option>
                                                            <option value="obid">Обід</option>
                                                            <option value="vecherya">Вечеря</option>
                                                            <option value="poludenok">Полуденок</option>
                                                            <option value="perekus">Перекус</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <button className="btn btn-sm btn-outline-success w-100" onClick={() => addRecipeToDiary(r._id)}>
                                                    Додати в щоденник 
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

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
            </div>
        </>
    );
};

export default Recipes;