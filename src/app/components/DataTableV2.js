import React from 'react';

const DataTableV2 = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-700 text-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 text-center">{item.name}</td>
              <td className="py-2 px-4 text-center">{item.email}</td>
              <td className="py-2 px-4 text-center">
                {/* <button
                  onClick={() => onEdit(item.id)}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Edit
                </button> */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-500 hover:underline"
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

export default DataTableV2;
