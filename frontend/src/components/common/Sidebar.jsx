import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdPeople, MdLocalHospital, MdEvent, MdBusiness, MdAssignment, MdPayment, MdBadge, MdLogout } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={22} />, roles: ['admin'] },
    { name: 'Doctor Portal', path: '/doctor-dashboard', icon: <MdDashboard size={22} />, roles: ['doctor'] },
    { name: 'Patient Portal', path: '/patient-dashboard', icon: <MdDashboard size={22} />, roles: ['patient'] },
    
    { name: 'Patients', path: '/patients', icon: <MdPeople size={22} />, roles: ['admin', 'doctor'] },
    { name: 'Doctors', path: '/doctors', icon: <MdLocalHospital size={22} />, roles: ['admin'] },
    { name: 'Appointments', path: '/appointments', icon: <MdEvent size={22} />, roles: ['admin', 'doctor', 'patient'] },
    { name: 'Departments', path: '/departments', icon: <MdBusiness size={22} />, roles: ['admin'] },
    { name: 'Medical Records', path: '/medical-records', icon: <MdAssignment size={22} />, roles: ['admin', 'doctor'] },
    { name: 'Staff', path: '/staff', icon: <MdBadge size={22} />, roles: ['admin'] },
    { name: 'Billing', path: '/billing', icon: <MdPayment size={22} />, roles: ['admin', 'patient'] },
  ];

  const visibleLinks = navLinks.filter(link => user && link.roles.includes(user.role));

  return (
    <div className="w-64 bg-gray-900 text-white h-full shadow-2xl flex flex-col transition-all duration-300">
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-teal-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <MdLocalHospital size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-wide">CareSync</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 scrollbar-thin scrollbar-thumb-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-2">Menu</p>
        {visibleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary-400'}`}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800 flex flex-col gap-4">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-colors border border-gray-700 hover:border-red-500/30"
        >
          <MdLogout size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
