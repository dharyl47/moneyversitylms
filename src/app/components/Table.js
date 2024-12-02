import React from 'react';

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 text-sm font-medium text-gray-100"
                >
                  {row[column.accessor]} {/* Dynamically access column data */}
                </td>
              ))}
              <td className="px-6 py-4 text-sm font-medium text-gray-100">
                <button
                  onClick={() => onEdit(row._id, row.question, row.answer)} // Pass question and answer
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
