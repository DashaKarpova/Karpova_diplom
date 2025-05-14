import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getObjects } from '../api/objects';
import TreeView from '../components/TreeView';
import './ObjectPage.css';

function ObjectsPage() {
const [objects, setObjects] = useState([]);
const [selectedIds, setSelectedIds] = useState(new Set());
const navigate = useNavigate();

useEffect(() => {
    getObjects().then(data => setObjects(data));
}, []);

const handleCheck = (id, checked) => {
    setSelectedIds(prev => {
    const newSet = new Set(prev);
    checked ? newSet.add(id) : newSet.delete(id);
    return newSet;
    });
};

const handleSubmit = () => {
    console.log('Selected IDs:', Array.from(selectedIds));
    // Здесь логика сохранения
};

return (
    <div className="objects-page">
    <h2>Выбор объектов</h2>
    <div className="scrollable-tree">
        <TreeView 
        data={objects} 
        showCheckbox={true}
        showHierarchy={true}
        onCheck={handleCheck}
        />
    </div>
    <div className="form-actions">
        <button onClick={handleSubmit}>Сохранить</button>
        <button onClick={() => window.history.back()}>Отменить</button>
        <button onClick={() => navigate('/main')}>Вернуться на главную</button>
    </div>
    </div>
);
}

export default ObjectsPage;