import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ProfileModal = ({ isOpen, onClose, selectedItem }) => {
  if (!isOpen || !selectedItem) return null;

  /* ---------- helpers ---------- */

  const formatLabel = (label) =>
    label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/V2$/, "")
      .replace(/_/g, " ");

  const formatValue = (value) => {
    if (Array.isArray(value))
      return value.length > 0 ? value.join(", ") : "N/A";
    return value && value !== "N/A" && value !== "" ? value : "N/A";
  };

  const renderSection = (title, data) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data || {}).map(([k, v]) => (
          <div key={k}>
            <span className="font-medium capitalize text-gray-600">
              {formatLabel(k)}:
            </span>{" "}
            <span className="text-gray-800">{formatValue(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /** Renders an array of objects as a bordered table */
  const renderObjectArray = (title, arr = [], columns = []) => {
    if (!arr.length) return null;
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
          {title}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((c) => (
                  <th
                    key={c}
                    className="px-3 py-2 border text-left font-medium"
                  >
                    {formatLabel(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {arr.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c} className="px-3 py-2 border">
                      {formatValue(row?.[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ---------- modal ---------- */

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

        {/* Personal */}
        {(() => {
          // Get full name from firstName + sureName
          const fullName = selectedItem.firstName && selectedItem.sureName 
            ? `${selectedItem.firstName} ${selectedItem.sureName}` 
            : selectedItem.firstName || selectedItem.name || 'N/A';
          
          return renderSection("Personal Details", {
            name: fullName,
            firstName: selectedItem.firstName,
            sureName: selectedItem.sureName,
            age: selectedItem.age,
            email: selectedItem.emailAddress,
            dateOfBirth: selectedItem.dateOfBirth,
            propertyRegime: selectedItem.propertyRegime,
            maritalStatus: selectedItem.maritalStatus,
            hasDependents: selectedItem.childrenOrDependents?.hasDependents,
            dependentsDetails: selectedItem.childrenOrDependents?.details,
            hasAdultDependents: selectedItem.adultDependents?.hasAdultDependents,
            adultDependentsDetails: selectedItem.adultDependents?.details,
            guardianNamed: selectedItem.guardianNamed,
            estatePlanGoals: selectedItem.estatePlanGoals,
            deletionRequest: selectedItem.deletionRequest || "No",
          });
        })()}

        {/* Estate sections */}
        {renderSection("Estate Profile", selectedItem.estateProfileV2)}
        {renderSection("Estate Goals", selectedItem.estateGoalsV2)}
        {renderSection("Estate Tools", selectedItem.estateToolsV2)}
        {renderObjectArray(
          "Donation Details",
          selectedItem.estateToolsV2?.donationsDetails,
          ["description", "value", "recipient", "notes"]
        )}
        {renderSection("Estate Tax", selectedItem.estateTaxV2)}
        {renderSection("Business", selectedItem.businessV2)}
        {renderSection("Living Will", selectedItem.livingWillV2)}
        {renderObjectArray(
          "Healthcare Decision Makers",
          selectedItem.livingWillV2?.healthcareDecisionMakers,
          ["name", "relationship"]
        )}
        {renderObjectArray(
          "Emergency Healthcare Decision Makers",
          selectedItem.livingWillV2?.emergencyHealthcareDecisionMakers,
          ["name", "relationship"]
        )}
        {renderSection("Foreign Assets", selectedItem.reviewForeignAssetsV2)}

        {/* Additional considerations */}
        {renderSection(
          "Additional Considerations",
          (() => {
            const { legacyHeirloomsDetails, ...rest } =
              selectedItem.additionalConsideration || {};
            return rest;
          })()
        )}
        {renderObjectArray(
          "Legacy Heirlooms",
          selectedItem.additionalConsideration?.legacyHeirloomsDetails,
          ["item", "recipient"]
        )}

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
