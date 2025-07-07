import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const getCustomers = () => api.get('/customers');
export const addCustomer = (data: any) => api.post('/customers', data);
export const getOrders = (customer_id: string) => api.get(`/orders?customer_id=${customer_id}`);
export const addOrder = (data: any) => api.post('/orders', data);