import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/departmentService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', headOfDepartment: '',
    location: '', phone: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllDepartments();
      setDepartments(res.data.data);
    } catch (error) { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ name: '', description: '', headOfDepartment: '', location: '', phone: '' });
    setCurrentDept(null);
  };

  const openAddModal = () => { resetForm(); setModalOpen(true); };
  
  const openEditModal = (dept) => {
    setCurrentDept(dept);
    setFormData({ ...dept });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDept) { await updateDepartment(currentDept.id, formData); toast.success('Updated'); }
      else { await createDepartment(formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error('Action failed!'); }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', render: row => <span className="font-semibold text-gray-800">{row.name}</span> },
    { header: 'Head of Dep.', accessor: 'headOfDepartment' },
    { header: 'Location', accessor: 'location' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><MdEdit size={18} /></button>
          <button onClick={async () => {
            if (window.confirm('Delete department?')) {
              await deleteDepartment(row.id);
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
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button onClick={openAddModal} className="flex flex-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95">
          <MdAdd size={20} /><span>Add Department</span>
        </button>
      </div>
      
      <Table columns={columns} data={departments} loading={loading} searchPlaceholder="Search..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentDept ? 'Edit Dept' : 'Add Dept'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name *</label><input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Head of Dept</label><input type="text" name="headOfDepartment" value={formData.headOfDepartment} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg resize-none"></textarea></div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t"><button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default Departments;
