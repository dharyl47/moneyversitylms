import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  selectedYear?: string;
}

export default function ChartCard({ title, children, selectedYear }: ChartCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 
        className="text-xl font-semibold mb-2 text-gray-900"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: "18px",
          lineHeight: '20px',
        }}
      >
        {title} {selectedYear && selectedYear !== "all" && `(${selectedYear})`}
      </h2>
      {children}
    </div>
  );
}

