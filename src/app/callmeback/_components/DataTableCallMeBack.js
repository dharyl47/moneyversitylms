import React, { useState } from 'react';

const DataTableCallMeBack = ({ data, onStatusUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const maxPageButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPageSet = () => endPage < totalPages && setCurrentPage(endPage + 1);
  const handlePrevPageSet = () => startPage > 1 && setCurrentPage(startPage - 1);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/callMeBack/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok && onStatusUpdate) onStatusUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white text-black">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-white border-b">
            {['First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Date', 'Actions'].map((header) => (
              <th key={header} className="py-3 px-4 text-left text-sm font-semibold border-r last:border-r-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, idx) => (
            <tr key={item._id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="py-2 px-4">{item.firstName}</td>
              <td className="py-2 px-4">{item.lastName}</td>
              <td className="py-2 px-4">{item.email}</td>
              <td className="py-2 px-4">{item.phone}</td>
              <td className="py-2 px-4 font-semibold">
                <span className={item.status === 'contacted' ? 'text-green-600' : 'text-yellow-600'}>{item.status}</span>
              </td>
              <td className="py-2 px-4">{new Date(item.dateCreated).toLocaleDateString()}</td>
              <td className="py-2 px-4">
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-1">
        <button
          onClick={handlePrevPageSet}
          disabled={startPage === 1}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded-md text-sm font-medium ${
              currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPageSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DataTableCallMeBack;