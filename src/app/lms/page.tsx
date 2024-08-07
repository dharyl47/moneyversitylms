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
          console.log(data)
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
    <main>
      <Layout>
        <div className="p-4">
          <h1 className="text-xl mb-4">Prompt</h1>
          <TextArea
            value={text}
            onChange={handleChange}
            placeholder="Type something..."
            rows={6}
          />
        </div>
        
        <div className="p-6 flex justify-end">
          <Button onClick={handleClick} text="Submit" />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Table</h1>
          <Table columns={columns} data={data} />
        </div>
      </Layout>
    </main>
  );
}
