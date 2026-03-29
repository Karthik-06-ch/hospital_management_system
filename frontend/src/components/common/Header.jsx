import React from 'react';
import { MdNotifications, MdSearch } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="flex items-center bg-gray-100/80 rounded-full px-4 py-2 w-96 border border-gray-200/50 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-300">
        <MdSearch size={22} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-primary-50">
          <MdNotifications size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 px-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-primary-600 font-medium capitalize">{user?.role || 'Visitor'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 border border-primary-200 text-primary-700 flex items-center justify-center font-bold shadow-sm">
            {user?.name ? user.name.split(' ').map(n => n.charAt(0)).join('').substring(0,2) : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
