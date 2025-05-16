import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPrice } from '../api/prices'; // <-- не забудь создать файл
import './ContractForm.css';

function CreatePrices() {
const navigate = useNavigate();
const { id: contractId } = useParams();

const initialForm = {
    price: '',
    valid_from: '',
    valid_to: '',
    contract_id: contractId
};

const [form, setForm] = useState(initialForm);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await createPrice(form);
    setIsModalOpen(true);
    } catch (error) {
    console.error('Ошибка при создании цены:', error);
    alert('Произошла ошибка при сохранении цены');
    }
};

const handleCancel = () => {
    setForm(initialForm);
};

const closeModal = () => {
    setIsModalOpen(false);
};

return (
    <div className="contract-form-container">
    <form className="contract-form" onSubmit={handleSubmit}>
        <h2>Создание цены</h2>

        <div className="form-columns">
        <div className="form-column">
            <label>
            Цена:
            <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
            />
            </label>

            <label>
            Дата начала действия:
            <input
                type="date"
                name="valid_from"
                value={form.valid_from}
                onChange={handleChange}
                required
            />
            </label>

            <label>
            Дата окончания действия:
            <input
                type="date"
                name="valid_to"
                value={form.valid_to}
                onChange={handleChange}
                required
            />
            </label>
        </div>
        </div>

        <div className="form-meta">
        Изменено: {new Date().toLocaleString('ru-RU')}<br />
        Изменил: {localStorage.getItem('fullName')}
        </div>

        <div className="form-actions">
        <button type="submit" className="create-button">Сохранить</button>
        <button type="button" onClick={handleCancel} className="cancel-button">Отмена</button>
        <button type="button" onClick={() => navigate(-1)} className="back-button">Вернуться в договор</button>
        <button type="button" onClick={() => navigate('/main')} className="go-to-main-button">Вернуться на главную</button>
        </div>
    </form>

    {isModalOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
            <h3>Цена успешно сохранена!</h3>
            <button onClick={closeModal} className="close-modal-btn">Закрыть</button>
        </div>
        </div>
    )}
    </div>
);
}

export default CreatePrices;
