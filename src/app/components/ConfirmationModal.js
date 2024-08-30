import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete <span className="text-red-600">{itemName}</span>?</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;