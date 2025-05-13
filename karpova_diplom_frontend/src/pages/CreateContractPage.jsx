import React, { useEffect, useState } from 'react';
import { getContractors } from '../api/contractors';
import { getLicenses } from '../api/license';
import { createContract } from '../api/contracts';

function CreateContractPage() {
  const [contractors, setContractors] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    number_c: '',
    valid_from: '',
    valid_to: '',
    contractor_id: '',
    license_number: '',
    license_date: '',
    authority: '',
    user_id: localStorage.getItem('userId')
  });

  useEffect(() => {
    getContractors().then(setContractors);
    getLicenses().then(setLicenses);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createContract(form);
    alert('Договор создан!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Создание договора</h2>
      <input name="name" placeholder="Наименование" onChange={handleChange} />
      <input name="number_c" placeholder="Номер договора" onChange={handleChange} />
      <input type="date" name="valid_from" onChange={handleChange} />
      <input type="date" name="valid_to" onChange={handleChange} />

      <select name="contractor_id" onChange={handleChange}>
        <option>Выберите контрагента</option>
        {contractors.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input name="license_number" placeholder="Номер лицензии" onChange={handleChange} />
      <input type="date" name="license_date" onChange={handleChange} />

      <select name="authority" onChange={handleChange}>
        <option>Выберите орган</option>
        {licenses.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <button type="submit">Создать</button>
    </form>
  );
}

export default CreateContractPage;
