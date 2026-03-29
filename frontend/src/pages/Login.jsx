import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdLocalHospital, MdShield, MdPerson, MdHealing } from 'react-icons/md';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Validate Admin Credentials
    if (role === 'admin') {
      if (email !== 'admin' || password !== 'admin123') {
        toast.error('Invalid admin credentials. Use admin / admin123');
        return;
      }
    } else {
      // Basic validation for other roles for demo purposes
      if (password.length < 3) {
        toast.error('Password too short');
        return;
      }
    }
    
    // Simulating authentication
    login(role, email);
    
    // Redirect based on role
    if (role === 'admin') navigate('/dashboard');
    else if (role === 'doctor') navigate('/doctor-dashboard');
    else navigate('/patient-dashboard');
  };

  const roles = [
    { id: 'admin', label: 'Admin', icon: <MdShield size={24} />, desc: 'System Administrator' },
    { id: 'doctor', label: 'Doctor', icon: <MdHealing size={24} />, desc: 'Medical Practitioner' },
    { id: 'patient', label: 'Patient', icon: <MdPerson size={24} />, desc: 'Registered Patient' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-teal-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <MdLocalHospital size={36} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your credentials to access the portal.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[500px] z-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Select your role to continue</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
                <button 
                  key={r.id} 
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${role === r.id ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  {r.icon}
                  <span className="text-xs font-bold mt-2">{r.label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">{roles.find(r => r.id === role)?.desc} Login Selected</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username or Email</label>
              <div className="mt-1">
                <input required type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow" 
                  placeholder="Username or email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow" 
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md shadow-primary-500/30 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98]">
                Secure Sign In ({role.charAt(0).toUpperCase() + role.slice(1)})
              </button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600 border-t border-gray-100 pt-5">
              Don't have an account? <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500">Register here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
