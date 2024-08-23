import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, onSave, currentText }) => {
  const [editedText, setEditedText] = useState(currentText);

  // Update editedText whenever currentText changes
  useEffect(() => {
    setEditedText(currentText);
  }, [currentText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedText);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white text-black p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Edit Prompt</h2>
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full h-40 bg-gray-100 p-2 border border-gray-300 rounded resize-none mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
