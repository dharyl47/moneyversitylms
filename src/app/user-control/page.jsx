"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import DataTableV2 from '@/app/components/DataTableV2';
import LoadingSpinner from '@/app/components/LoadingSpinner'; // Import the spinner

export default function UserControl() {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/userprofiles');
        const result = await response.json();

        if (result && Array.isArray(result.data)) {
          setProfile(result.data);
        } else {
          setProfile([]);
        }
      } catch (error) {
        setProfile([]);
      } finally {
        setIsLoading(false); // Stop loading after fetch
      }
    };

    fetchProfile();
  }, []);

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
        setProfile(profile.filter((item) => item._id !== _id));
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
        <div className="container mx-auto p-6 h-screen">
          <h1 className="text-3xl font-bold mb-4">User Profiles</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner /> {/* Display loading spinner while data is fetching */}
            </div>
          ) : Array.isArray(profile) && profile.length > 0 ? (
            <DataTableV2 data={profile} onDelete={handleDelete} />
          ) : (
            <p>No profiles available.</p>
          )}
        </div>
      </Layout>
    </main>
  );
}
