import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getContractors } from '../api/contractors';
import { getObjects } from '../api/objects';
import { getContracts, getFilteredContracts } from '../api/contracts';
import { getPrices } from '../api/prices';
import { getOperations } from '../api/operation';
import { getResources } from '../api/resource';
import { getArticles } from '../api/article';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import TreeView from '../components/TreeView';
import './MainPage.css';

function MainPage() {
  const [contractors, setContractors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [operations, setOperations] = useState([]);
  const [resources, setResources] = useState([]);
  const [articles, setArticles] = useState([]);

  // Отфильтрованные справочники для отображения
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);

  const [filters, setFilters] = useState({
    operation_id: '',
    resource_id: '',
    article_id: '',
    object_id: '',
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // Загрузка справочников и данных при старте
  useEffect(() => {
    Promise.all([
      getContractors(),
      getObjects(),
      getPrices(),
      getOperations(),
      getResources(),
      getArticles(),
    ]).then(([contrs, objs, prcs, ops, ress, arts]) => {
      setContractors(contrs);
      setObjects(objs);
      setPrices(prcs);
      setOperations(ops);
      setResources(ress);
      setArticles(arts);

      // Изначально показываем все
      setFilteredContractors(contrs);
      setFilteredObjects(objs);
      setFilteredPrices(prcs);
    });
  }, []);

  // Загрузка договоров и фильтрация справочников при изменении фильтров
  useEffect(() => {
    if (!contractors.length || !objects.length || !prices.length) return;

    const hasFilters =
      filters.operation_id ||
      filters.resource_id ||
      filters.article_id ||
      filters.object_id;

    const filterPayload = {};
    if (filters.operation_id) filterPayload.operation_id = parseInt(filters.operation_id);
    if (filters.resource_id) filterPayload.resource_id = parseInt(filters.resource_id);
    if (filters.article_id) filterPayload.article_id = parseInt(filters.article_id);
    if (filters.object_id) filterPayload.object_id = parseInt(filters.object_id);

    const fetchContracts = hasFilters
      ? getFilteredContracts(filterPayload)
      : getContracts();

    fetchContracts.then((contractsData) => {
      setContracts(contractsData);

      if (!hasFilters) {
        // Показываем все при отсутствии фильтров
        setFilteredContractors(contractors);
        setFilteredObjects(objects);
        setFilteredPrices(prices);
        return;
      }

      // Фильтруем справочники по выбранным договорам
      const contractorIds = new Set(contractsData.map(c => c.contractor_id));
      const objectIds = new Set(contractsData.map(c => c.object_id));
      const contractIds = new Set(contractsData.map(c => c.id));

      setFilteredContractors(contractors.filter(c => contractorIds.has(c.id)));
      setFilteredObjects(objects.filter(o => objectIds.has(o.id)));
      setFilteredPrices(prices.filter(p => contractIds.has(p.contract_id)));
    });
  }, [filters, contractors, objects, prices]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      operation_id: '',
      resource_id: '',
      article_id: '',
      object_id: '',
    });
  };

  return (
    <div className="main-page">
      <div className="filters-panel">
        <h3>Фильтрация</h3>
        <div className="filters-row">
          <select name="operation_id" value={filters.operation_id} onChange={handleFilterChange}>
            <option value="">Все операции</option>
            {operations.map(op => (
              <option key={op.id} value={op.id}>{op.operation_name}</option>
            ))}
          </select>

          <select name="resource_id" value={filters.resource_id} onChange={handleFilterChange}>
            <option value="">Все ресурсы</option>
            {resources.map(res => (
              <option key={res.id} value={res.id}>{res.resource_name}</option>
            ))}
          </select>

          <select name="article_id" value={filters.article_id} onChange={handleFilterChange}>
            <option value="">Все статьи</option>
            {articles.map(art => (
              <option key={art.id} value={art.id}>{art.article_name}</option>
            ))}
          </select>

          <select name="object_id" value={filters.object_id} onChange={handleFilterChange}>
            <option value="">Все объекты</option>
            {objects.map(obj => (
              <option key={obj.id} value={obj.id}>{obj.name}</option>
            ))}
          </select>

          <button onClick={resetFilters}>Сбросить фильтры</button>
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
          <div className="sidebar-section">
            <h4>Контрагенты</h4>
            <div className="scrollable-list">
              <TreeView data={filteredContractors} />
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Объекты</h4>
            <div className="scrollable-list">
              <TreeView data={filteredObjects} />
            </div>
          </div>
        </div>

        <div className="center-panel">
          <div className="contracts-section">
            <h3>Договоры</h3>
            <div className="scrollable-table">
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
                      <td><Link to={`/contract/${contract.id}`}>{contract.number_c}</Link></td>
                      <td>{contract.name}</td>
                      <td>{contract.valid_from?.split('T')[0]}</td>
                      <td>{contract.valid_to?.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="prices-section">
            <div className="prices-table">
              <h3>Цены по договору</h3>
              <div className="scrollable-table">
                <table>
                  <thead>
                    <tr>
                      <th>Действует с</th>
                      <th>Действует по</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.map(p => (
                      <tr key={p.id}>
                        <td>{p.valid_from?.split('T')[0]}</td>
                        <td>{p.valid_to?.split('T')[0]}</td>
                        <td>{p.price} руб.</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="prices-graph">
              <h3>График</h3>
              <div className="scrollable-table">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={filteredPrices.map(p => ({
                      date: p.valid_from?.split('T')[0],
                      price: p.price,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#1976d2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
