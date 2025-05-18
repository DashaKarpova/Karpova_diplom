import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/ContractForm.css';

export default function CheckAdminAccess() {
const navigate = useNavigate();

return (
    <div className="modal-overlay">
    <div className="modal-content">
        <h3>Доступ запрещен</h3>
        <p>У вас нет прав для создания данного раздела.</p>
        <button
        type="button"
        onClick={() => navigate(-1)}
        className="close-modal-btn"
        >
        Вернуться назад
        </button>
    </div>
    </div>
);
}
