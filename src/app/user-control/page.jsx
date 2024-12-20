"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import DataTableV2 from '@/app/components/DataTableV2';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Papa from "papaparse";

export default function UserControl() {
  const [profile, setProfile] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("Show All");
  const [searchText, setSearchText] = useState("");

  const exportToCSV = () => {
  if (filteredProfiles.length === 0) {
    alert("No profiles to export.");
    return;
  }

  const csvData = filteredProfiles.map((profile) => ({
    Name: profile.name,
    DateCreated: profile.dateCreated,
    PropertyRegime: profile.propertyRegime,
    Email: profile.emailAddress,
    "Completed Stages": Object.keys(profile).filter(
      (key) => hasMeaningfulData(profile[key])
    ).join(", "),
  }));

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
    <main className="bg-[#111827] min-h-screen text-white ">
  <Layout>
    {/* Main Container */}
    <div className="p-6 min-h-screen container mx-auto pl-16">
       
               <h1 className="text-3xl font-bold mb-4">User Profile</h1><br/>
    <div className="flex flex-col h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#111827]  py-2 flex justify-between items-center">
       
        <div className="flex space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Enter name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-700 text-gray-200"
          />
          {/* Filter Dropdown */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-700 text-gray-200"
          >
            <option value="Show All">Show All</option>
            <option value="Completed Flow">Completed Flow</option>
            {/* Other options */}
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
          <DataTableV2 data={filteredProfiles} onDelete={handleDelete} pageSize={100} />
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
