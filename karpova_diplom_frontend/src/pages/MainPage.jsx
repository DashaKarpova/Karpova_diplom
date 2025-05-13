import React, { useEffect, useState } from 'react';
import { getContractors } from '../api/contractors';
import { getObjects } from '../api/objects';
import { getContracts } from '../api/contracts';
import { getPrices } from '../api/prices';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './MainPage.css'; // отдельно сделаем стили
import { useNavigate } from 'react-router-dom';
import TreeView from '../components/TreeView';

function MainPage() {
  const [contractors, setContractors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [prices, setPrices] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload(); 
  };

  useEffect(() => {
    getContractors().then(setContractors);
    getObjects().then(setObjects);
    getContracts().then(setContracts);
    getPrices().then(setPrices);
  }, []);

  return (
    <div className="main-page">
      <div className="filters-panel">
        <h3>Фильтрация (статическая)</h3>
        <div className="filters-row">
          <select><option>по всем договорам</option></select>
          <select><option>Операция</option></select>
          <select><option>по всем</option></select>
          <select><option>по всем</option></select>
          <select><option>по всем</option></select>
          <button>Сбросить фильтры</button>
          <button>Загрузка в отчёт</button>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={() => navigate('/create')} className="create-button">
          Создать договор
        </button>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <h4>Контрагенты</h4>
          <TreeView data={contractors} />

          <h4>Объекты</h4>
          <TreeView data={objects} />
        </div>

        <div className="center-panel">
          <h3>Договоры</h3>
          <table>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Наименование</th>
                <th>Дата с</th>
                <th>Дата по</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(contract => (
                <tr key={contract.id}>
                  <td>{contract.number_c}</td>
                  <td>{contract.name}</td>
                  <td>{contract.valid_from?.split('T')[0]}</td>
                  <td>{contract.valid_to?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Цены по договору</h3>
          <table>
            <thead>
              <tr>
                <th>Действует с</th>
                <th>Действует по</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {prices.map(p => (
                <tr key={p.id}>
                  <td>{p.valid_from?.split('T')[0]}</td>
                  <td>{p.valid_to?.split('T')[0]}</td>
                  <td>{p.price} руб.</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>График</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prices.map(p => ({
              date: p.valid_from?.split('T')[0],
              price: p.price
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="price" />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
