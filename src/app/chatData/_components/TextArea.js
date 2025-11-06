import React from 'react';

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="border border-gray-600 rounded-md p-2 w-full text-black"
    />
  );
};

export default TextArea;
