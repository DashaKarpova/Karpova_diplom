import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ContractDetailsPage() {
const { id } = useParams();
const [contract, setContract] = useState(null);

useEffect(() => {
    axios.get(`/api/contracts/${id}`).then(res => {
    setContract(res.data);
    });
}, [id]);

if (!contract) return <p>Загрузка...</p>;

return (
<div className="contract-details">
    <h2>Карточка договора</h2>
    <p><strong>Номер:</strong> {contract.number_c}</p>
    <p><strong>Наименование:</strong> {contract.name}</p>
    <p><strong>Действует с:</strong> {contract.valid_from?.split('T')[0]}</p>
    <p><strong>Действует по:</strong> {contract.valid_to?.split('T')[0]}</p>
    <p><strong>Контрагент:</strong> {contract.contractor?.fullname}</p>
    <p><strong>Номер лицензии:</strong> {contract.license_number}</p>
    <p><strong>Дата лицензии:</strong> {contract.license_date?.split('T')[0]}</p>
    <p><strong>Орган выдавший лицензию:</strong> {contract.license?.name}</p>
    <p><strong>Изменил:</strong> {contract.user?.fullName}</p>
    <p><strong>Дата изменения:</strong> {contract.date_of_change?.split('T')[0]}</p>
</div>
);
}

export default ContractDetailsPage;
