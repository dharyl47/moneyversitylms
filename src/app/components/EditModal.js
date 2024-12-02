import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, onSave, currentQuestion, currentAnswer }) => {
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');

  // Sync with parent-provided props
  useEffect(() => {
     console.log('Modal Props Updated:', { currentQuestion, currentAnswer });
    setEditedQuestion(currentQuestion); // Initialize with currentQuestion
    setEditedAnswer(currentAnswer); // Initialize with currentAnswer
  }, [currentQuestion, currentAnswer]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedQuestion, editedAnswer); // Pass updated question and answer
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white text-black p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Edit Learning Material</h2>
        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <textarea
            value={editedQuestion} // Pre-filled with the current question
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="w-full h-20 bg-gray-100 p-2 border border-gray-300 rounded resize-none"
            placeholder="Edit the question..."
          />
        </div>
        {/* Answer Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            value={editedAnswer} // Pre-filled with the current answer
            onChange={(e) => setEditedAnswer(e.target.value)}
            className="w-full h-40 bg-gray-100 p-2 border border-gray-300 rounded resize-none"
            placeholder="Edit the answer..."
          />
        </div>
        {/* Action Buttons */}
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