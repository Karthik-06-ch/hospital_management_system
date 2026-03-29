import api from './api';

export const getAllMedicalRecords = () => api.get('/medical-records');
export const getMedicalRecordById = (id) => api.get(`/medical-records/${id}`);
export const createMedicalRecord = (record) => api.post('/medical-records', record);
export const updateMedicalRecord = (id, record) => api.put(`/medical-records/${id}`, record);
export const deleteMedicalRecord = (id) => api.delete(`/medical-records/${id}`);
export const getRecordsByPatientId = (id) => api.get(`/medical-records/patient/${id}`);
