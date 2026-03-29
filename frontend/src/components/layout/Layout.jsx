import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-gray-50/50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 relative">
          <div className="max-w-7xl mx-auto w-full h-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
