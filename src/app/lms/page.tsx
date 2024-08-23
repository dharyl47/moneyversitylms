"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import TextArea from '../components/TextArea';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EditModal from '../components/EditModal';

interface LearningMaterial {
  _id: string;
  prompt: string;
  addedBy: string;
  createdAt: string;
}

export default function LMS() {
  const [text, setText] = useState('');
  const [data, setData] = useState<LearningMaterial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'edit' | 'delete' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string>('');

  const columns = [
    { Header: 'Prompt', accessor: 'prompt' },
    { Header: 'Added_by', accessor: 'addedBy' },
    { Header: 'Created_at', accessor: 'createdAt' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/learningMaterials');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error('Failed to fetch data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      const response = await fetch('/api/learningMaterials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          addedBy: 'test@test.com', // Replace with the actual user data
        }),
      });

      const result = await response.json();

      if (result.success) {
        setData((prevData) => [...prevData, result.data]);
        setText('');
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const openEditModal = (id: string, text: string) => {
    setSelectedId(id);
    setCurrentText(text);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedId(null);
    setCurrentText('');
  };

  const saveEdit = async (newText: string) => {
    if (selectedId) {
      try {
        const response = await fetch('/api/learningMaterials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedId,
            prompt: newText,
            addedBy: 'test@test.com', // Replace with the actual user data
          }),
        });

        const result = await response.json();

        if (result.success) {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === selectedId ? result.data : item
            )
          );
        } else {
          alert('Failed to update the item.');
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }

    closeEditModal();
  };

  const openModal = (action: 'edit' | 'delete', id: string) => {
    setCurrentAction(action);
    setSelectedId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentAction(null);
    setSelectedId(null);
  };

  const confirmAction = async () => {
    if (currentAction === 'delete' && selectedId) {
      try {
        const response = await fetch('/api/learningMaterials', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: selectedId }),
        });

        const result = await response.json();

        if (result.success) {
          setData((prevData) => prevData.filter((item) => item._id !== selectedId));
        } else {
          alert('Failed to delete the item.');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }

    closeModal();
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <Layout>
        <div className="h-screen">
          <div className="max-w-7xl mx-auto p-6 bg-gray-800 shadow-md rounded-lg ">
            <h1 className="text-2xl font-semibold mb-6">Add New Prompt</h1>
            <TextArea
              value={text}
              onChange={handleChange}
              placeholder="Type something..."
              rows={6}
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleClick}
                text="Submit"
                className="px-6 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-800 shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Learning Materials</h1>
            <Table
              columns={columns}
              data={data}
              onEdit={(id : any, text : any) => openEditModal(id, text)}
              onDelete={(id : any) => openModal('delete', id)}
            />
          </div>
        </div>
      </Layout>

      <EditModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSave={saveEdit}
        currentText={currentText}
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        message="Are you sure you want to delete this item?"
      />
    </main>
  );
}
