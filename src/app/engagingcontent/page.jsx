"use client";
import { useState, useEffect } from 'react';
import Layout from "@/app/components/Layout";
import ContentUpload from '@/app/components/ContentUpload'; // Import the unified component
import DataTable from '@/app/components/DataTable'; // Import the DataTable component

export default function EngagingContent() {
  const [settings, setSettings] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // Fetch settings data from API
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const result = await response.json();

        if (result.success) {
          setSettings(result.data);
        } else {
          console.error('Failed to fetch data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleEdit = async (id, updatedItem) => {
  try {
    // Debug updatedItem to ensure it's properly passed
    console.log('Updated Item:', updatedItem);

    if (!updatedItem || !updatedItem.engagingPrompt) {
      throw new Error('Updated item is undefined or missing required fields.');
    }

    const formData = new FormData();
    formData.append('engagingPrompt', updatedItem.engagingPrompt);
    formData.append('engagingVideo', updatedItem.engagingVideo || '');

    if (updatedItem.engagingImageFile) {
      formData.append('engagingImage', updatedItem.engagingImageFile);
    }

    const response = await fetch(`/api/settings/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      await fetchSettings();
      setEditingItem(null);
    } else {
      console.error('Failed to update item');
    }
  } catch (error) {
    console.error('Error updating item:', error);
  }
};




  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/settings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Fetch updated settings data
        await fetchSettings();
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSave = () => {
    // Optionally, you can refresh the data or perform other actions after save
    console.log('Content has been saved.');
    // For example, refresh the settings data
    fetchSettings();
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      setSettings(result.data); // Ensure you access the correct property
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <main className="bg-gray-900 text-white">
      <Layout>
         <div className="p-6 min-h-screen container mx-auto pl-16">
       
               <h1 className="text-3xl font-bold mb-4">Engaging Content</h1><br/>
        <div className="max-w-7xl mx-auto">
          {/* Unified Upload Component */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upload Content</h2>
            <ContentUpload onSave={handleSave} />
          </div>

          {/* DataTable Component for managing settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Manage Engaging Content</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <DataTable
                data={settings}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Editing Form (Optional) */}
          {editingItem && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
              <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(editingItem._id, editingItem);
                }}
                className="flex flex-col gap-4"
              >
                <label>
                  <span className="text-gray-300">Name</span>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                  />
                </label>
                {/* Add other fields as needed */}
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-gray-100 font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
        </div>
      </Layout>
    </main>
  );
}
