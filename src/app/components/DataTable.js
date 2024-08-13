"use client";
import { useState } from 'react';

const DataTable = ({ data, onEdit, onDelete }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditPopup(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    try {
      const response = await fetch(`/api/settings/${editItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem),
      });

      if (response.ok) {
        alert('Item updated successfully!');
        closeEditPopup();
        onEdit(editItem); // Notify parent component
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await fetch(`/api/settings/${itemToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Item deleted successfully!');
        setItemToDelete(null);
        setShowDeleteConfirm(false);
        onDelete(itemToDelete._id); // Notify parent component
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle image URL (example: if images are stored on a server)
  const getImageUrl = (filename) => `/api/uploads/${encodeURIComponent(filename)}`;

  return (
    <div>
      <table className="min-w-full bg-gray-700 text-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Engaging Prompt</th>
            <th className="py-2 px-4 text-left">Image Preview</th>
            <th className="py-2 px-4 text-left">Video URL Embed Preview</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item._id}>
              <td className="py-2 px-4 text-left">{item.engagingPrompt}</td>
              <td className="py-2 px-4 text-left">
                {item.engagingImage && (
                  <img
                    src={getImageUrl(item.engagingImage)}
                    alt="Image Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </td>
             <td className="py-2 px-4 text-left">
  {item.engagingVideo && (
    <div className="relative w-32 h-24">
      <iframe
        src={item.engagingVideo}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
        title="Video Preview"
      />
    </div>
  )}
</td>
              <td className="py-2 px-4 text-left">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 bg-blue-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="px-4 py-2 bg-red-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-red-600 transition-colors ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Popup */}
      {showEditPopup && editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h4 className="text-xl font-semibold text-white mb-4">Edit Item</h4>
            <form className="flex flex-col">
              <label className="block mb-4">
                <span className="text-gray-300 text-sm">Name</span>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="mt-2 block w-full text-sm text-white border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-300 text-sm">Description</span>
                <textarea
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="mt-2 block w-full text-sm text-white border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-green-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeEditPopup}
                  className="px-6 py-2 bg-red-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h4 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h4>
            <p className="text-gray-300 mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-green-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
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

export default DataTable;
