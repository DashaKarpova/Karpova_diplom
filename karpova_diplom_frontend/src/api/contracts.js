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

// Новая функция для получения отфильтрованных договоров
export const getFilteredContracts = async (filters) => {

  
  // Отфильтруем null/undefined/пустые значения
  const params = {};
  if (filters.object_id) params.object_id = filters.object_id;
  if (filters.operation_id) params.operation_id = filters.operation_id;
  if (filters.resource_id) params.resource_id = filters.resource_id;
  if (filters.article_id) params.article_id = filters.article_id;

  const response = await axios.get('/api/contracts/filtered', { params });
  return response.data;
};
