"use client";
import Layout from "@/app/components/Layout";
import React, { useState } from 'react';
import TextArea from '../components/TextArea';
import Table from '../components/Table';
import Button from '../components/Button';

export default function LMS() {
  const [text, setText] = useState('');

  const columns = [
    { Header: 'Promp', accessor: 'promp' },
    { Header: 'Added_at', accessor: 'added_at' },
    { Header: 'Created_at', accessor: 'created_at' },
  ];
  
  const data = [
    { promp: 'test', added_at: 'test', created_at: 'test' },
    { promp: 'test', added_at: 'test', created_at: 'test' },
    // Add more rows as needed
  ];

  const handleClick = () => {
    alert('Button clicked!');
  };

  const handleChange = (e: any) => {
    setText(e.target.value);
  };
  
  return (
    <main>
        <Layout>
          <div className="p-4">
            <h1 className="text-xl mb-4">Promp</h1>
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