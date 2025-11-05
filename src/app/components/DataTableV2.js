import React, { useState } from 'react';
import ProfileModal from '@/app/components/ProfileModal';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const DataTableV2 = ({ data, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ---------- helpers ----------
  const hasMeaningfulData = (val) => {
    if (val == null) return false;
    if (typeof val !== 'object') {
      if (typeof val === 'string') {
        const s = val.trim();
        return s !== '' && s !== 'N/A';
      }
      return !!val;
    }
    if (Array.isArray(val)) return val.some((v) => hasMeaningfulData(v));
    return Object.values(val).some((v) => hasMeaningfulData(v));
  };

  const getValueByPath = (root, path) =>
    path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), root);

  const stages = [
    'Welcome',
    'Personal Information',
    'Net Worth Assessment',
    'Estate Planning Goals',
    'Choosing Estate Planning Tools',
    'Tax Planning and Minimization',
    'Business Succession Planning',
    'Living Will and Healthcare Directives',
    'Review of Foreign Assets',
    'Additional Considerations',
    'Final Review and Next Steps',
  ];

  const stageFieldMap = {
    'Welcome': [], // No data collected, informational only
    'Personal Information': [
      'firstName',
      'sureName',
      'age',
      'maritalStatus',
      'childrenOrDependents',
      'adultDependents',
      'guardianNamed',
      'estatePlanGoals',
    ],
    'Net Worth Assessment': [
      'estateProfileV2.ownsProperty',
      'estateProfileV2.ownsVehicle',
      'estateProfileV2.ownsBusiness',
      'estateProfileV2.ownsValuables',
      'estateProfileV2.hasDebts',
    ],
    'Estate Planning Goals': [
      'estateGoalsV2.assetDistribution',
      'estateGoalsV2.careForDependents',
      'estateGoalsV2.minimizeTaxes',
      'estateGoalsV2.incapacityPlanning',
      'estateGoalsV2.emergencyFund',
      'estateGoalsV2.financialPlan',
      'livingWillV2.healthcareDecisionMakers',
    ],
    'Choosing Estate Planning Tools': [
      'estateToolsV2.will',
      'estateToolsV2.willReview',
      'estateToolsV2.trustSetup',
      'estateToolsV2.trusts',
      'estateToolsV2.donations',
      'estateToolsV2.donationsDetails',
      'estateToolsV2.lifeInsurance',
      'estateToolsV2.digitalAssets',
    ],
    'Tax Planning and Minimization': [
      'estateTaxV2.estateDuty',
      'estateTaxV2.gainsTax',
      'estateTaxV2.incomeTax',
      'estateTaxV2.protectionClaims',
    ],
    'Business Succession Planning': [
      'businessV2.businessPlan',
      'businessV2.keyPerson',
    ],
    'Living Will and Healthcare Directives': [
      'livingWillV2.createLivingWill',
      'livingWillV2.healthCareDecisions',
      'livingWillV2.emergencyHealthcareDecisionMakers',
    ],
    'Review of Foreign Assets': [
      'reviewForeignAssetsV2.ownProperty',
      'additionalConsideration.contactLegalAdviser',
      'additionalConsideration.legacyHeirlooms',
    ],
    'Additional Considerations': [
      'additionalConsideration.legacyHeirlooms',
      'additionalConsideration.legacyHeirloomsDetails',
      'additionalConsideration.beneficiaryDesignations',
      'additionalConsideration.executorRemuneration',
      'additionalConsideration.informedNominated',
      'additionalConsideration.prepaidFuneral',
      'additionalConsideration.petCarePlanning',
      'additionalConsideration.setAReminder',
    ],
    'Final Review and Next Steps': [
      // Check if ALL Additional Considerations fields are filled
      'additionalConsideration.contactLegalAdviser',
      'additionalConsideration.legacyHeirlooms',
      'additionalConsideration.beneficiaryDesignations',
      'additionalConsideration.executorRemuneration',
      'additionalConsideration.informedNominated',
      'additionalConsideration.prepaidFuneral',
      'additionalConsideration.petCarePlanning',
      'additionalConsideration.setAReminder',
    ],
  };

  const hasAnyStageData = (item, stage) => {
    const keys = stageFieldMap[stage] || [];
    return keys.some((k) => hasMeaningfulData(getValueByPath(item, k)));
  };

  const hasAllStageData = (item, stage) => {
    const keys = stageFieldMap[stage] || [];
    if (keys.length === 0) return true; // Welcome stage has no data
    return keys.every((k) => hasMeaningfulData(getValueByPath(item, k)));
  };

  const getCurrentStage = (item) => {
    // Check if Final Review and Next Steps (all Additional Considerations filled)
    const finalReviewFields = [
      'additionalConsideration.contactLegalAdviser',
      'additionalConsideration.legacyHeirlooms',
      'additionalConsideration.beneficiaryDesignations',
      'additionalConsideration.executorRemuneration',
      'additionalConsideration.informedNominated',
      'additionalConsideration.prepaidFuneral',
      'additionalConsideration.petCarePlanning',
      'additionalConsideration.setAReminder',
    ];
    const allFinalReviewFieldsFilled = finalReviewFields.every((k) => 
      hasMeaningfulData(getValueByPath(item, k))
    );
    if (allFinalReviewFieldsFilled) {
      return 'Final Review and Next Steps';
    }

    // Check Business Succession Planning conditionally
    const ownBusiness = item.ownBusiness === 'Yes';
    
    // Iterate through stages and find the first incomplete one
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      
      // Skip Welcome (no data to check)
      if (stage === 'Welcome') continue;
      
      // Handle Business Succession Planning conditionally
      if (stage === 'Business Succession Planning') {
        if (!ownBusiness) {
          // Skip this stage if user doesn't own a business
          continue;
        }
      }
      
      // Check if this stage has any data
      if (!hasAnyStageData(item, stage)) {
        return stage;
      }
    }
    
    // If all stages are complete, return the last stage
    return 'Final Review and Next Steps';
  };

  // Get display name from firstName + sureName, fallback to name
  const getDisplayName = (item) => {
    const fullName = item.firstName && item.sureName 
      ? `${item.firstName} ${item.sureName}` 
      : item.firstName || item.name || 'N/A';
    return fullName;
  };

  // ---------- handlers ----------
  const handleDownloadPDF = async (item) => {
    try {
      const response = await fetch('/api/generatePdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to generate PDF');
      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const displayName = getDisplayName(item);
      link.setAttribute('download', `${displayName.replace(/\s+/g, '_')}_Estate_Planning_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

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

  // <-- CHANGE: accept the id directly to avoid stale state and shape mismatches
  const handleConfirmDelete = async (id) => {
    if (!id) {
      console.error('No id provided to delete');
      return;
    }
    await onDelete(id); // parent should remove it from data
    setIsDeleteModalOpen(false);
    setItemToDelete(null);

    // If we just deleted the last item on this page, step back a page
    const remaining = data.length - 1; // one removed
    const firstIndexThisPage = (currentPage - 1) * itemsPerPage;
    if (remaining <= firstIndexThisPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // ---------- pagination ----------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const maxPageButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPageSet = () => endPage < totalPages && setCurrentPage(endPage + 1);
  const handlePrevPageSet = () => startPage > 1 && setCurrentPage(startPage - 1);

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="min-w-full text-gray-800 border-collapse">
        <thead>
          <tr className="bg-white border-b">
            {['Name', 'Age', 'Marital Status', 'Current Stage', 'Status', 'Actions'].map((header) => (
              <th key={header} className="py-3 px-4 text-left text-sm font-semibold border-r last:border-r-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentItems.map((item, idx) => {
            // Check if completed (all Additional Considerations fields filled)
            const finalReviewFields = [
              'additionalConsideration.contactLegalAdviser',
              'additionalConsideration.legacyHeirlooms',
              'additionalConsideration.beneficiaryDesignations',
              'additionalConsideration.executorRemuneration',
              'additionalConsideration.informedNominated',
              'additionalConsideration.prepaidFuneral',
              'additionalConsideration.petCarePlanning',
              'additionalConsideration.setAReminder',
            ];
            const allFinalReviewFieldsFilled = finalReviewFields.every((k) => 
              hasMeaningfulData(getValueByPath(item, k))
            );
            const isCompleted = allFinalReviewFieldsFilled;
            const status = isCompleted ? 'Completed' : 'In Progress';
            const currentStage = getCurrentStage(item);
            const displayName = getDisplayName(item);

            // robust id (works with _id or id)
            const itemId = item._id || item.id;

            return (
              <tr
                key={itemId}
                className={`border-b hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-2 px-4">{displayName}</td>
                <td className="py-2 px-4">{item.age || 'N/A'}</td>
                <td className="py-2 px-4">{item.maritalStatus || 'N/A'}</td>
                <td className="py-2 px-4">{currentStage}</td>
                <td className={`py-2 px-4 font-semibold ${status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {status}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button onClick={() => handleOpenModal(item)} className="text-blue-600 text-sm">
                    More Info
                  </button>
                  <button onClick={() => handleDeleteClick(item)} className="text-red-600 text-sm">
                    Delete
                  </button>
                  <button onClick={() => handleDownloadPDF(item)} className="text-green-600 text-sm">
                    Download Report
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-1">
        <button
          onClick={handlePrevPageSet}
          disabled={startPage === 1}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded-md text-sm font-medium ${
              currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPageSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} selectedItem={selectedItem} />

      {/* IMPORTANT: pass the id directly to onConfirm */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() => handleConfirmDelete((itemToDelete && (itemToDelete._id || itemToDelete.id)) || null)}
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default DataTableV2;
