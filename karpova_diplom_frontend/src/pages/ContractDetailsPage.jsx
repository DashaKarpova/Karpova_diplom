import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ContractDetails.css';

function ContractDetailsPage() {
const { id } = useParams();
const [contract, setContract] = useState(null);

useEffect(() => {
    axios.get(`/api/contracts/${id}`).then(response => {
    setContract(response.data);
    });
}, [id]);

if (!contract) return <p style={{ padding: '20px' }}>Загрузка...</p>;

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
        <tr><th>Номер лицензии</th><td>{contract.license_number}</td></tr>
        <tr><th>Дата выдачи лицензии</th><td>{contract.license_date?.split('T')[0]}</td></tr>
        <tr><th>Орган, выдавший лицензию</th><td>{contract.license?.name}</td></tr>
        <tr><th>Кто изменил</th><td>{contract.user?.fullName}</td></tr>
        <tr><th>Дата изменения</th><td>{contract.date_of_change?.split('T')[0]}</td></tr>
    </tbody>
    </table>
</div>
);
}

export default ContractDetailsPage;
