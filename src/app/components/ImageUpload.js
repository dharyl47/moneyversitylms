"use client";
import { useState } from 'react';
import connectMongoDB from '../lib/mongo'; // Adjust path as needed

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setShowWarning(true);
  };

  const confirmSave = async () => {
    if (!imageFile) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/engagingContent', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        setImageFile(null);
        setPreview(null);
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      closeWarning();
    }
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md relative">
      
      {/* Image Upload Form */}
      <form className="flex flex-col mb-6">
        <label className="block mb-4">
          <span className="text-gray-300 text-sm">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-white border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
      
      {/* Image Preview */}
      {preview && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">Image Preview</h3>
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-48 h-48 object-cover rounded-lg shadow-lg"
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
                onClick={confirmSave}
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
