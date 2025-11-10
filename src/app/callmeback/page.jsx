"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from "react";
import DataTableCallMeBack from "./_components/DataTableCallMeBack";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function CallMeBackPage() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/callMeBack"); // ✅ ensure this matches your route
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setRequests(result.data);
        setFilteredRequests(result.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch call me back requests", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter((req) => {
      const text = searchText.toLowerCase();
      return (
        req.firstName?.toLowerCase().includes(text) ||
        req.lastName?.toLowerCase().includes(text) ||
        req.email?.toLowerCase().includes(text) ||
        req.phone?.toLowerCase().includes(text)
      );
    });

    setFilteredRequests(filtered);
  }, [searchText, requests]);

  const handleStatusUpdate = () => {
    fetchRequests(); // re-fetch data after status update
  };

  return (
    <main className="bg-[#F9F9F9] min-h-screen text-[#282828]">
      <Layout>
        <div className="p-2 min-h-screen container mx-auto pl-16">
          <h1
            className="text-3xl mb-4 text-[#282828]"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: "32px",
              color: '#282828',
            }}
          >
            Call Me Back
          </h1>
          <br />
          <div className="flex flex-col h-screen">
            <div className="sticky top-0 z-50 -mt-8 py-2 flex justify-between items-center">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white text-black shadow-lg"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner />
                </div>
              ) : filteredRequests.length > 0 ? (
                <DataTableCallMeBack
                  data={filteredRequests}
                  onStatusUpdate={handleStatusUpdate}
                />
              ) : (
                <p style={{ color: "black" }}>No call back requests found.</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
