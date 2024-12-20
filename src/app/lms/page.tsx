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
  question: string;
  answer: string;
  addedBy: string;
  createdAt: string;
}

export default function LMS() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<LearningMaterial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const columns = [
    { Header: 'Question/Title', accessor: 'question' },
    { Header: 'Answer', accessor: 'answer' },
    { Header: 'Added By', accessor: 'addedBy' },
    { Header: 'Created At', accessor: 'createdAt' },
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

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/learningMaterials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          addedBy: 'test@test.com', // Replace with actual user data
        }),
      });

      const result = await response.json();

      if (result.success) {
        setData((prevData) => [...prevData, result.data]);
        setQuestion('');
        setAnswer('');
      } else {
        console.error('Failed to add data:', result.error);
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const openEditModal = (id: string, question: string, answer: string) => {
  console.log('openEditModal Called With:', { id, question, answer });
  setSelectedId(id); // Set the selected ID
  setCurrentQuestion(question); // Set the current question
  setCurrentAnswer(answer); // Set the current answer
  setEditModalOpen(true); // Open the modal
};


  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedId(null);
    setCurrentQuestion('');
    setCurrentAnswer('');
  };

  const saveEdit = async (newQuestion: string, newAnswer: string) => {
    if (selectedId) {
      try {
        const response = await fetch('/api/learningMaterials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedId,
            question: newQuestion,
            answer: newAnswer,
            addedBy: 'test@test.com', // Replace with actual user data
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
          console.error('Failed to update the item:', result.error);
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }

    closeEditModal();
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch('/api/learningMaterials', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
      } else {
        console.error('Failed to delete the item:', result.error);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <Layout>
        <div className="p-6 min-h-screen container mx-auto pl-16">
        <div className="h-screen">
          {/* Add New Question and Answer Section */}
               <h1 className="text-3xl font-bold mb-4">LMS</h1>
          <div className="max-w-7xl mx-auto p-6 bg-gray-800 shadow-md rounded-lg ">
       
            <h1 className="text-2xl font-semibold mb-6">Add New Learning Material</h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Question</label>
              <TextArea
                value={question}
                onChange={(e:any) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Answer</label>
              <TextArea
                value={answer}
                onChange={(e:any) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAdd}
                text="Submit"
                className="px-6 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Learning Materials Table */}
          <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-800 shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Learning Materials</h1>
           <Table
  columns={columns}
  data={data}
  onEdit={(id:any, question:any, answer:any) => openEditModal(id, question, answer)} // Pass correct data
  onDelete={(id:any) => deleteItem(id)} // Handle delete
/>


          </div>
        </div>
        </div>
      </Layout>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSave={(newQuestion:any, newAnswer:any) => saveEdit(newQuestion, newAnswer)}
        currentQuestion={currentQuestion}
        currentAnswer={currentAnswer}
      />
    </main>
  );
}
