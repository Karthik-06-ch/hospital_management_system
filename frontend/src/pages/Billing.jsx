import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllBills, createBill, updateBill, deleteBill } from '../services/billService';
import { getAllPatients } from '../services/patientService';
import { getAllAppointments } from '../services/appointmentService';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  const [formData, setFormData] = useState({
    patient: { id: '' }, appointment: { id: '' },
    amount: 0, paidAmount: 0, paymentStatus: 'PENDING',
    paymentDate: '', description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billsRes, patRes, appRes] = await Promise.all([getAllBills(), getAllPatients(), getAllAppointments()]);
      setBills(billsRes.data.data); setPatients(patRes.data.data); setAppointments(appRes.data.data);
    } catch (error) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patientId') { setFormData({ ...formData, patient: { id: value } }); }
    else if (name === 'appointmentId') { setFormData({ ...formData, appointment: { id: value || null } }); }
    else { setFormData({ ...formData, [name]: value }); }
  };

  const resetForm = () => {
    setFormData({ patient: { id: patients[0]?.id || '' }, appointment: { id: '' }, amount: 0, paidAmount: 0, paymentStatus: 'PENDING', paymentDate: '', description: '' });
    setCurrentBill(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  
  const openEditModal = (b) => {
    setCurrentBill(b);
    setFormData({ ...b, patient: { id: b.patient.id }, appointment: { id: b.appointment?.id || '' } });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBill) { await updateBill(currentBill.id, formData); toast.success('Updated'); }
      else { await createBill(formData); toast.success('Generated'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error('Action failed!'); }
  };

  const columns = [
    { header: 'Invoice #', render: row => <span className="text-gray-500 font-mono">INV-{row.id.toString().padStart(4, '0')}</span> },
    { header: 'Patient', render: row => <span className="font-semibold">{row.patient?.firstName} {row.patient?.lastName}</span> },
    { header: 'Amount', render: row => <span>${row.amount?.toFixed(2)}</span> },
    { header: 'Paid', render: row => <span className="text-emerald-600">${row.paidAmount?.toFixed(2)}</span> },
    { header: 'Date', accessor: 'paymentDate' },
    { 
      header: 'Status', 
      render: row => (
        <select 
          value={row.paymentStatus} 
          onChange={async (e) => {
            try {
              await updateBill(row.id, { ...row, paymentStatus: e.target.value });
              fetchData(); toast.success('Status updated');
            } catch(err) { toast.error('Failed update'); }
          }}
          className={`text-xs font-bold rounded-full px-2 py-1 outline-none border ${
            row.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            row.paymentStatus === 'PARTIAL' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          <option value="PENDING">PENDING</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="PAID">PAID</option>
        </select>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={async () => {
            if (window.confirm('Delete bill?')) { await deleteBill(row.id); toast.success('Deleted'); fetchData(); }
          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><MdDelete size={18} /></button>
        </div>
      )
    }
  ];

  const totalPending = bills.filter(b => b.paymentStatus !== 'PAID').reduce((sum, b) => sum + (b.amount - b.paidAmount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
          <p className="text-gray-500 text-sm mt-1">Pending Balance: <span className="font-bold text-red-500">${totalPending.toFixed(2)}</span></p>
        </div>
        <button onClick={openAddModal} className="flex flex-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium shadow-md">
          <MdAdd size={20} /><span>Generate Bill</span>
        </button>
      </div>

      <Table columns={columns} data={bills} loading={loading} searchPlaceholder="Search..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentBill ? 'Edit Bill' : 'Generate Bill'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select name="patientId" value={formData.patient.id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Appointment (Optional)</label>
              <select name="appointmentId" value={formData.appointment.id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="">None</option>
                {appointments.filter(a => a.patient?.id.toString() === formData.patient.id.toString()).map(a => 
                  <option key={a.id} value={a.id}>{a.appointmentDate} - Dr. {a.doctor?.lastName}</option>
                )}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Total Amount ($)</label><input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Paid Amount ($)</label><input type="number" step="0.01" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="PENDING">PENDING</option><option value="PARTIAL">PARTIAL</option><option value="PAID">PAID</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Payment Date</label><input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg resize-none"></textarea></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default Billing;
