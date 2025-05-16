import axios from 'axios';

export const getPrices = async () => {
  const response = await axios.get('/api/prices');
  return response.data;
};

export const createPrice = async (price) => {
  const response = await axios.post(`/api/prices/${price.contract_id}`, price, {
    headers: {
    'Content-Type': 'application/json',
    },
});
return response.data;
};