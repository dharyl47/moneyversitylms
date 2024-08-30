import React from 'react';

const ProfileModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {children}
        <button
          className="text-red-500 hover:text-red-700 float-right"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;