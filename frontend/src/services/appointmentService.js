import api from './api';

export const getAllAppointments = () => api.get('/appointments');
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (appointment) => api.post('/appointments', appointment);
export const updateAppointment = (id, appointment) => api.put(`/appointments/${id}`, appointment);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
export const getAppointmentsByPatientId = (id) => api.get(`/appointments/patient/${id}`);
export const getAppointmentsByDoctorId = (id) => api.get(`/appointments/doctor/${id}`);
