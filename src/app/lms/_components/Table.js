import React, { useState } from 'react';

const Table = ({ columns, data, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete); // Call the delete function passed as a prop
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 text-sm font-medium text-gray-100"
                >
                  {row[column.accessor]} {/* Dynamically access column data */}
                </td>
              ))}
              <td className="px-6 py-4 text-sm font-medium text-gray-100">
                <button
                  onClick={() => onEdit(row._id, row.question, row.answer)} // Pass question and answer
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(row._id)} // Open confirmation modal
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-white ">Confirm Deletion</h2>
            <p className="text-gray-300 mt-4 ">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end mt-6 space-x-4">

              <button
                onClick={handleCloseDeleteModal}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
