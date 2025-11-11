"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTableV2 from "./_components/DataTableV2";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Breadcrumb from "@/app/components/Breadcrumb";
import Papa from "papaparse";

const formatLabelForCSV = (label) => {
  if (!label) return "";
  if (label === "sureName") return "Surname";
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/V2$/, "")
    .replace(/_/g, " ")
    .trim();
};

const formatValueForCSV = (value) => {
  if (value === null || value === undefined || value === "" || value === "N/A") {
    return "N/A";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return Array.isArray(value) ? value.join(", ") : String(value);
};

const appendSectionToCSV = (section, prefix, accumulator) => {
  if (!section || typeof section !== "object") return;

  Object.entries(section).forEach(([key, value]) => {
    const label = prefix
      ? `${prefix} - ${formatLabelForCSV(key)}`
      : formatLabelForCSV(key);

    if (Array.isArray(value)) {
      if (value.length === 0) return;

      if (value.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
        accumulator[label] = value
          .map((item) =>
            Object.entries(item || {})
              .map(([k, v]) => `${formatLabelForCSV(k)}: ${formatValueForCSV(v)}`)
              .join("; ")
          )
          .join(" | ");
      } else {
        accumulator[label] = value.map((item) => formatValueForCSV(item)).join(", ");
      }
    } else if (value && typeof value === "object") {
      appendSectionToCSV(value, label, accumulator);
    } else {
      accumulator[label] = formatValueForCSV(value);
    }
  });
};

export default function UserControl() {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("Show All");
  const [searchText, setSearchText] = useState("");

  const hasMeaningfulData = useCallback((val) => {
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
  }, []);
  
  // Helper to get value by path (nested object access)
  const getValueByPath = useCallback((root, path) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), root);
  }, []);
  
  // Check if a stage has any data (matches DataTableV2 logic)
  const hasAnyStageData = useCallback((profile, stage) => {
    const stageFieldMap = {
      'Welcome': [],
      'Personal Information': ['firstName', 'sureName', 'age', 'maritalStatus', 'childrenOrDependents', 'adultDependents', 'guardianNamed', 'estatePlanGoals'],
      'Net Worth Assessment': ['estateProfileV2.ownsProperty', 'estateProfileV2.ownsVehicle', 'estateProfileV2.ownsBusiness', 'estateProfileV2.ownsValuables', 'estateProfileV2.hasDebts'],
      'Estate Planning Goals': ['estateGoalsV2.assetDistribution', 'estateGoalsV2.careForDependents', 'estateGoalsV2.minimizeTaxes', 'estateGoalsV2.incapacityPlanning', 'estateGoalsV2.emergencyFund', 'estateGoalsV2.financialPlan', 'livingWillV2.healthcareDecisionMakers'],
      'Choosing Estate Planning Tools': ['estateToolsV2.will', 'estateToolsV2.willReview', 'estateToolsV2.trustSetup', 'estateToolsV2.trusts', 'estateToolsV2.donations', 'estateToolsV2.donationsDetails', 'estateToolsV2.lifeInsurance', 'estateToolsV2.digitalAssets'],
      'Tax Planning and Minimization': ['estateTaxV2.estateDuty', 'estateTaxV2.gainsTax', 'estateTaxV2.incomeTax', 'estateTaxV2.protectionClaims'],
      'Business Succession Planning': ['businessV2.businessPlan', 'businessV2.keyPerson'],
      'Living Will and Healthcare Directives': ['livingWillV2.createLivingWill', 'livingWillV2.healthCareDecisions', 'livingWillV2.emergencyHealthcareDecisionMakers'],
      'Review of Foreign Assets': ['reviewForeignAssetsV2.ownProperty', 'additionalConsideration.contactLegalAdviser', 'additionalConsideration.legacyHeirlooms'],
      'Additional Considerations': ['additionalConsideration.legacyHeirlooms', 'additionalConsideration.legacyHeirloomsDetails', 'additionalConsideration.beneficiaryDesignations', 'additionalConsideration.executorRemuneration', 'additionalConsideration.informedNominated', 'additionalConsideration.prepaidFuneral', 'additionalConsideration.petCarePlanning', 'additionalConsideration.setAReminder'],
      'Final Review and Next Steps': ['additionalConsideration.contactLegalAdviser', 'additionalConsideration.legacyHeirlooms', 'additionalConsideration.beneficiaryDesignations', 'additionalConsideration.executorRemuneration', 'additionalConsideration.informedNominated', 'additionalConsideration.prepaidFuneral', 'additionalConsideration.petCarePlanning', 'additionalConsideration.setAReminder'],
    };
    
    const keys = stageFieldMap[stage] || [];
    return keys.some((k) => hasMeaningfulData(getValueByPath(profile, k)));
  }, [hasMeaningfulData, getValueByPath]);

  // Get current stage (matches DataTableV2 getCurrentStage logic exactly)
  const getCurrentStage = useCallback((profile) => {
    // Check if Completed Flow (all Additional Considerations filled)
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
      hasMeaningfulData(getValueByPath(profile, k))
    );
    if (allFinalReviewFieldsFilled) {
      return 'Completed Flow';
    }

    // Check Business Succession Planning conditionally
    const ownBusiness = profile.ownBusiness === 'Yes';
    
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
      if (!hasAnyStageData(profile, stage)) {
        return stage;
      }
    }
    
    // If all stages are complete, return Completed Flow
    return 'Completed Flow';
  }, [hasMeaningfulData, getValueByPath, hasAnyStageData]);

  // Filter function that matches the displayed current stage
  const hasCompletedStage = useCallback((profile, stage) => {
    if (stage === "Show All") return true;
    
    // Completed Flow and Final Review and Next Steps - use getCurrentStage which has the exact same logic as the table
    // The table's getCurrentStage checks: 1) all Additional Considerations filled, OR 2) all stages complete
    if (stage === "Completed Flow" || stage === "Final Review and Next Steps") {
      const currentStage = getCurrentStage(profile);
      // getCurrentStage returns "Completed Flow" if either:
      // - All Additional Considerations fields are filled, OR
      // - All stages are complete (fallback)
      return currentStage === "Completed Flow";
    }
    
    // For other stages, get the actual current stage for this profile (same logic as table display)
    const currentStage = getCurrentStage(profile);
    
    // Match if the current stage equals the selected filter stage
    return currentStage === stage;
  }, [getCurrentStage]);

  // Use useMemo to compute filtered profiles instead of useEffect + state
  const filteredProfiles = useMemo(() => {
    const filtered = profile.filter((p) => {
      const search = searchText.toLowerCase();
  
      const fullName = p.firstName && p.sureName 
        ? `${p.firstName} ${p.sureName}` 
        : p.firstName || p.name || 'N/A';
      const matchesSearch = searchText
        ? (fullName && fullName.toLowerCase().includes(search)) ||
          (p.emailAddress && p.emailAddress.toLowerCase().includes(search))
        : true;
  
      const matchesStage = hasCompletedStage(p, selectedStage);
  
      return matchesSearch && matchesStage;
    });
  
    console.log(
      `Filtered profiles length for stage "${selectedStage}" with search "${searchText}": ${filtered.length}`
    );
    
    return filtered;
  }, [profile, searchText, selectedStage, hasCompletedStage]);

  const exportToCSV = () => {
    if (filteredProfiles.length === 0) {
      alert("No profiles to export.");
      return;
    }
    const csvData = filteredProfiles.map((profile) => {
      const fullName =
        profile.firstName && profile.sureName
          ? `${profile.firstName} ${profile.sureName}`
          : profile.firstName || profile.name || "N/A";

      const baseData = {
        "Full Name": fullName,
        "Email Address": formatValueForCSV(profile.emailAddress),
        "Date Created": formatValueForCSV(profile.dateCreated),
        "Age": formatValueForCSV(profile.age),
        "Marital Status": formatValueForCSV(profile.maritalStatus),
        "Has Dependents": formatValueForCSV(profile.childrenOrDependents?.hasDependents),
        "Dependents Details": formatValueForCSV(profile.childrenOrDependents?.details),
        "Has Adult Dependents": formatValueForCSV(profile.adultDependents?.hasAdultDependents),
        "Adult Dependents Details": formatValueForCSV(profile.adultDependents?.details),
        "Guardian Named": formatValueForCSV(profile.guardianNamed),
        "Estate Planning Goals Summary": formatValueForCSV(profile.estatePlanGoals),
      };

      const additionalConsiderationFields = [
        profile.additionalConsideration?.contactLegalAdviser,
        profile.additionalConsideration?.legacyHeirlooms,
        profile.additionalConsideration?.beneficiaryDesignations,
        profile.additionalConsideration?.executorRemuneration,
        profile.additionalConsideration?.informedNominated,
        profile.additionalConsideration?.prepaidFuneral,
        profile.additionalConsideration?.petCarePlanning,
        profile.additionalConsideration?.setAReminder,
      ];
      const hasAnyAdditionalConsiderations = additionalConsiderationFields.some((field) =>
        hasMeaningfulData(field)
      );

      const currentStage = getCurrentStage(profile);

      const detailData = {
        "Progress Status": hasAnyAdditionalConsiderations ? "Completed" : "In Progress",
        "Current Stage": currentStage,
      };

      const stageColumns = [
        "Personal Information",
        "Net Worth Assessment",
        "Estate Planning Goals",
        "Choosing Estate Planning Tools",
        "Tax Planning and Minimization",
        "Business Succession Planning",
        "Living Will and Healthcare Directives",
        "Review of Foreign Assets",
        "Additional Considerations",
        "Final Review and Next Steps",
      ];

      const stageDataForCsv = stageColumns.reduce((acc, stage) => {
        const isComplete = hasAnyStageData(profile, stage);
        if (isComplete) {
          acc[stage] = "Complete";
        }
        return acc;
      }, {});

      const finalReviewFields = [
        profile.additionalConsideration?.contactLegalAdviser,
        profile.additionalConsideration?.legacyHeirlooms,
        profile.additionalConsideration?.beneficiaryDesignations,
        profile.additionalConsideration?.executorRemuneration,
        profile.additionalConsideration?.informedNominated,
        profile.additionalConsideration?.prepaidFuneral,
        profile.additionalConsideration?.petCarePlanning,
        profile.additionalConsideration?.setAReminder,
      ];

      const completedFlow = finalReviewFields.every((field) => hasMeaningfulData(field));
      if (completedFlow) {
        stageDataForCsv["Completed Flow"] = "Complete";
      }

      const sectionData = {};
      appendSectionToCSV(profile.estateProfileV2, "Estate Profile", sectionData);
      appendSectionToCSV(profile.estateGoalsV2, "Estate Goals", sectionData);
      appendSectionToCSV(profile.estateToolsV2, "Estate Tools", sectionData);
      appendSectionToCSV(profile.estateTaxV2, "Estate Tax", sectionData);
      appendSectionToCSV(profile.businessV2, "Business", sectionData);
      appendSectionToCSV(profile.livingWillV2, "Living Will", sectionData);
      appendSectionToCSV(profile.reviewForeignAssetsV2, "Foreign Assets", sectionData);

      const { legacyHeirloomsDetails, ...additionalConsideration } =
        profile.additionalConsideration || {};
      appendSectionToCSV(
        additionalConsideration,
        "Additional Considerations",
        sectionData
      );
      if (Array.isArray(legacyHeirloomsDetails) && legacyHeirloomsDetails.length > 0) {
        sectionData["Additional Considerations - Legacy Heirlooms"] = legacyHeirloomsDetails
          .map((item) =>
            Object.entries(item || {})
              .map(([k, v]) => `${formatLabelForCSV(k)}: ${formatValueForCSV(v)}`)
              .join("; ")
          )
          .join(" | ");
      }

      return {
        ...baseData,
        ...detailData,
        ...stageDataForCsv,
        ...sectionData,
      };
    });

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "user_profiles.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/userprofiles");
        const result = await response.json();

        if (result && Array.isArray(result.data)) {
          setProfile(result.data);
        } else {
          setProfile([]);
        }
      } catch (error) {
        setProfile([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Only run once on mount
  

  const handleDelete = async (_id) => {
    try {
      const response = await fetch("/api/userprofiles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedProfiles = profile.filter((item) => item._id !== _id);
        setProfile(updatedProfiles);
        // Filter will be automatically recomputed via useMemo
      } else {
        console.error("Failed to delete profile:", result.error);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <main className="bg-[#F9F9F9] min-h-screen text-[#282828]">
      <Layout>
        <div className="min-h-screen w-full">
          <div className="px-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1
                className="text-3xl text-[#282828]"
                style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: "32px",
                    fontWeight: 600,
                    color: '#282828',
                }}
              >
                User Profile
              </h1>
              <Breadcrumb items={[{ label: 'Home', href: '/dashboard' }, { label: 'User Profile', href: '/user-control' }]} />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 border-b border-gray-200 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-3 py-2 rounded border border-gray-300 bg-white text-black"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                    }}
                  />

                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="px-3 py-2 rounded border border-gray-300 bg-white text-black"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                    }}
                  >
                    <option value="Show All">Show All</option>
                    <option value="Completed Flow">Completed Flow</option>
                    <option value="Welcome">Welcome</option>
                    <option value="Personal Information">Personal Information</option>
                    <option value="Net Worth Assessment">Net Worth Assessment</option>
                    <option value="Estate Planning Goals">Estate Planning Goals</option>
                    <option value="Choosing Estate Planning Tools">Choosing Estate Planning Tools</option>
                    <option value="Tax Planning and Minimization">Tax Planning and Minimization</option>
                    <option value="Business Succession Planning">Business Succession Planning</option>
                    <option value="Living Will and Healthcare Directives">Living Will and Healthcare Directives</option>
                    <option value="Review of Foreign Assets">Review of Foreign Assets</option>
                    <option value="Additional Considerations">Additional Considerations</option>
                    <option value="Final Review and Next Steps">Final Review and Next Steps</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {}}
                    style={{
                      backgroundColor: '#4FB848',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Filter
                  </button>
                  <button
                    onClick={exportToCSV}
                    style={{
                      backgroundColor: '#4FB848',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                  </div>
                ) : filteredProfiles.length > 0 ? (
                  <DataTableV2
                    data={filteredProfiles}
                    onDelete={handleDelete}
                    pageSize={100}
                  />
                ) : (
                  <div
                    className="text-center py-8 text-gray-500"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                    }}
                  >
                    No profiles available for the selected criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
