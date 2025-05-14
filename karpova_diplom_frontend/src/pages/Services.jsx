import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

function ServicesPage() {
const navigate = useNavigate();

const initialForm = {
    service: "",
    resource: "",
    article: "",
    unit: "",
    name: "",
};

const [form, setForm] = useState(initialForm);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
};

const handleCancel = () => setForm(initialForm);

const handleGoToMain = () => {
    navigate('/main');
};

const closeModal = () => {
    setIsModalOpen(false);
    navigate('/main');
};

return (
    <div className="main-page">
    <div className="center-panel form-wrapper">
        <form className="contract-form" onSubmit={handleSubmit}>
        <h2>Управление услугами</h2>

        <div className="filters-row column">
            {[
            { label: 'Услуга', name: 'service', type: 'input' },
            { label: 'Ресурс', name: 'resource', type: 'select', options: ['Выберите ресурс','Природный газ', 'Нефть', 'Уголь'] },
            { label: 'Статья', name: 'article', type: 'input' },
            { label: 'Единица измерения', name: 'unit', type: 'input' },
            { label: 'Наименование (необязательное)', name: 'name', type: 'input' }
            ].map(({ label, name, type, options }) => (
            <label key={name} htmlFor={name} className="form-label">
                {label}:
                {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="form-input"
                >
                    {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                ) : (
                <input
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="form-input"
                />
                )}
            </label>
            ))}
        </div>

        <div className="form-meta">
            Изменено: {new Date().toLocaleString('ru-RU')}<br />
            Изменил: {localStorage.getItem('fullName') }
        </div>
        <div className="form-actions">
            <button type="submit" className="create-button">Сохранить</button>
            <button type="button" onClick={handleCancel} className="logout-button">Отмена</button>
            <button type="button" onClick={handleGoToMain} className="go-to-main-button">Вернуться на главную</button>
        </div>
        </form>

        {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
            <h3>Данные успешно сохранены!</h3>
            <button onClick={closeModal} className="create-button" style={{ marginTop: '15px' }}>
                Закрыть
            </button>
            </div>
        </div>
        )}
    </div>
    </div>
);
}

export default ServicesPage;
