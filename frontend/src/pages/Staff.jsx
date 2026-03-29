import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import { getAllDepartments } from '../services/departmentService';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', role: '', phone: '', email: '', salary: 0, joiningDate: '',
    department: { id: '' }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stRes, depRes] = await Promise.all([getAllStaff(), getAllDepartments()]);
      setStaff(stRes.data.data); setDepartments(depRes.data.data);
    } catch (error) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'departmentId') { setFormData({ ...formData, department: { id: value } }); }
    else { setFormData({ ...formData, [name]: value }); }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', role: '', phone: '', email: '', salary: 0, joiningDate: '', department: { id: departments[0]?.id || '' } });
    setCurrentStaff(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  
  const openEditModal = (st) => {
    setCurrentStaff(st);
    setFormData({ ...st, department: { id: st.department?.id || '' } });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStaff) { await updateStaff(currentStaff.id, formData); toast.success('Updated'); }
      else { await createStaff(formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error('Action failed!'); }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', render: row => <span className="font-semibold">{row.firstName} {row.lastName}</span> },
    { header: 'Role', accessor: 'role' },
    { header: 'Department', render: row => <span>{row.department?.name}</span> },
    { header: 'Salary', render: row => <span>${row.salary}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={async () => {
            if (window.confirm('Delete staff?')) { await deleteStaff(row.id); toast.success('Deleted'); fetchData(); }
          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><MdDelete size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Hospital Staff</h1>
        <button onClick={openAddModal} className="flex flex-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg font-medium shadow-md">
          <MdAdd size={20} /><span>Add Staff</span>
        </button>
      </div>
      <Table columns={columns} data={staff} loading={loading} searchPlaceholder="Search..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentStaff ? 'Edit Staff' : 'Add Staff'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">First Name *</label><input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Last Name *</label><input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><input type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select name="departmentId" value={formData.department.id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select Dept</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Salary</label><input type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Joining Date</label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default Staff;
