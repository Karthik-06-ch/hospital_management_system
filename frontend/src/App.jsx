import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import MedicalRecords from './pages/MedicalRecords';
import Staff from './pages/Staff';
import Billing from './pages/Billing';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected ADMIN Routes nested in Layout */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><Layout><Patients /></Layout></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Doctors /></Layout></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}><Layout><Appointments /></Layout></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Departments /></Layout></ProtectedRoute>} />
        <Route path="/medical-records" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><Layout><MedicalRecords /></Layout></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Staff /></Layout></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'patient']}><Layout><Billing /></Layout></ProtectedRoute>} />

        {/* Dummy Role specific dashboards for demo purposes */}
        <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><Layout><p className="p-8 text-xl font-bold">Doctor Dashboard coming soon...</p></Layout></ProtectedRoute>} />
        <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><Layout><p className="p-8 text-xl font-bold">Patient Portal coming soon...</p></Layout></ProtectedRoute>} />
        
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<div className="p-8 text-center"><h1 className="text-3xl font-bold text-red-600">Unauthorized</h1><p>You don't have access to this page.</p></div>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
    </AuthProvider>
  );
}

export default App;
