"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect, useCallback } from "react";
import DataTableV2 from "@/app/components/DataTableV2";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Papa from "papaparse";

export default function UserControl() {
  const [profile, setProfile] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("Show All");
  const [searchText, setSearchText] = useState("");

  const hasMeaningfulData = useCallback((obj) => {
    if (obj === null || obj === undefined) return false;
  
    if (typeof obj !== "object") {
      return obj !== "" && obj !== false && obj !== "N/A";
    }
  
    return Object.values(obj).some((value) => hasMeaningfulData(value));
  }, []);
  
  const hasCompletedStage = useCallback((profile, stage) => {
    if (stage === "Show All") return true;
  
    // Completed Flow: User has completed ALL Additional Considerations fields
    if (stage === "Completed Flow") {
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
      return additionalConsiderationFields.every(field => hasMeaningfulData(field));
    }

    // Stage 1: Welcome - No data collected (always show)
    if (stage === "Welcome") return true;

    // Stage 2: Personal Information
    if (stage === "Personal Information") {
      return (
        hasMeaningfulData(profile.firstName) ||
        hasMeaningfulData(profile.sureName) ||
        hasMeaningfulData(profile.age) ||
        hasMeaningfulData(profile.maritalStatus) ||
        hasMeaningfulData(profile.childrenOrDependents) ||
        hasMeaningfulData(profile.adultDependents) ||
        hasMeaningfulData(profile.guardianNamed) ||
        hasMeaningfulData(profile.estatePlanGoals)
      );
    }

    // Stage 3: Net Worth Assessment
    if (stage === "Net Worth Assessment") {
      return (
        hasMeaningfulData(profile.estateProfileV2?.ownsProperty) ||
        hasMeaningfulData(profile.estateProfileV2?.ownsVehicle) ||
        hasMeaningfulData(profile.estateProfileV2?.ownsBusiness) ||
        hasMeaningfulData(profile.estateProfileV2?.ownsValuables) ||
        hasMeaningfulData(profile.estateProfileV2?.hasDebts)
      );
    }

    // Stage 4: Estate Planning Goals
    if (stage === "Estate Planning Goals") {
      return (
        hasMeaningfulData(profile.estateGoalsV2?.assetDistribution) ||
        hasMeaningfulData(profile.estateGoalsV2?.careForDependents) ||
        hasMeaningfulData(profile.estateGoalsV2?.minimizeTaxes) ||
        hasMeaningfulData(profile.estateGoalsV2?.incapacityPlanning) ||
        hasMeaningfulData(profile.estateGoalsV2?.emergencyFund) ||
        hasMeaningfulData(profile.estateGoalsV2?.financialPlan) ||
        hasMeaningfulData(profile.livingWillV2?.healthcareDecisionMakers)
      );
    }

    // Stage 5: Choosing Estate Planning Tools
    if (stage === "Choosing Estate Planning Tools") {
      return (
        hasMeaningfulData(profile.estateToolsV2?.will) ||
        hasMeaningfulData(profile.estateToolsV2?.willReview) ||
        hasMeaningfulData(profile.estateToolsV2?.trustSetup) ||
        hasMeaningfulData(profile.estateToolsV2?.trusts) ||
        hasMeaningfulData(profile.estateToolsV2?.donations) ||
        hasMeaningfulData(profile.estateToolsV2?.donationsDetails) ||
        hasMeaningfulData(profile.estateToolsV2?.lifeInsurance) ||
        hasMeaningfulData(profile.estateToolsV2?.digitalAssets)
      );
    }

    // Stage 6: Tax Planning and Minimization
    if (stage === "Tax Planning and Minimization") {
      return (
        hasMeaningfulData(profile.estateTaxV2?.estateDuty) ||
        hasMeaningfulData(profile.estateTaxV2?.gainsTax) ||
        hasMeaningfulData(profile.estateTaxV2?.incomeTax) ||
        hasMeaningfulData(profile.estateTaxV2?.protectionClaims)
      );
    }

    // Stage 7: Business Succession Planning (conditional - only if ownBusiness === "Yes")
    if (stage === "Business Succession Planning") {
      if (profile.ownBusiness !== "Yes") return false;
      return (
        hasMeaningfulData(profile.businessV2?.businessPlan) ||
        hasMeaningfulData(profile.businessV2?.keyPerson)
      );
    }

    // Stage 8: Living Will and Healthcare Directives
    if (stage === "Living Will and Healthcare Directives") {
      return (
        hasMeaningfulData(profile.livingWillV2?.createLivingWill) ||
        hasMeaningfulData(profile.livingWillV2?.healthCareDecisions) ||
        hasMeaningfulData(profile.livingWillV2?.emergencyHealthcareDecisionMakers)
      );
    }

    // Stage 9: Review of Foreign Assets
    if (stage === "Review of Foreign Assets") {
      return (
        hasMeaningfulData(profile.reviewForeignAssetsV2?.ownProperty) ||
        hasMeaningfulData(profile.additionalConsideration?.contactLegalAdviser) ||
        hasMeaningfulData(profile.additionalConsideration?.legacyHeirlooms)
      );
    }

    // Stage 10: Additional Considerations
    if (stage === "Additional Considerations") {
      return (
        hasMeaningfulData(profile.additionalConsideration?.legacyHeirlooms) ||
        hasMeaningfulData(profile.additionalConsideration?.legacyHeirloomsDetails) ||
        hasMeaningfulData(profile.additionalConsideration?.beneficiaryDesignations) ||
        hasMeaningfulData(profile.additionalConsideration?.executorRemuneration) ||
        hasMeaningfulData(profile.additionalConsideration?.informedNominated) ||
        hasMeaningfulData(profile.additionalConsideration?.prepaidFuneral) ||
        hasMeaningfulData(profile.additionalConsideration?.petCarePlanning) ||
        hasMeaningfulData(profile.additionalConsideration?.setAReminder)
      );
    }

    // Stage 11: Final Review and Next Steps - Informational only, no data collected
    // But we consider it "completed" if all Additional Considerations are filled
    if (stage === "Final Review and Next Steps") {
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
      return additionalConsiderationFields.every(field => hasMeaningfulData(field));
    }
  
    return false;
  }, [hasMeaningfulData]);

  const filterProfiles = useCallback((stage, profiles = profile) => {
    const filtered = profiles.filter((p) => {
      const search = searchText.toLowerCase();
  
      const fullName = p.firstName && p.sureName 
        ? `${p.firstName} ${p.sureName}` 
        : p.firstName || p.name || 'N/A';
      const matchesSearch = searchText
        ? (fullName && fullName.toLowerCase().includes(search)) ||
          (p.emailAddress && p.emailAddress.toLowerCase().includes(search))
        : true;
  
      const matchesStage = hasCompletedStage(p, stage);
  
      return matchesSearch && matchesStage;
    });
  
    setFilteredProfiles(filtered);
    console.log(
      `Filtered profiles length for stage "${stage}" with search "${searchText}": ${filtered.length}`
    );
  }, [searchText, hasCompletedStage, profile]);

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
          filterProfiles("Show All", result.data); // Default to "Show All"
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
  }, [filterProfiles]);

  useEffect(() => {
    filterProfiles(selectedStage);
  }, [selectedStage, searchText, profile, filterProfiles]);
  

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
        filterProfiles(selectedStage, updatedProfiles); // Reapply filter after deletion
      } else {
        console.error("Failed to delete profile:", result.error);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <main className="bg-[#111827] min-h-screen text-white ">
      <Layout>
        {/* Main Container */}
        <div className="p-2 min-h-screen container mx-auto pl-16">
          <h1
            className="text-3xl mb-4 text-gray-900"
            style={{
              fontFamily:
                'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
              fontSize: "27px",
            }}
          >
            User Profile
          </h1>
          <br />
          <div className="flex flex-col h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 -mt-8  py-2 flex justify-between items-center">
              <div className="flex space-x-4">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white text-black shadow-lg"
                />

                {/* Filter Dropdown */}
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white text-black shadow-lg"
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
                {/* Export to CSV Button */}
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-green-600 rounded-md text-white hover:bg-green-500"
                >
                  Export to CSV
                </button>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner />
                </div>
              ) : filteredProfiles.length > 0 ? (
                <DataTableV2
                  data={filteredProfiles}
                  onDelete={handleDelete}
                  pageSize={100}
                />
              ) : (
                <p>No profiles available for the selected criteria.</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
