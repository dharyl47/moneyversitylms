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
        className="text-lg font-semibold mb-2 text-gray-900"
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: "20px",
          lineHeight: '26px',
          color: '#282828',
        }}
      >
        {title} {selectedYear && selectedYear !== "all" && `(${selectedYear})`}
      </h2>
      {children}
    </div>
  );
}

