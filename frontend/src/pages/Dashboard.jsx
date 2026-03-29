import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPeople, MdLocalHospital, MdEvent, MdAttachMoney, MdArrowUpward, MdSchedule } from 'react-icons/md';
import { getAllPatients } from '../services/patientService';
import { getAllDoctors } from '../services/doctorService';
import { getAllAppointments } from '../services/appointmentService';
import { getAllBills } from '../services/billService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointmentsToday: 0,
    revenue: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [patientsRes, doctorsRes, appointmentsRes, billsRes] = await Promise.all([
          getAllPatients(),
          getAllDoctors(),
          getAllAppointments(),
          getAllBills()
        ]);

        const patients = patientsRes.data.data || [];
        const doctors = doctorsRes.data.data || [];
        const appointments = appointmentsRes.data.data || [];
        const bills = billsRes.data.data || [];

        // Calculate Revenue
        const totalRevenue = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);

        // Get today's date string matching API format
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(app => app.appointmentDate === today);

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointmentsToday: todaysAppointments.length,
          revenue: totalRevenue
        });

        // Get Top 5 recent appointments
        setRecentAppointments(appointments.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { title: 'Total Patients', value: stats.patients, icon: <MdPeople size={28} />, color: 'from-blue-500 to-blue-400', trend: '+12% this month' },
    { title: 'Total Doctors', value: stats.doctors, icon: <MdLocalHospital size={28} />, color: 'from-emerald-500 to-emerald-400', trend: '+2 new doctors' },
    { title: 'Appointments Today', value: stats.appointmentsToday, icon: <MdEvent size={28} />, color: 'from-orange-500 to-orange-400', trend: 'vs 15 yesterday' },
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <MdAttachMoney size={28} />, color: 'from-purple-500 to-purple-400', trend: '+8% this week' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Admin!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening at your hospital today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
            Generate Report
          </button>
          <button onClick={() => navigate('/appointments')} className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-600 transition-colors shadow-md shadow-primary-500/30">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg opacity-90`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-500 flex items-center font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                <MdArrowUpward size={14} className="mr-1" />
                {card.trend.split(' ')[0]}
              </span>
              <span className="text-gray-400 ml-2">{card.trend.split(' ').slice(1).join(' ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Appointments</h2>
            <button className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">View All</button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No recent appointments found.</td>
                  </tr>
                ) : (
                  recentAppointments.map((app, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {app.patient?.firstName?.charAt(0)}{app.patient?.lastName?.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-700">{app.patient?.firstName} {app.patient?.lastName}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{app.doctor?.firstName} {app.doctor?.lastName}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdSchedule size={16} className="text-gray-400" />
                          <span>{app.appointmentDate} <span className="text-xs ml-1 text-gray-400">{app.appointmentTime}</span></span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          app.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-orange-50 text-orange-600 border-orange-200'
                        }`}>
                          {app.status || 'SCHEDULED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Reminders */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500 opacity-20 rounded-full translate-y-10 -translate-x-10 blur-xl"></div>
            
            <h2 className="text-lg font-bold mb-4 relative z-10">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button onClick={() => navigate('/patients')} className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col justify-center items-center gap-2 border border-white/5">
                <MdPeople size={24} className="text-blue-300" />
                <span className="text-xs font-medium">Add Patient</span>
              </button>
              <button onClick={() => navigate('/appointments')} className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col justify-center items-center gap-2 border border-white/5">
                <MdEvent size={24} className="text-orange-300" />
                <span className="text-xs font-medium">New Appt</span>
              </button>
              <button onClick={() => navigate('/billing')} className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col justify-center items-center gap-2 border border-white/5">
                <MdAttachMoney size={24} className="text-emerald-300" />
                <span className="text-xs font-medium">Create Bill</span>
              </button>
              <button onClick={() => navigate('/doctors')} className="bg-primary-600/80 hover:bg-primary-500 transition-colors p-3 rounded-xl flex flex-col justify-center items-center gap-2 border border-primary-500/30">
                <MdLocalHospital size={24} className="text-teal-100" />
                <span className="text-xs font-medium">Add Doctor</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Important Notices</h2>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-400 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-red-800">Low Supplies Alert</p>
                  <p className="text-xs text-red-600 mt-1">Pharmacy is running low on generic Painkillers. Restock requested.</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">System Update</p>
                  <p className="text-xs text-blue-600 mt-1">Hospital Management System maintenance scheduled for Sunday 2 AM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
