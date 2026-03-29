import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocalHospital, MdEventAvailable, MdSecurity, MdMedicalServices } from 'react-icons/md';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-teal-400 flex items-center justify-center shadow-lg">
            <MdLocalHospital size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">CareSync</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">Log In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden h-[90vh]">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-gray-50 to-white -z-10"></div>
        <div className="absolute w-96 h-96 bg-primary-200/40 rounded-full blur-3xl -top-10 -left-10 opacity-50 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-teal-200/40 rounded-full blur-3xl bottom-10 -right-10 opacity-50 animate-pulse delay-1000"></div>

        <div className="max-w-4xl animate-fade-in-up">
          <span className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-bold text-xs uppercase tracking-wider mb-6 inline-block shadow-sm">
            Next-Gen Healthcare
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Connecting Care, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Transforming Lives</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The complete hospital management ecosystem for doctors, patients, and administrators. Seamlessly manage appointments, records, and billing in one unified platform.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link to="/login" className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Access Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 flex justify-center items-center rounded-2xl mb-4 shadow-inner">
              <MdEventAvailable size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Book, manage, and track appointments in real-time seamlessly.</p>
          </div>
          <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 flex justify-center items-center rounded-2xl mb-4 shadow-inner">
              <MdMedicalServices size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">EHR Integration</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Access comprehensive patient medical histories instantly.</p>
          </div>
          <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 flex justify-center items-center rounded-2xl mb-4 shadow-inner">
              <MdSecurity size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Role-Based Security</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Dedicated interfaces tailored specifically for doctors, patients, and admins.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
