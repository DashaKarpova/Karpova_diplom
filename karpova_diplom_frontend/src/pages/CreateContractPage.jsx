import React, { useEffect, useState } from 'react';
import { getContractors } from '../api/contractors';
import { getLicenses } from '../api/license';
import { getObjects } from '../api/objects';  // Добавляем импорт для объектов
import { createContract } from '../api/contracts';
import { useNavigate } from 'react-router-dom';
import './ContractForm.css';
import CheckAdminAccess from '../utils/checkAdminAccess'; 

function CreateContractPage() {
  const [contractors, setContractors] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [objects, setObjects] = useState([]);  // Состояние для объектов
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    number_c: '',
    valid_from: '',
    valid_to: '',
    contractor_id: '',
    object_id: '',  // Добавлено для объекта
    license_number: '',
    license_date: '',
    authority: '',
    user_id: localStorage.getItem('userId'),
    finished: false,
  });


  useEffect(() => {
    getContractors().then(setContractors);
    getLicenses().then(setLicenses);
    getObjects().then(setObjects);  // Получаем список объектов
  }, []);

  const isAdmin = JSON.parse(localStorage.getItem('admin_role'));
  
  if (!isAdmin) {
      return <CheckAdminAccess />;
  }
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { /* file, */ ...formWithoutFile } = form; // исключаем file
    await createContract(formWithoutFile);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setForm({
      name: '',
      number_c: '',
      valid_from: '',
      valid_to: '',
      contractor_id: '',
      object_id: '',  // Очистка объекта
      license_number: '',
      license_date: '',
      authority: '',
      user_id: localStorage.getItem('userId'),
      finished: false,
    });
  };

  const handleGoToMain = () => {
    navigate('/main');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  

  return (
    <div className="contract-form-container">
      <form className="contract-form" onSubmit={handleSubmit}>
        <h2>Создание договора</h2>

        <label>
          <input type="checkbox" name="finished" checked={form.finished} onChange={handleChange} />
          Закончил действие
        </label>

        <label>
          Наименование:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Номер:
          <input name="number_c" value={form.number_c} onChange={handleChange} />
        </label>

        <label>
          Действует с:
          <input type="date" name="valid_from" value={form.valid_from} onChange={handleChange} />
        </label>

        <label>
          Действует по:
          <input type="date" name="valid_to" value={form.valid_to} onChange={handleChange} />
        </label>

        <label>
          Контрагент:
          <select name="contractor_id" value={form.contractor_id} onChange={handleChange}>
            <option value="">Выберите контрагента</option>
            {contractors.map(c => (
              <option key={c.id} value={c.id}>{c.fullname}</option>
            ))}
          </select>
        </label>

        {/* Добавляем выбор объекта */}
        <label>
          Объект:
          <select name="object_id" value={form.object_id} onChange={handleChange}>
            <option value="">Выберите объект</option>
            {objects.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </label>

        <label>
          Номер лицензии:
          <input name="license_number" value={form.license_number} onChange={handleChange} />
        </label>

        <label>
          Дата выдачи лицензии:
          <input type="date" name="license_date" value={form.license_date} onChange={handleChange} />
        </label>

        <label>
          Орган выдавший лицензию:
          <select name="authority" value={form.authority} onChange={handleChange}>
            <option value="">Выберите орган</option>
            {licenses.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>

        <div className="form-meta">
          Изменено: {new Date().toLocaleString('ru-RU')}<br />
          Изменил: {localStorage.getItem('fullName')}
        </div>

        <div className="form-actions">
          <button type="submit">Сохранить</button>

          <button type="button" onClick={handleCancel} className="cancel-button">
            Отмена
          </button>

          <button type="button" onClick={handleGoToMain} className="go-to-main-button">
            Вернуться на главную
          </button>
        </div>

      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Договор успешно создан!</h3>
            <button onClick={closeModal} className="close-modal-btn">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateContractPage;
