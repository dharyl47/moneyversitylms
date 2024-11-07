"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import DataTableV2 from '@/app/components/DataTableV2';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function UserControl() {
  const [profile, setProfile] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("Show All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/userprofiles');
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
  }, []);

  useEffect(() => {
    filterProfiles(selectedStage);
  }, [selectedStage, searchText, profile]);

  const hasMeaningfulData = (obj) => {
    if (typeof obj !== "object" || obj === null) return false;

    return Object.values(obj).some((value) => {
      if (typeof value === "object" && value !== null) {
        return hasMeaningfulData(value);
      }
      return value !== null && value !== false && value !== "" && value !== "N/A";
    });
  };

  const hasCompletedStage = (profile, stage) => {
    if (stage === "Show All") return true;

    switch (stage) {
      case "Completed Flow":
        return (
          hasMeaningfulData(profile.Assets) &&
          hasMeaningfulData(profile.Liabilities) &&
          hasMeaningfulData(profile.Policies) &&
          hasMeaningfulData(profile.EstateDuty) &&
          hasMeaningfulData(profile.ExecutorFees) &&
          hasMeaningfulData(profile.LiquidityPosition) &&
          hasMeaningfulData(profile.MaintenanceClaims) &&
          hasMeaningfulData(profile.MaintenanceSurvivingSpouse) &&
          hasMeaningfulData(profile.ProvisionsDependents) &&
          hasMeaningfulData(profile.Trusts) &&
          hasMeaningfulData(profile.InvestmentTrusts)
        );
      case "Assets":
        return hasMeaningfulData(profile.Assets);
      case "Liabilities":
        return hasMeaningfulData(profile.Liabilities);
      case "Policies":
        return hasMeaningfulData(profile.Policies);
      case "Estate Duty":
        return hasMeaningfulData(profile.EstateDuty);
      case "Executor Fees":
        return hasMeaningfulData(profile.ExecutorFees);
      case "Liquidity Position":
        return hasMeaningfulData(profile.LiquidityPosition);
      case "Maintenance Claims":
        return hasMeaningfulData(profile.MaintenanceClaims);
      case "Maintenance Surviving Spouse":
        return hasMeaningfulData(profile.MaintenanceSurvivingSpouse);
      case "Provisions Dependents":
        return hasMeaningfulData(profile.ProvisionsDependents);
      case "Trusts":
        return hasMeaningfulData(profile.Trusts);
      case "Investment Trusts":
        return hasMeaningfulData(profile.InvestmentTrusts);
      default:
        return false;
    }
  };

 const filterProfiles = (stage, profiles = profile) => {
  const filtered = profiles.filter((p) => {
    // Only check the name if searchText is not empty and p.name is a valid string
    const matchesSearch = searchText 
      ? (p.name && p.name.toLowerCase().includes(searchText.toLowerCase())) 
      : true;

    const matchesStage = stage === "Show All" || hasCompletedStage(p, stage);
    
    return matchesSearch && matchesStage;
  });

  setFilteredProfiles(filtered);
  console.log(`Filtered profiles length for stage "${stage}" with search "${searchText}": ${filtered.length}`);
};



  const handleDelete = async (_id) => {
    try {
      const response = await fetch('/api/userprofiles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: _id }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        const updatedProfiles = profile.filter((item) => item._id !== _id);
        setProfile(updatedProfiles);
        filterProfiles(selectedStage, updatedProfiles); // Reapply filter after deletion
      } else {
        console.error('Failed to delete profile:', result.error);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <main className="bg-[#111827] min-h-screen text-white overflow-hidden">
      <Layout>
        <div className="container mx-auto pl-16 h-screen">
          <h1 className="text-3xl font-bold mb-4">User Profiles</h1>

          {/* Search input and dropdown for filtering */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label htmlFor="nameSearch" className="mr-2">Search by Name:</label>
              <input
                id="nameSearch"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Enter name..."
                className="px-3 py-2 rounded-md bg-gray-700 text-gray-200"
              />
            </div>

            <div>
              <label htmlFor="stageFilter" className="mr-2">Filter by Conversation Stage:</label>
              <select
                id="stageFilter"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 rounded-md bg-gray-700 text-gray-200"
              >
                <option value="Show All">Show All</option>
                <option value="Completed Flow">Completed Flow</option>
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Policies">Policies</option>
                <option value="Estate Duty">Estate Duty</option>
                <option value="Executor Fees">Executor Fees</option>
                <option value="Liquidity Position">Liquidity Position</option>
                <option value="Maintenance Claims">Maintenance Claims</option>
                <option value="Maintenance Surviving Spouse">Maintenance Surviving Spouse</option>
                <option value="Provisions Dependents">Provisions Dependents</option>
                <option value="Trusts">Trusts</option>
                <option value="Investment Trusts">Investment Trusts</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : Array.isArray(filteredProfiles) && filteredProfiles.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTableV2 data={filteredProfiles} onDelete={handleDelete} />
            </div>
          ) : (
            <p>No profiles available for the selected criteria.</p>
          )}
        </div>
      </Layout>
    </main>
  );
}
