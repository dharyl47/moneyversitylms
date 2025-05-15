import React, { useState } from 'react';
import ProfileModal from '@/app/components/ProfileModal';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const DataTableV2 = ({ data, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDownloadPDF = async (item) => {
    try {
      const response = await fetch("/api/generatePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${item.name}_Estate_Planning_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete._id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const maxPageButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPageSet = () => {
    if (endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  const handlePrevPageSet = () => {
    if (startPage > 1) {
      setCurrentPage(startPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="min-w-full text-gray-800 border-collapse">
      <thead>
  <tr className="bg-white border-b">
    {["Name", "Email", "Date of Birth", "Current Stage", "Status", "Actions"].map((header) => (
      <th key={header} className="py-3 px-4 text-left text-sm font-semibold border-r last:border-r-0">
        {header}
      </th>
    ))}
  </tr>
</thead>

<tbody>
  {currentItems.map((item, idx) => {
    const requiredSections = [
      "estateProfileV2",
      "estateGoalsV2",
      "estateToolsV2",
      "estateTaxV2",
      "businessV2",
      "livingWillV2",
      "reviewForeignAssetsV2"
    ];

    const hasMeaningfulData = (obj) => {
      if (!obj) return false;
      if (typeof obj === "object") return Object.values(obj).some((v) => v && v !== "N/A");
      return obj !== "" && obj !== "N/A";
    };

    const isCompleted = requiredSections.every((section) => hasMeaningfulData(item[section]));
    const status = isCompleted ? "Completed" : "In Progress";

    const stages = [
      "Consent",
      "Personal Information",
      "Net Worth Assessment",
      "Estate Planning Goals",
      "Choosing Estate Planning Tools",
      "Tax Planning and Minimization",
      "Business Succession Planning",
      "Living Will and Healthcare Directives",
      "Review of Foreign Assets",
      "Final Review and Next Steps"
    ];

    const currentStage = stages.find((stage, index) => {
      return !hasMeaningfulData(item[requiredSections[index]]);
    }) || "Completed";

    return (
      <tr key={item._id} className={`border-b hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <td className="py-2 px-4">{item.name}</td>
        <td className="py-2 px-4">{item.emailAddress}</td>
        <td className="py-2 px-4">{item.dateOfBirth}</td>
        <td className="py-2 px-4">{currentStage}</td>
        <td className={`py-2 px-4 font-semibold ${status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
          {status}
        </td>
        <td className="py-2 px-4 space-x-2">
  <button 
    onClick={() => handleOpenModal(item)} 
    className="text-blue-600 text-sm"
  >
    More Info
  </button>
  <button 
    onClick={() => handleDeleteClick(item)} 
    className="text-red-600 text-sm"
  >
    Delete
  </button>
  <button 
    onClick={() => handleDownloadPDF(item)} 
    className="text-green-600 text-sm"
  >
    Download PDF
  </button>
</td>

      </tr>
    );
  })}
</tbody>


      </table>

      <div className="flex justify-center mt-4 space-x-1">
        <button
          onClick={handlePrevPageSet}
          disabled={startPage === 1}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded-md text-sm font-medium ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPageSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} selectedItem={selectedItem} />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default DataTableV2;
