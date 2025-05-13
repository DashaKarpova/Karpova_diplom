import React, { useEffect, useState } from 'react';
import { getContractors } from '../api/contractors';

function ContractorsList() {
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    getContractors().then(setContractors);
  }, []);

  return (
    <div>
      <h2>Контрагенты</h2>
      <ul>
        {contractors.map(contractor => (
          <li key={contractor.id}>{contractor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ContractorsList;
