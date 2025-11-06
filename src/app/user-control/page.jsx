"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTableV2 from "./_components/DataTableV2";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Breadcrumb from "@/app/components/Breadcrumb";
import Papa from "papaparse";

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
      const fullName = profile.firstName && profile.sureName 
        ? `${profile.firstName} ${profile.sureName}` 
        : profile.firstName || profile.name || 'N/A';
      
      return {
        Name: fullName,
        DateCreated: profile.dateCreated,
        PropertyRegime: profile.propertyRegime,
        "Completed Stages": Object.keys(profile)
          .filter((key) => hasMeaningfulData(profile[key]))
          .join(", "),
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
    <main className="bg-[#F4F6F9] min-h-screen">
      <Layout>
        {/* Main Container */}
        <div className="min-h-screen w-full">
          {/* Header with Title and Breadcrumb */}
          <div className="flex justify-between items-start mb-4">
          <h1
            className="text-3xl mb-4 text-gray-900"
            style={{
                fontFamily: 'Montserrat, sans-serif',
              fontSize: "27px",
                fontWeight: 600,
            }}
          >
            User Profile
          </h1>
            <Breadcrumb items={[{ label: 'Home', href: '/dashboard' }, { label: 'User Profile', href: '/user-control' }]} />
          </div>

          {/* White Container with Filters and Table */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Filter Controls */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-4">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-black"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                  }}
                />

                {/* Filter Dropdown */}
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-black"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
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

                {/* Filter Button */}
                <button
                  onClick={() => {}}
                  style={{
                    backgroundColor: '#4FB848',
                    borderRadius: '5px',
                    fontFamily: 'Montserrat, sans-serif',
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

                {/* Export to CSV Button */}
                <button
                  onClick={exportToCSV}
                  style={{
                    backgroundColor: '#4FB848',
                    borderRadius: '5px',
                    fontFamily: 'Montserrat, sans-serif',
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

            {/* Table Container */}
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
                <div className="text-center py-8 text-gray-500" style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                }}>
                  No profiles available for the selected criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
