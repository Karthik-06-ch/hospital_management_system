import api from './api';

export const getAllDoctors = () => api.get('/doctors');
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (doctor) => api.post('/doctors', doctor);
export const updateDoctor = (id, doctor) => api.put(`/doctors/${id}`, doctor);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
