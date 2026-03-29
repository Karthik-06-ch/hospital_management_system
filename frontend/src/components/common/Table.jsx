import React, { useState } from 'react';
import { MdSearch, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Table = ({ columns, data, loading, onRowClick, searchPlaceholder = "Search...", actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (loading) return null; // Let the parent handle loading state, or return a basic skeleton

  // Search logic
  const filteredData = data.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="relative">
          <MdSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 w-full sm:w-72 bg-white transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 font-semibold border-b border-gray-100">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700 bg-white">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <MdSearch size={48} className="text-gray-200" />
                    <p className="text-lg font-medium text-gray-600">No data found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentRows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-primary-50/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to <span className="font-medium">{Math.min(indexOfLastRow, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardArrowLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
            {currentPage} / {Math.max(1, totalPages)}
          </span>
          <button 
            onClick={nextPage} 
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
