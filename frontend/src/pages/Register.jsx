import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLocalHospital, MdPerson, MdHealing } from 'react-icons/md';
import { createPatient } from '../services/patientService';
import { createDoctor } from '../services/doctorService';

const Register = () => {
  const [role, setRole] = useState('patient');
  const navigate = useNavigate();

  // Unified form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '', // Kept for UI realism
    
    // Patient specific
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    
    // Doctor specific
    specialization: '',
    department: 'Cardiology',
    experience: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (role === 'patient') {
        const patientData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          bloodGroup: 'Unknown'
        };
        await createPatient(patientData);
        toast.success('Patient Registration Successful! Please log in.');
      } else {
        const doctorData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          department: formData.department,
          experience: formData.experience,
          availableDays: 'Mon,Wed,Fri'
        };
        await createDoctor(doctorData);
        toast.success('Doctor Registration pending admin approval. You can now log in.');
      }
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center animate-fade-in-up">
        <Link to="/" className="inline-flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-teal-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <MdLocalHospital size={36} className="text-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
        <p className="mt-2 text-sm text-gray-600">Join the CareSync portal today.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[600px] z-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">I am registering as a...</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" onClick={() => setRole('patient')}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${role === 'patient' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <MdPerson size={24} />
                <span className="text-sm font-bold mt-2">Patient</span>
              </button>
              <button 
                type="button" onClick={() => setRole('doctor')}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${role === 'doctor' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <MdHealing size={24} />
                <span className="text-sm font-bold mt-2">Doctor</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Password *</label>
              <input required type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Min 6 characters" />
            </div>

            {role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Address *</label>
                  <textarea required name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                </div>
              </>
            )}

            {role === 'doctor' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                  <input required type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Neurologist" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md shadow-primary-500/30 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98]">
                Complete Registration
              </button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">Sign in securely</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
