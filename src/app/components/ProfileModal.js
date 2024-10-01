import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Using an icon for close button
import { FaBuilding, FaBalanceScale } from 'react-icons/fa'; // Icons for sections

const ProfileModal = ({ isOpen, onClose, selectedItem }) => {
  console.log("mydata", selectedItem);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [toggleQuestions, setToggleQuestions] = useState({
    flexibility: false,
    businessProtection: false,
    financialSafeguards: false,
    insolvencyProtection: false,
    taxMinimization: false,
    estateReviewConfidence: false,
  });

  const handleToggle = (question) => {
    setToggleQuestions((prevState) => ({
      ...prevState,
      [question]: !prevState[question],
    }));
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile Details</h2>

        {/* Section 1: Objectives of Estate Planning */}
        <div className="mb-6">
          <h3
            className="flex items-center text-xl font-semibold text-gray-700 mb-2 cursor-pointer"
            onClick={() => setIsObjectivesOpen(!isObjectivesOpen)}
          >
            <FaBalanceScale className="mr-2 text-blue-500" /> Objectives of Estate Planning
          </h3>
          {isObjectivesOpen && (
            <div className="grid grid-cols-2 gap-4">
              {/* Flexibility */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('flexibility')}
                >
                  ? <b>Flexibility:</b> {selectedItem?.ObjectivesOfEstatePlanning?.estatePlanFlexibility}
                </span>
                {toggleQuestions.flexibility && (
                  <small className="text-gray-500">
                    Is your estate plan flexible enough to adapt to changes?
                  </small>
                )}
              </div>

              {/* Business Protection */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('businessProtection')}
                >
                  ? <b>Business Protection:</b> {selectedItem?.ObjectivesOfEstatePlanning?.businessProtectionImportance}
                </span>
                {toggleQuestions.businessProtection && (
                  <small className="text-gray-500">
                    How important is business protection in your estate plan?
                  </small>
                )}
              </div>

              {/* Financial Safeguard Strategies */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('financialSafeguards')}
                >
                  ? <b>Financial Safeguard Strategies:</b> {selectedItem?.ObjectivesOfEstatePlanning?.financialSafeguardStrategies}
                </span>
                {toggleQuestions.financialSafeguards && (
                  <small className="text-gray-500">
                    Which strategies are in place for safeguarding assets?
                  </small>
                )}
              </div>

              {/* Insolvency Protection */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('insolvencyProtection')}
                >
                  ? <b>Insolvency Protection:</b> {selectedItem?.ObjectivesOfEstatePlanning?.insolvencyProtectionConcern}
                </span>
                {toggleQuestions.insolvencyProtection && (
                  <small className="text-gray-500">
                    Are you concerned about insolvency protection?
                  </small>
                )}
              </div>

              {/* Tax Minimization Priority */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('taxMinimization')}
                >
                  ? <b>Tax Minimization Priority:</b> {selectedItem?.ObjectivesOfEstatePlanning?.taxMinimizationPriority}
                </span>
                {toggleQuestions.taxMinimization && (
                  <small className="text-gray-500">
                    Is minimizing taxes a priority in your estate plan?
                  </small>
                )}
              </div>

              {/* Estate Plan Review Confidence */}
              <div className="flex flex-col">
                <span
                  className="font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleToggle('estateReviewConfidence')}
                >
                  ? <b>Estate Plan Review Confidence:</b> {selectedItem?.ObjectivesOfEstatePlanning?.estatePlanReviewConfidence}
                </span>
                {toggleQuestions.estateReviewConfidence && (
                  <small className="text-gray-500">
                    How confident are you in reviewing and updating your estate plan?
                  </small>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Real Estate Properties */}
        <div className="mb-6">
          <h3
            className="flex items-center text-xl font-semibold text-gray-700 mb-2 cursor-pointer"
            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
          >
            <FaBuilding className="mr-2 text-green-500" /> Real Estate Properties
          </h3>
          {isAssetsOpen && (
            <div className="flex flex-col space-y-2">
              <div>
                <span className="font-medium text-gray-600"><b>Upload Document After Chat:</b> {selectedItem?.Assets?.realEstateProperties?.uploadDocumentAtEndOfChat ? 'Yes' : 'No'}</span>
                <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.uploadDocumentAtEndOfChat ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600"><b>General Property Details:</b> {selectedItem?.Assets?.realEstateProperties?.propertiesDetails}</span>
                <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.propertiesDetails || 'N/A'}</span>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-600 mb-2"><b>In-depth Property Details:</b></h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600"><b>Property Type:</b> {selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyType}</span>
                    <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"><b>Location:</b> {selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyLocation}</span>
                    <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyLocation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"><b>Size:</b> {selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertySize}</span>
                    <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertySize || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"><b>Bedrooms & Bathrooms:</b> {selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.bedroomsAndBathroomCount}</span>
                    <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.bedroomsAndBathroomCount || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"><b>Condition:</b> {selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyCondition}</span>
                    <span className="ml-2">{selectedItem?.Assets?.realEstateProperties?.inDepthDetails?.propertyCondition || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="text-right">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
