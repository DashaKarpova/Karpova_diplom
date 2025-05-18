import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContractDetails.css';

const getServicesByContract = async (contractId) => {
  const response = await axios.get(`/api/services/by-contract/${contractId}`);
  return response.data;
};

function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingContract, setLoadingContract] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    setLoadingContract(true);
    axios.get(`/api/contracts/${id}`)
      .then(response => setContract(response.data))
      .catch(err => console.error('Ошибка загрузки договора:', err))
      .finally(() => setLoadingContract(false));

    setLoadingServices(true);
    getServicesByContract(id)
      .then(data => setServices(data))
      .catch(err => console.error('Ошибка загрузки услуг:', err))
      .finally(() => setLoadingServices(false));
  }, [id]);

  if (loadingContract) return <p>Загрузка договора...</p>;
  if (!contract) return <p>Договор не найден</p>;

  return (
    <div className="contract-details-container">
      <h2>Карточка договора</h2>

      <table className="contract-details-table">
        <tbody>
          <tr><th>Номер</th><td>{contract.number_c}</td></tr>
          <tr><th>Наименование</th><td>{contract.name}</td></tr>
          <tr><th>Действует с</th><td>{contract.valid_from?.split('T')[0]}</td></tr>
          <tr><th>Действует по</th><td>{contract.valid_to?.split('T')[0]}</td></tr>
          <tr><th>Контрагент</th><td>{contract.contractor?.fullname}</td></tr>
          <tr><th>Объект</th><td>{contract.objects.name}</td></tr>
          <tr><th>Номер лицензии</th><td>{contract.license_number}</td></tr>
          <tr><th>Дата выдачи лицензии</th><td>{contract.license_date?.split('T')[0]}</td></tr>
          <tr><th>Орган, выдавший лицензию</th><td>{contract.license?.name}</td></tr>
          <tr><th>Кто изменил</th><td>{contract.user?.fullName}</td></tr>
          <tr><th>Дата изменения</th><td>{contract.date_of_change?.split('T')[0]}</td></tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Услуги по договору</h3>
      {loadingServices ? (
        <p>Загрузка услуг...</p>
      ) : services.length === 0 ? (
        <p>Услуги не найдены</p>
      ) : (
        <table className="contract-details-table">
          <thead>
            <tr>
              <th>Операция</th>
              <th>Ресурс</th>
              <th>Статья</th>
              <th>Ед. измерения</th>
              <th>Наименование</th>
              <th>Назначение</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.operation?.operation_name || '—'}</td>
                <td>{service.resource?.resource_name || '—'}</td>
                <td>{service.article?.article_name || '—'}</td>
                <td>{service.unit_of_measurement || '—'}</td>
                <td>{service.name || '—'}</td>
                <td>{service.aim || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="contract-details-actions">
  <button className="contract-details-btn" onClick={() => navigate(`/contract/${id}/service`)}>
    Создать услугу
  </button>
  <button className="contract-details-btn" onClick={() => navigate(`/contract/${id}/prices`)}>
    Создать цену
  </button>
  <button className="contract-details-btn" onClick={() => navigate(`/`)}>
    Вернуться на главную
  </button>
</div>

    </div>
  );
}

export default ContractDetailsPage;