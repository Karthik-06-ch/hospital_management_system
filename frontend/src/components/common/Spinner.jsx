import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-teal-400 border-b-transparent animate-spin-reverse opacity-70"></div>
      </div>
    </div>
  );
};

export default Spinner;
