import api from './api';

export const getAllBills = () => api.get('/bills');
export const getBillById = (id) => api.get(`/bills/${id}`);
export const createBill = (bill) => api.post('/bills', bill);
export const updateBill = (id, bill) => api.put(`/bills/${id}`, bill);
export const deleteBill = (id) => api.delete(`/bills/${id}`);
