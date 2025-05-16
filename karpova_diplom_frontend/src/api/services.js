import axios from 'axios';

export const getServices = async () => {
const response = await axios.get('/api/services');
return response.data;
};


export const createService = async (service) => {
const response = await axios.post(`/api/services/${service.contract_id}`, service, {
    headers: {
    'Content-Type': 'application/json',
    }
});
return response.data;
};

