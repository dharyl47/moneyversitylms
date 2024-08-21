"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import TextArea from '../components/TextArea';
import Table from '../components/Table';
import Button from '../components/Button';

interface LearningMaterial {
  _id: string;
  prompt: string;
  addedBy: string;
  createdAt: string;
}

export default function LMS() {
  const [text, setText] = useState('');
  const [data, setData] = useState<LearningMaterial[]>([]);

  const columns = [
    { Header: 'Prompt', accessor: 'prompt' },
    { Header: 'Added_at', accessor: 'addedBy' },
    { Header: 'Created_at', accessor: 'createdAt' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/learningMaterials');
        console.log('Response:', response);
        const result = await response.json();
        console.log('Result:', result);

        if (result.success) {
          setData(result.data);
          console.log(data);
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
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={data}
           
            />
          </div>
        </div>
        </div>
      </Layout>
    </main>
  );
}
