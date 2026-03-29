import api from './api';

export const getAllStaff = () => api.get('/staff');
export const getStaffById = (id) => api.get(`/staff/${id}`);
export const createStaff = (staff) => api.post('/staff', staff);
export const updateStaff = (id, staff) => api.put(`/staff/${id}`, staff);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
