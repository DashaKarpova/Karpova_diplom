import axios from 'axios';

export const getContracts = async () => {
  const response = await axios.get('/api/contracts');
  return response.data;
};

export const createContract = async (contract) => {
  const response = await axios.post('/api/contracts', contract, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
