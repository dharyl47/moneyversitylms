"use client";
import { useState } from 'react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        // Optionally, clear the form or handle success
        setFile(null);
        setPreview(null);
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <label className="block mb-4">
        <span className="text-gray-700">Choose an image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300"
        />
      </label>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 max-w-xs h-auto rounded-lg shadow-lg"
        />
      )}
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
      >
        Upload
      </button>
    </form>
  </div>
  );
};

export default ImageUpload;