import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResources } from '../api/resource';
import { getArticles } from '../api/article';
import { getOperations } from '../api/operation';
import { createService } from '../api/services';
import './ContractForm.css';

function ServicesPage() {
const navigate = useNavigate();
  const { id: contractId } = useParams(); // <-- получаем ID договора из URL

const [resources, setResources] = useState([]);
const [articles, setArticles] = useState([]);
const [operations, setOperations] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const initialForm = {
    operation_id: '',
    resource_id: '',
    article_id: '',
    unit_of_measurement: '',
    name: '',
    aim: '',
    user_id: localStorage.getItem('userId'),
    contract_id: contractId // <-- передаём как часть тела и для запроса
};

const [form, setForm] = useState(initialForm);

useEffect(() => {
    const fetchData = async () => {
    try {
        const [resData, artData, opData] = await Promise.all([
        getResources(),
        getArticles(),
        getOperations()
        ]);
        setResources(resData);
        setArticles(artData);
        setOperations(opData);
        setLoading(false);
    } catch (err) {
        setError(err.message);
        setLoading(false);
    }
    };

    fetchData();
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createService(form); // <-- вызов с корректным contract_id
    setIsModalOpen(true);
    } catch (error) {
    console.error('Ошибка сохранения услуги:', error);
    alert('Произошла ошибка при сохранении услуги');
    }
};

const handleCancel = () => {
    setForm(initialForm);
};

const closeModal = () => {
    setIsModalOpen(false);
};

if (loading) return <div className="contract-form-container">Загрузка данных...</div>;
if (error) return <div className="contract-form-container">Ошибка: {error}</div>;

return (
    <div className="contract-form-container">
    <form className="contract-form" onSubmit={handleSubmit}>
        <h2>Управление услугами</h2>

        <div className="form-columns">
        <div className="form-column">
            <label>
            Операция:
            <select name="operation_id" value={form.operation_id} onChange={handleChange} required>
                <option value="">Выберите операцию</option>
                {operations.map((op) => (
                <option key={op.id} value={op.id}>{op.operation_name}</option>
                ))}
            </select>
            </label>

            <label>
            Ресурс:
            <select name="resource_id" value={form.resource_id} onChange={handleChange} required>
                <option value="">Выберите ресурс</option>
                {resources.map((res) => (
                <option key={res.id} value={res.id}>{res.resource_name}</option>
                ))}
            </select>
            </label>

            <label>
            Статья:
            <select name="article_id" value={form.article_id} onChange={handleChange} required>
                <option value="">Выберите статью</option>
                {articles.map((art) => (
                <option key={art.id} value={art.id}>{art.article_name}</option>
                ))}
            </select>
            </label>
        </div>

        <div className="form-column">
            <label>
            Единица измерения:
            <input type="text" name="unit_of_measurement" value={form.unit_of_measurement} onChange={handleChange} required />
            </label>

            <label>
            Наименование:
            <input type="text" name="name" value={form.name} onChange={handleChange} />
            </label>

            <label>
            Цель:
            <input type="text" name="aim" value={form.aim} onChange={handleChange} required />
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
        <button type="button" onClick={() => navigate(-1)} className="back-button"> Вернуться в договор</button>
        <button type="button" onClick={() => navigate('/main')} className="go-to-main-button">Вернуться на главную</button>
        </div>
    </form>

    {isModalOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
            <h3>Данные успешно сохранены!</h3>
            <button onClick={closeModal} className="close-modal-btn">Закрыть</button>
        </div>
        </div>
    )}
    </div>
);
}

export default ServicesPage;
