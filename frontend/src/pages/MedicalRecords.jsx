import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '../services/medicalRecordService';
import { getAllPatients } from '../services/patientService';
import { getAllDoctors } from '../services/doctorService';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRec, setCurrentRec] = useState(null);

  const [formData, setFormData] = useState({
    patient: { id: '' }, doctor: { id: '' },
    diagnosis: '', prescription: '', notes: '', visitDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, patRes, docRes] = await Promise.all([
        getAllMedicalRecords(), getAllPatients(), getAllDoctors()
      ]);
      setRecords(recRes.data.data); setPatients(patRes.data.data); setDoctors(docRes.data.data);
    } catch (error) { toast.error('Failed to load records'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patientId' || name === 'doctorId') {
      const field = name === 'patientId' ? 'patient' : 'doctor';
      setFormData({ ...formData, [field]: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({ patient: { id: patients[0]?.id || '' }, doctor: { id: doctors[0]?.id || '' }, diagnosis: '', prescription: '', notes: '', visitDate: '' });
    setCurrentRec(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  
  const openEditModal = (rec) => {
    setCurrentRec(rec);
    setFormData({
      patient: { id: rec.patient.id }, doctor: { id: rec.doctor.id },
      diagnosis: rec.diagnosis, prescription: rec.prescription, notes: rec.notes, visitDate: rec.visitDate
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRec) { await updateMedicalRecord(currentRec.id, formData); toast.success('Updated'); }
      else { await createMedicalRecord(formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error('Action failed!'); }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Patient', render: row => <span className="font-semibold">{row.patient?.firstName} {row.patient?.lastName}</span> },
    { header: 'Doctor', render: row => <span>Dr. {row.doctor?.lastName}</span> },
    { header: 'Diagnosis', accessor: 'diagnosis' },
    { header: 'Visit Date', accessor: 'visitDate' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={async () => {
            if (window.confirm('Delete record?')) {
              await deleteMedicalRecord(row.id);
              toast.success('Deleted'); fetchData();
            }
          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><MdDelete size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        <button onClick={openAddModal} className="flex flex-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95">
          <MdAdd size={20} /><span>Add Record</span>
        </button>
      </div>
      <Table columns={columns} data={records} loading={loading} searchPlaceholder="Search..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentRec ? 'Edit Record' : 'Add Record'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select name="patientId" value={formData.patient.id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <select name="doctorId" value={formData.doctor.id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Visit Date</label><input type="date" name="visitDate" value={formData.visitDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Diagnosis</label><input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Prescription</label><textarea name="prescription" value={formData.prescription} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg resize-none"></textarea></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg resize-none"></textarea></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default MedicalRecords;
