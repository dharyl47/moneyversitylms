import React, { useState } from 'react';
import ProfileModal from '@/app/components/ProfileModal'; // Adjust the import path as necessary
import ConfirmationModal from '@/app/components/ConfirmationModal'; // Adjust the import path as necessary

const DataTableV2 = ({ data, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenModal = (item) => {
    console.log("itemData", item)
    setSelectedItem(item); // Set the item data
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete._id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-700 text-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Date of Birth</th>
            <th className="py-2 px-4">Property Regime</th>
            <th className="py-2 px-4">Marital Status</th>
            <th className="py-2 px-4">Request to Remove</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td className="py-2 px-4 text-center">{item.name}</td>
              <td className="py-2 px-4 text-center">{item.emailAddress}</td>
              <td className="py-2 px-4 text-center">{item.dateOfBirth}</td>
              <td className="py-2 px-4 text-center">{item.propertyRegime}</td>
              <td className="py-2 px-4 text-center">{item.maritalStatus}</td>
              <td className="py-2 px-4 text-center">{item.deletionRequest && item.deletionRequest || "No"}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  More Info
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Pass selectedItem to ProfileModal instead of using children */}
      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} selectedItem={selectedItem} />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default DataTableV2;
