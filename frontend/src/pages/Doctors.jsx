import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/doctorService';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', specialization: '',
    phone: '', email: '', department: 'Cardiology',
    experience: 0, availableDays: 'Mon,Wed,Fri'
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getAllDoctors();
      setDoctors(response.data.data);
    } catch (error) { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', specialization: '', phone: '', email: '', department: 'Cardiology', experience: 0, availableDays: 'Mon,Wed,Fri' });
    setCurrentDoctor(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  const openEditModal = (doctor) => {
    setCurrentDoctor(doctor);
    setFormData({ ...doctor });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDoctor) { await updateDoctor(currentDoctor.id, formData); toast.success('Doctor updated'); }
      else { await createDoctor(formData); toast.success('Doctor added'); }
      setModalOpen(false); fetchDoctors();
    } catch (error) { toast.error(error.response?.data?.message || 'Error occurred'); }
  };

  const handleDelete = async () => {
    try {
      await deleteDoctor(currentDoctor.id); toast.success('Deleted successfully');
      setIsDeleteModalOpen(false); fetchDoctors();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Doctor Name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            Dr.
          </div>
          <div>
            <span className="font-semibold text-gray-800 block">{row.firstName} {row.lastName}</span>
            <span className="text-xs text-gray-500">{row.specialization}</span>
          </div>
        </div>
      )
    },
    { header: 'Department', render: row => <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold border border-purple-100">{row.department}</span> },
    { header: 'Experience (Yrs)', accessor: 'experience' },
    { header: 'Available', accessor: 'availableDays' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={() => { setCurrentDoctor(row); setIsDeleteModalOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><MdDelete size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage doctor profiles and availability</p>
        </div>
      </div>
      <Table 
        columns={columns} data={doctors} loading={loading}
        searchPlaceholder="Search doctors by name or department..."
        actions={
          <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95">
            <MdAdd size={20} /><span>Add Doctor</span>
          </button>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">First Name *</label><input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Last Name *</label><input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Specialization *</label><input required type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                <option>Cardiology</option><option>Neurology</option><option>Pediatrics</option><option>Orthopedics</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Experience (Years)</label><input type="number" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Available Days</label><input type="text" placeholder="e.g. Mon,Wed,Fri" name="availableDays" value={formData.availableDays} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button><button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Save</button></div>
        </form>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="p-2"><p className="text-center text-lg mb-6">Are you sure you want to delete this doctor?</p><div className="flex justify-center gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 border rounded-lg">Cancel</button><button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg">Delete</button></div></div>
      </Modal>
    </div>
  );
};
export default Doctors;
