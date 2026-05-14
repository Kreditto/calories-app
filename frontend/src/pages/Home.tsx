import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './css/Main.css';

const Home = () => {
    const { token, role } = useContext(AuthContext) as any;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedFood, setSelectedFood] = useState<any | null>(null);
    const [grams, setGrams] = useState<number>(100);
    const [typPriyomu, setTypPriyomu] = useState('snidanok');
    const [vsiZapysy, setVsiZapysy] = useState<any[]>([]);
    const [sumaKaloriy, setSumaKaloriy] = useState(0);
    const [calories, setCalories] = useState(0);
    const [istoriya, setIstoriya] = useState<any[]>([]); 

    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editData, setEditData] = useState<{ id: string, grams: number } | null>(null);

    const [newFood, setNewFood] = useState({
        name: '', caloriesPer100: 0, bilkyPer100: 0, zhyryPer100: 0, vuglevodyPer100: 0
    });

    const headers = useMemo(() => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
    }), [token]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1 && !selectedFood) {
                try {
                    const res = await fetch(`http://localhost:5000/api/food/search?q=${searchTerm}`, { 
                        headers 
                    });
                    if (res.ok) setSearchResults(await res.json());
                } catch (e) { console.error(e); }
            } else {
                setSearchResults([]);
            }
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedFood, headers]);

    const downloadDani = useCallback(async () => {
        try {
            const [resStat, resHistory] = await Promise.all([
                fetch('http://localhost:5000/api/meals/stats', { 
                    headers
                 }),
                fetch('http://localhost:5000/api/meals/history', { 
                    headers 
                })
            ]);

            if (resStat.ok) {
                const statData = await resStat.json();
                setVsiZapysy(statData.zapysy || []);
                setSumaKaloriy(statData.sumaKaloriy || 0);
                if (statData.tsil && statData.tsil.calories > 0) {
                    setCalories(statData.tsil.calories);
                } else {
                    setCalories(0); 
                }
            }
            if (resHistory.ok) {
                const historyData = await resHistory.json();
                setIstoriya(Array.isArray(historyData) ? historyData : historyData.history || []);
            }
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    useEffect(() => { 
        if (token) downloadDani(); 
    }, [downloadDani]);

    const dodatyYizhu = async () => {
        if (!selectedFood || grams <= 0) return;
        const res = await fetch('http://localhost:5000/api/meals/add', {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
                foodId: selectedFood._id, 
                grams, 
                FoodType: typPriyomu 
            })
        });
        if (res.ok) {
            resetForm();
            downloadDani();
        }
    };

    const handleAddCustomFood = async () => {
        if (!newFood.name || newFood.caloriesPer100 < 0) return;
        const res = await fetch('http://localhost:5000/api/food/add', {
            method: 'POST', 
            headers, 
            body: JSON.stringify(newFood)
        });
        if (res.ok) {
            setShowModal(false);
            setSearchTerm(newFood.name);
            setNewFood({ name: '', caloriesPer100: 0, bilkyPer100: 0, zhyryPer100: 0, vuglevodyPer100: 0 });
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const res = await fetch(`http://localhost:5000/api/meals/${deleteId}`, { 
            method: 'DELETE',
            headers 
        });
        if (res.ok) {
            setDeleteId(null);
            downloadDani();
        }
    };

    const saveEdit = async () => {
        if (!editData || editData.grams <= 0) return;
        const res = await fetch(`http://localhost:5000/api/meals/${editData.id}`, {
            method: 'PUT', 
            headers, 
            body: JSON.stringify({ 
                grams: editData.grams 
            })
        });
        if (res.ok) {
            setEditData(null);
            downloadDani();
        }
    };

    const resetForm = () => {
        setSearchTerm(''); 
        setSelectedFood(null); 
        setGrams(100); 
        setSearchResults([]);
    };

    const formatType = (type: string) => {
        const types: Record<string, string> = {
            snidanok: 'Сніданок', obid: 'Обід', vecherya: 'Вечеря', poludenok: 'Полуденок', perekus: 'Перекус'
        };
        return types[type] || type;
    };

    const mealCategories = ['snidanok', 'obid', 'vecherya'];
    if (role === 'premium') mealCategories.push('poludenok', 'perekus');

    return (
        <>
            <Navbar />
            <div className="container mt-5 mb-5">
                <h1 className="mb-4 text-center">Мій Щоденник</h1>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="alert alert-dark text-center shadow-sm h-100 d-flex flex-column justify-content-center">
                            <span>Всього сьогодні:</span>
                            <strong className="fs-3">
                                {sumaKaloriy} / {calories > 0 ? calories : '—'}
                            </strong> ккал
                        </div>
                    </div>
                    <div className="col-md-6 mb-3 text-center">
                        <div className={`alert ${sumaKaloriy > calories && calories > 0 ? 'alert-danger' : 'alert-success'} shadow-sm h-100 d-flex align-items-center justify-content-center`}>
                            {sumaKaloriy > calories && calories > 0 ? 'Перебір калорій!' : (sumaKaloriy > 0 ? 'Ви в межах норми!' : 'Почніть день з корисного сніданку!')}
                        </div>
                    </div>
                </div>

                <div className="card p-4 mb-5 shadow-sm border-success">
                    <h3 className="mb-3 text-success">Додати продукт</h3>
                    <div className="mb-3 position-relative">
                        <label htmlFor="food-search" className="form-label text-muted small">Пошук продукту</label>
                        <input 
                            id="food-search"
                            className="form-control form-control-lg" 
                            placeholder="Напр. Курка"
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value ?? '');if (selectedFood) setSelectedFood(null);}}
                        />
                        
                        {searchResults.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow search-results-list" style={{ zIndex: 1000 }}>
                                {searchResults.map(f => (
                                    <li key={f._id} className="list-group-item list-group-item-action d-flex justify-content-between"
                                        onClick={() => { setSelectedFood(f); setSearchTerm(f.name); setSearchResults([]); }} style={{ cursor: 'pointer' }}>
                                        <span>{f.name}</span><small>{f.caloriesPer100} ккал</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {selectedFood && (
                        <div className="row mb-3">
                            <div className="col-8">
                                <label htmlFor="grams-input" className="form-label text-muted">Вага (г)</label>
                                <input 
                                    id="grams-input"
                                    type="number" 
                                    className="form-control" 
                                    value={grams} 
                                    onChange={e => setGrams(Number(e.target.value))} 
                                    placeholder="100"
                                />
                            </div>
                            <div className="col-4 d-flex align-items-end text-success fw-bold pb-2">
                                ≈ {Math.round((selectedFood.caloriesPer100 * grams) / 100)} ккал
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="meal-type-select" className="form-label text-muted fw-bold">Прийом їжі</label>
                        <select 
                            id="meal-type-select"
                            className="form-select" 
                            value={typPriyomu} 
                            onChange={e => setTypPriyomu(e.target.value)}
                        >
                            {mealCategories.map(cat => (
                                <option key={cat} value={cat}>{formatType(cat)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-success flex-grow-1 fw-bold" onClick={dodatyYizhu}>Додати</button>
                        <button className="btn btn-outline-secondary" onClick={resetForm} aria-label="Скинути форму"> ✕ </button>
                    </div>
                    <button className="btn btn-link btn-sm mt-3 text-secondary" onClick={() => setShowModal(true)}>
                        + Немає в списку? Додати свій продукт
                    </button>
                </div>

                <h3 className="mb-3 text-secondary">Сьогоднішнє меню</h3>
                
                {mealCategories.map(cat => {
                    const meals = vsiZapysy.filter(z => z.FoodType === cat);
                    const catCalories = meals.reduce((sum, item) => sum + item.calculatedCalories, 0);

                    return (
                        <div key={cat} className="mb-4 shadow-sm rounded border p-3 bg-white">
                            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                <h5 className="text-success m-0">{formatType(cat)}</h5>
                                <span className="fw-bold">{catCalories} ккал</span>
                            </div>
                            
                            {meals.length === 0 ? (
                                <div className="text-muted small py-2">Немає записів</div>
                            ) : (
                                <table className="table table-sm table-borderless align-middle mb-0">
                                    <caption className="visually-hidden">Список страв для {formatType(cat)}</caption>
                                    <tbody>
                                        {meals.map(z => (
                                            <tr key={z._id} className="border-bottom">
                                                <td className="w-50">{z.foodId?.name || z.recipeId?.name}</td>
                                                {z.recipeId 
                                                    ? `${z.portions} порц.` 
                                                    : `${z.grams}г`
                                                }
                                                <td>{z.calculatedVuglevody} Вуглеводів</td>
                                                <td>{z.calculatedBilky} Білків</td>
                                                <td>{z.calculatedZhyry} Жирів</td>
                                                <td className="fw-bold text-end">{z.calculatedCalories} ккал</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-link text-primary p-0 me-3" onClick={() => setEditData({ id: z._id, grams: z.grams })}>Ред</button>
                                                    <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setDeleteId(z._id)}>Вид</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    );
                })}

                <h3 className="mb-3 text-primary mt-5">Історія активності</h3>
                <div className="row">
                    {istoriya.length === 0 ? <p className="text-muted text-center">Тут з'являться ваші минулі дні...</p> : 
                        istoriya.map(den => (
                            <div key={den._id} className="col-md-3 mb-3">
                                <div className="card shadow-sm border-primary text-center p-3 h-100">
                                    <div className="small text-muted">{den._id}</div>
                                    <div className="fw-bold fs-5 text-primary">{den.vsogo_kkal} ккал</div>
                                    <div className="small text-secondary">{den.kilkist_pryyomiv} прийомів</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {showModal && (
                <div className="custom-modal-overlay shadow" role="dialog">
                    <div className="custom-modal-content card shadow-lg p-4">
                        <h4 className="text-success mb-3">Новий продукт (на 100г у сирому виді)</h4>
                        <div className="mb-2">
                            <label className="form-label small">Назва</label>
                            <input className="form-control" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} />
                        </div>
                        <div className="row g-2 mb-3">
                            <div className="col-6">
                                <label className="form-label small">Ккал</label>
                                <input type="number" className="form-control" value={newFood.caloriesPer100} onChange={e => setNewFood({...newFood, caloriesPer100: Number(e.target.value)})} />
                            </div>
                            <div className="col-6">
                                <label className="form-label small">Білки</label>
                                <input type="number" className="form-control" value={newFood.bilkyPer100} onChange={e => setNewFood({...newFood, bilkyPer100: Number(e.target.value)})} />
                            </div>
                            <div className="col-6">
                                <label className="form-label small">Жири</label>
                                <input type="number" className="form-control" value={newFood.zhyryPer100} onChange={e => setNewFood({...newFood, zhyryPer100: Number(e.target.value)})} />
                            </div>
                            <div className="col-6">
                                <label className="form-label small">Вуглеводи</label>
                                <input type="number" className="form-control" value={newFood.vuglevodyPer100} onChange={e => setNewFood({...newFood, vuglevodyPer100: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-success w-100" onClick={handleAddCustomFood}>Створити</button>
                            <button className="btn btn-light w-100" onClick={() => setShowModal(false)}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="custom-modal-overlay shadow">
                    <div className="custom-modal-content card p-4 text-center">
                        <h4 className="mb-4">Видалити запис?</h4>
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn btn-danger w-50" onClick={confirmDelete}>Видалити</button>
                            <button className="btn btn-light w-50" onClick={() => setDeleteId(null)}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}

            {editData && (
                <div className="custom-modal-overlay shadow">
                    <div className="custom-modal-content card p-4 text-center">
                        <h4 className="mb-3">Змінити вагу (г)</h4>
                        <input 
                            type="number" 
                            className="form-control mb-4" 
                            value={editData.grams} 
                            onChange={e => setEditData({ ...editData, grams: Number(e.target.value) })}
                        />
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn btn-primary w-50" onClick={saveEdit}>Зберегти</button>
                            <button className="btn btn-light w-50" onClick={() => setEditData(null)}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;