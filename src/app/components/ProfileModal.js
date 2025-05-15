import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ProfileModal = ({ isOpen, onClose, selectedItem }) => {
  if (!isOpen || !selectedItem) return null;

  const renderSection = (title, data) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize text-gray-600">
              {formatLabel(key)}:
            </span>{" "}
            <span className="text-gray-800">{formatValue(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/V2$/, "")
      .replace(/_/g, " ");
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "N/A";
    return value && value !== "N/A" ? value : "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Profile Details
        </h2>

        {/* User Personal Details */}
        {renderSection("Personal Details", {
          name: selectedItem.name,
          email: selectedItem.emailAddress,
          dateOfBirth: selectedItem.dateOfBirth,
          propertyRegime: selectedItem.propertyRegime,
          maritalStatus: selectedItem.maritalStatus,
          deletionRequest: selectedItem.deletionRequest || "No",
        })}

        {/* Estate Sections */}
        {renderSection("Estate Profile", selectedItem.estateProfileV2)}
        {renderSection("Estate Goals", selectedItem.estateGoalsV2)}
        {renderSection("Estate Tools", selectedItem.estateToolsV2)}
        {renderSection("Estate Tax", selectedItem.estateTaxV2)}
        {renderSection("Business", selectedItem.businessV2)}
        {renderSection("Living Will", selectedItem.livingWillV2)}
        {renderSection("Foreign Assets", selectedItem.reviewForeignAssetsV2)}

        <div className="text-right mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
