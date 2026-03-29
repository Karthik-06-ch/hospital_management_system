import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { getAllPatients, createPatient, updatePatient, deletePatient } from '../services/patientService';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+'
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getAllPatients();
      setPatients(response.data.data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+'
    });
    setCurrentPatient(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (patient) => {
    setCurrentPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodGroup: patient.bloodGroup
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPatient) {
        await updatePatient(currentPatient.id, formData);
        toast.success('Patient updated successfully');
      } else {
        await createPatient(formData);
        toast.success('Patient added successfully');
      }
      setModalOpen(false);
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed!');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePatient(currentPatient.id);
      toast.success('Patient deleted successfully');
      setIsDeleteModalOpen(false);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Name', 
      accessor: 'firstName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-blue-50">
            {row.firstName.charAt(0)}{row.lastName.charAt(0)}
          </div>
          <span className="font-semibold text-gray-800">{row.firstName} {row.lastName}</span>
        </div>
      )
    },
    { header: 'Gender', accessor: 'gender' },
    { 
      header: 'Age/DOB', 
      render: (row) => <span className="text-gray-600">{row.dateOfBirth}</span>
    },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Blood Grp', 
      render: (row) => (
        <span className="px-2.5 py-1 bg-red-50 text-red-600 font-semibold text-xs rounded-full border border-red-100">
          {row.bloodGroup}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPatient(row); setIsDeleteModalOpen(true); }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
          <p className="text-gray-500 text-sm mt-1">View, add, edit and manage patient records</p>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={patients} 
        loading={loading}
        searchPlaceholder="Search patients by name, phone..."
        actions={
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-primary-500/20 hover:shadow-lg transition-all active:scale-95"
          >
            <MdAdd size={20} />
            <span>Add Patient</span>
          </button>
        }
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={currentPatient ? 'Edit Patient' : 'Add New Patient'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea required name="address" rows="2" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm">
              {currentPatient ? 'Save Changes' : 'Add Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="p-2">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <MdDelete size={32} />
          </div>
          <p className="text-center text-gray-700 text-lg mb-6">
            Are you sure you want to delete patient <span className="font-bold">{currentPatient?.firstName} {currentPatient?.lastName}</span>?<br/>
            <span className="text-sm text-gray-500">This action cannot be undone.</span>
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm">Delete</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Patients;
