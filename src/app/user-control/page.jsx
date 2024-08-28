"use client";
import Layout from "@/app/components/Layout";
import React, { useState } from 'react';
import DataTableV2 from '@/app/components/DataTableV2';


export default function UserControl() {
    const [data, setData] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        // Add more data as needed
      ]);

      const handleDelete = (id) => {
        // Handle delete action
        setData(data.filter((item) => item.id !== id));
      };


  return (
    <main className="bg-[#111827] min-h-screen text-white overflow-hidden">
      <Layout>
        <div className="container mx-auto p-6 h-screen">
          <h1 className="text-3xl font-bold mb-4">User Control</h1>
          <DataTableV2 data={data} onDelete={handleDelete} />
        </div>
      </Layout>
    </main>
  );
}
