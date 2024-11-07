import React, { useState } from 'react';
import ProfileModal from '@/app/components/ProfileModal';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const assistanceMessages = {
  disabilityInsuranceAssist: "Policies: Disability insurance provides financial security if you’re unable to work due to illness or injury, ensuring income to cover living expenses and maintain your standard of living.",
  keyPersonInsuranceAssist: "Policies: Key person insurance supports your business if a critical employee passes away or becomes disabled, covering the cost of finding a replacement and mitigating financial losses.",
  nominatedFuneralCoverAssist: "Policies: Nominating a beneficiary on your funeral cover policy ensures the benefit is paid directly to the intended recipient without delays, providing peace of mind to loved ones.",
  estateBequeathTrustStructureAssist: "Estate Duty: There are strategies to address third-party liability in your estate plan, including specific provisions in your will and setting up trusts.",
  shortfallHeirAssist: "Liquidity Position: Assistance is needed in assessing the financial impact on each heir, balancing fairness in inheritance responsibilities.",
  shortfallHeirContributionAssist: "Liquidity Position: Assistance is required in evaluating each heir's financial situation and willingness to contribute towards estate expenses.",
  shortfallCreditorsAssist: "Liquidity Position: Assistance needed to explore options for covering estate expenses without liquidating assets prematurely.",
  alternativeFinancingAssist: "Liquidity Position: Alternative financing options are available to manage estate planning needs effectively.",
  borrowingFundsForShortfallAssist: "Liquidity Position: Borrowing funds for estate shortfall requires an understanding of potential risks and costs.",
  alternativeFinancingOptionsAssist: "Liquidity Position: Various alternative financing options are available to ensure estate planning flexibility.",
  maintenanceObligationAssist: "Maintenance Claims: Assistance is needed to explore maintenance obligations more comprehensively for estate planning.",
};



const DataTableV2 = ({ data, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleOpenModal = (item) => {
    setSelectedItem(item);
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

  // Pagination settings
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const maxPageButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPageSet = () => {
    if (endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  const handlePrevPageSet = () => {
    if (startPage > 1) {
      setCurrentPage(startPage - 1);
    }
  };

 // Render assistance icon with tooltip
const renderAssistanceIcon = (item) => {
  const assistanceFields = [];

  const checkAssistanceFields = (obj, parentKey = '') => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (key.endsWith('Assist') && (obj[key]?.answer === 'Yes' || obj[key]?.answer === true)) {
        assistanceFields.push({
          key: fullKey,
          message: assistanceMessages[key] || "Assistance is required.",
        });
      }
      if (typeof obj[key] === 'object') {
        checkAssistanceFields(obj[key], fullKey);
      }
    });
  };

  checkAssistanceFields(item);

  return assistanceFields.map((field) => (
    <div key={field.key} className="inline-block relative mx-1">
      <span className="text-red-500 cursor-pointer hover:text-red-700" title={field.message}>
        ⚠️
      </span>
      <div className="absolute bottom-full mb-2 text-sm bg-gray-800 text-white rounded-lg p-4 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 max-w-xl w-[320px] whitespace-normal">
        {field.message}
      </div>
    </div>
  ));
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
              <td className="py-2 px-4 text-center">{item.name} {renderAssistanceIcon(item)}</td>
              <td className="py-2 px-4 text-center">{item.emailAddress}</td>
              <td className="py-2 px-4 text-center">{item.dateOfBirth}</td>
              <td className="py-2 px-4 text-center">{item.propertyRegime}</td>
              <td className="py-2 px-4 text-center">{item.maritalStatus}</td>
              <td className="py-2 px-4 text-center">{item.deletionRequest || "No"}</td>
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

      <div className="flex justify-center mt-4 space-x-1">
        <button onClick={handlePrevPageSet} disabled={startPage === 1} className="px-3 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50">
          &lt;
        </button>
        
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
            {page}
          </button>
        ))}

        <button onClick={handleNextPageSet} disabled={endPage === totalPages} className="px-3 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50">
          &gt;
        </button>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} selectedItem={selectedItem} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} itemName={itemToDelete?.name} />
    </div>
  );
};

export default DataTableV2;
