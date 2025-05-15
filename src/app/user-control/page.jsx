"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from "react";
import DataTableV2 from "@/app/components/DataTableV2";
import LoadingSpinner from "@/app/components/LoadingSpinner";
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
      "Completed Stages": Object.keys(profile)
        .filter((key) => hasMeaningfulData(profile[key]))
        .join(", "),
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
  }, []);

  useEffect(() => {
    filterProfiles(selectedStage);
  }, [selectedStage, searchText, profile]);

  const hasMeaningfulData = (obj) => {
    if (obj === null || obj === undefined) return false;
  
    if (typeof obj !== "object") {
      return obj !== "" && obj !== false && obj !== "N/A";
    }
  
    return Object.values(obj).some((value) => hasMeaningfulData(value));
  };
  

  const hasCompletedStage = (profile, stage) => {
    if (stage === "Show All") return true;
  
    if (stage === "Completed Flow") {
      return (
        hasMeaningfulData(profile.estateProfileV2) &&
        hasMeaningfulData(profile.estateGoalsV2) &&
        hasMeaningfulData(profile.estateToolsV2) &&
        hasMeaningfulData(profile.estateTaxV2) &&
        hasMeaningfulData(profile.businessV2) &&
        hasMeaningfulData(profile.livingWillV2) &&
        hasMeaningfulData(profile.reviewForeignAssetsV2)
      );
    }
  
    return false; // For now, only handling 'Show All' and 'Completed Flow'
  };
  

  const filterProfiles = (stage, profiles = profile) => {
    const filtered = profiles.filter((p) => {
      const search = searchText.toLowerCase();
  
      const matchesSearch = searchText
        ? (p.name && p.name.toLowerCase().includes(search)) ||
          (p.emailAddress && p.emailAddress.toLowerCase().includes(search))
        : true;
  
      const matchesStage = hasCompletedStage(p, stage);
  
      return matchesSearch && matchesStage;
    });
  
    setFilteredProfiles(filtered);
    console.log(
      `Filtered profiles length for stage "${stage}" with search "${searchText}": ${filtered.length}`
    );
  };
  

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
                  placeholder="Search by name or email..."
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
