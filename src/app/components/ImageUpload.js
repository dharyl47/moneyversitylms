"use client";
import { useState } from 'react';

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // Handle URL input change
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(imageUrl);
  };

  // Handle Save button click
  const handleSave = () => {
    setShowWarning(true);
  };

  // Close the warning popup
  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md relative">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="block mb-4">
          <span className="text-gray-300 text-sm">Image URL</span>
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="Enter image URL"
            className="mt-2 block w-full px-4 py-2 text-sm text-white border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
          >
            Show Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
      {preview && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-white">Image Preview</h3>
          <img
            src={preview}
            alt="Preview"
            className="mt-2 max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h4 className="text-xl font-semibold text-white mb-4">Warning</h4>
            <p className="text-gray-300 mb-4">Are you sure you want to save this image?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeWarning}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeWarning();
                  alert('Image saved!');
                }}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
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

export default ImageUpload;
