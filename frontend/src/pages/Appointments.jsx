import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { getAllPatients } from '../services/patientService';
import { getAllDoctors } from '../services/doctorService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);

  const [formData, setFormData] = useState({
    patient: { id: '' },
    doctor: { id: '' },
    appointmentDate: '',
    appointmentTime: '',
    status: 'SCHEDULED',
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, patRes, docRes] = await Promise.all([
        getAllAppointments(), getAllPatients(), getAllDoctors()
      ]);
      setAppointments(appRes.data.data);
      setPatients(patRes.data.data);
      setDoctors(docRes.data.data);
    } catch (error) { toast.error('Failed to load data'); }
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
    setFormData({ patient: { id: patients[0]?.id || '' }, doctor: { id: doctors[0]?.id || '' }, appointmentDate: '', appointmentTime: '', status: 'SCHEDULED', notes: '' });
    setCurrentAppt(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  
  const openEditModal = (appt) => {
    setCurrentAppt(appt);
    setFormData({
      patient: { id: appt.patient.id }, doctor: { id: appt.doctor.id },
      appointmentDate: appt.appointmentDate, appointmentTime: appt.appointmentTime,
      status: appt.status, notes: appt.notes
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAppt) { await updateAppointment(currentAppt.id, formData); toast.success('Updated'); }
      else { await createAppointment(formData); toast.success('Booked'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error('Action failed!'); }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Patient', render: row => <span className="font-semibold">{row.patient?.firstName} {row.patient?.lastName}</span> },
    { header: 'Doctor', render: row => <span>Dr. {row.doctor?.firstName} {row.doctor?.lastName}</span> },
    { header: 'Date', accessor: 'appointmentDate' },
    { header: 'Time', render: row => <span className="text-gray-500">{row.appointmentTime}</span> },
    { 
      header: 'Status', 
      render: row => (
        <select 
          value={row.status} 
          onChange={async (e) => {
            try {
              await updateAppointment(row.id, { ...row, status: e.target.value });
              fetchData();
              toast.success('Status updated');
            } catch (err) { toast.error('Failed to update status'); }
          }}
          className={`text-xs font-bold rounded-full px-2 py-1 outline-none border ${
            row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            row.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'
          }`}
        >
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={async () => {
            if (window.confirm('Delete appointment?')) {
              await deleteAppointment(row.id);
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
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <button onClick={openAddModal} className="flex flex-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-orange-500/20 hover:shadow-lg transition-all active:scale-95">
          <MdAdd size={20} /><span>Book Appointment</span>
        </button>
      </div>
      
      <Table columns={columns} data={appointments} loading={loading} searchPlaceholder="Search..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentAppt ? 'Edit Appointment' : 'Book Appointment'}>
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
            <div><label className="block text-sm font-medium mb-1">Date</label><input required type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Time</label><input required type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="SCHEDULED">SCHEDULED</option><option value="COMPLETED">COMPLETED</option><option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg resize-none"></textarea></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default Appointments;
