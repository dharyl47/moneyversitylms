import React, { useState } from 'react';
import ProfileModal from '@/app/components/ProfileModal';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DataTableV2 = ({ data, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;





const questions = {
  // Objectives of Estate Planning
  estatePlanFlexibility: "How important is it for your estate plan to be flexible and adapt to changes in your environment?",
  businessProtectionImportance: "How important is it for your estate plan to protect your business interests?",
  financialSafeguardStrategies: "What strategies would you like in place for safeguarding financial resources for retirement?",
  insolvencyProtectionConcern: "Are you concerned about protecting assets from potential insolvency issues?",
  dependentsMaintenanceImportance: "How important is it to have provisions in place for your dependants' maintenance?",
  taxMinimizationPriority: "How high a priority is it for you to minimize taxes?",
  estatePlanReviewConfidence: "How confident are you in reviewing and updating your estate plan regularly?",

  // Assets
  realEstateProperties: "Do you own any real estate properties, such as houses, apartments, or land?",
  farmProperties: "Do you own a farm? Please provide details about the farm.",
  vehicleProperties: "How many vehicles do you own, and what are their makes, models, and estimated values?",
  valuablePossessions: "Do you own any valuable possessions such as artwork, jewelry, or collectibles?",
  householdEffects: "What is the estimated value of your household effects (e.g., furniture, appliances)?",
  intellectualPropertyRights: "Do you own any intellectual property rights, such as patents, trademarks, or copyrights?",
  assetsInTrust: "Are there assets held in trust? If yes, please specify the nature of the trust and assets.",
  investmentPortfolio: "Please provide details about your investment portfolio.",
  bankBalances: "Do you have cash savings or deposits in bank accounts?",
  businessAssets: "Do you have any business interests or ownership stakes in companies?",
  otherAssets: "Are there any other significant assets you would like to include in your estate plan?",

  // Liabilities
  outstandingMortgageLoans: "Do you have any outstanding mortgage loans? Please specify details.",
  personalLoans: "Are there any personal loans you owe?",
  creditCardDebt: "Do you have any credit card debt? Please specify details.",
  vehicleLoans: "Are there loans for vehicles you own?",
  otherOutstandingDebts: "Are there any other outstanding debts?",
  strategyLiabilities: "Do you have a strategy for managing and reducing your liabilities over time?",
  foreseeableFuture: "Are there any expected changes in your liabilities?",

  // Policies
  lifeInsurancePolicies: "Do you currently have any life insurance policies in place?",
  healthInsurancePolicies: "Are you covered by health insurance policies?",
  propertyInsurance: "Are your properties adequately insured?",
  vehicleInsurance: "Are your vehicles insured?",
  disabilityInsurance: "Do you currently have disability insurance?",
  disabilityInsuranceType: "Which type of disability insurance do you have or consider?",
  disabilityInsuranceAwareness: "Are you aware of any limitations on your disability insurance coverage?",
  contingentLiabilityInsurance: "Do you have contingent liability insurance for unexpected liabilities?",
  buySellInsurance: "Have you considered buy and sell insurance to protect your business partners and family?",
  keyPersonInsurance: "Do you have key person insurance in place for business continuity?",
  otherInsurance: "Do you have any other types of insurance not mentioned?",
  funeralCoverInfo: "Have you considered obtaining funeral cover for liquidity after passing?",

  // Estate Duty
  estateBequeathToSpouse: "Do you bequeath your estate to your spouse?",
  bequeathToSpouseCondition: "Are there any conditions or limitations on bequests to your spouse?",
  bequeathToSpousePercentage: "Specify the percentage or assets you'd like to leave to your spouse.",
  estateDistributed: "How would you like your estate to be distributed among beneficiaries?",
  estateBequeathResidue: "What happens to the residue of your estate?",
  estateBequeathToTrust: "Do you bequeath any portion of your estate to a trust?",
  estateBequeathProperty: "Is there a specific property bequeathed to a trust?",
  estateBequeathWhom: "To whom are farm implements, tools, or vehicles bequeathed?",
  estateBequeathDifference: "How should asset differences be managed upon massing?",

  // Executor Fees
  noExecutorFeesPolicy: "Are executor's fees payable on proceeds from policies with beneficiary nomination?",

  // Liquidity Position
  liquiditySources: "Are you aware of any sources of liquidity in your estate?",
  shortfallHeirContribution: "If there's a shortfall, are you open to heirs contributing cash?",
  borrowingFundsForShortfall: "Have you considered borrowing funds for shortfalls?",
  lifeAssuranceCashShortfall: "Have you considered life assurance for addressing cash shortfalls?",

  // Maintenance Claims
  maintenanceClaimsAwareness: "Are you aware of any existing maintenance obligations?",
  maintenanceCostOfEducation: "Have you considered the cost of education in your maintenance planning?",
  maintenanceInsurancePolicy: "Have you considered life insurance for maintenance obligations?",

  // Maintenance of Surviving Spouse
  provisionsForSurvivingSpouse: "Are you considering provisions for maintenance of the surviving spouse?",
  reviewExistingProvisionsInfo: "Would you like to review existing provisions for alignment with goals?",
  incomeMaintenanceTax: "What monthly income would be required for spouse maintenance?",

  // Provisions for Dependents
  dependentsIncomeNeeds: "Do your dependents require income for maintenance?",
  shortfallHouseholdIncome: "Have you assessed capital for generating income for dependents?",
  additionalLifeInsuranceDependents: "Have you considered additional life insurance for income needs?",

  // Trusts
  familiarWithTrust: "Are you familiar with trusts?",
  consideredSettingUpTrust: "Have you considered setting up a trust?",
  reasonTrustRelevant: "Are any asset protection reasons relevant to your estate planning?",
  trustAdvantages: "Have you considered the advantages of transferring assets to a trust?",

  // Investment Trusts
  settingUpInvestmentTrust: "Are you interested in setting up an investment trust?",
  investmentTrustFlexibility: "Does investment trust flexibility align with your goals?",
};


// const handleDownloadPDF = (item) => {
//   const doc = new jsPDF({
//     unit: "pt",
//     format: "a4",
//     lineHeight: 1.5,
//   });

//   const marginLeft = 40;
//   const pageWidth = doc.internal.pageSize.getWidth() - marginLeft * 2;
//   let yPosition = 50;
//   doc.setFontSize(12);
//   doc.text(`Profile of ${item.name}`, marginLeft, yPosition);
//   yPosition += 30;

//   // Helper function to format nested data, converting booleans for "uploadDocumentAtEndOfChat"
//   const formatNestedObject = (data) => {
//     if (typeof data === 'object' && data !== null) {
//       return Object.entries(data)
//         .map(([key, value]) => {
//           if (key === 'uploadDocumentAtEndOfChat') {
//             // Convert boolean to "Yes" or "No"
//             return `Uploaded Document: ${value === true ? 'Yes' : 'No'}`;
//           }
//           return typeof value === 'object' ? formatNestedObject(value) : value;
//         })
//         .filter(value => value) // Remove empty values
//         .join(', ');
//     }
//     return data === true ? 'Yes' : data === false ? 'No' : data || 'N/A';
//   };

//   // Function to add questions and answers to the PDF with proper formatting
//   const addSectionToPDF = (title, dataKey, questionKeys) => {
//     doc.setFontSize(14);
//     doc.text(title, marginLeft, yPosition);
//     yPosition += 20;
//     doc.setFontSize(12);

//     questionKeys.forEach((key) => {
//       const question = questions[key];
//       const answer = formatNestedObject(item[dataKey]?.[key]);

//       const questionText = `• ${question}`;
//       const answerText = answer ? `Answer: ${answer}` : 'Answer: N/A';

//       // Split text into lines if it exceeds page width
//       const questionLines = doc.splitTextToSize(questionText, pageWidth);
//       const answerLines = doc.splitTextToSize(answerText, pageWidth - 20);

//       // Add page break if content overflows
//       if (yPosition + (questionLines.length + answerLines.length) * 12 > doc.internal.pageSize.getHeight() - 40) {
//         doc.addPage();
//         yPosition = 50;
//       }

//       // Render question and answer
//       doc.text(questionLines, marginLeft + 10, yPosition);
//       yPosition += questionLines.length * 12;
//       doc.text(answerLines, marginLeft + 20, yPosition);
//       yPosition += answerLines.length * 12 + 10;
//     });

//     yPosition += 20; // Space after each section
//   };

//   // General profile data at the top
//   const fields = [
//     { label: 'Email', value: item.emailAddress },
//     { label: 'Date of Birth', value: item.dateOfBirth },
//     { label: 'Property Regime', value: item.propertyRegime },
//     { label: 'Marital Status', value: item.maritalStatus },
//     { label: 'Deletion Request', value: item.deletionRequest || 'No' },
//   ];

//   fields.forEach((field) => {
//     const text = `${field.label}: ${field.value || 'N/A'}`;
//     const lines = doc.splitTextToSize(text, pageWidth);
//     doc.text(lines, marginLeft, yPosition);
//     yPosition += lines.length * 12;
//   });

//   yPosition += 20; // Space after general profile info

//   // Sections
//   addSectionToPDF("Objectives of Estate Planning", "ObjectivesOfEstatePlanning", [
//     "estatePlanFlexibility",
//     "businessProtectionImportance",
//     "financialSafeguardStrategies",
//     "insolvencyProtectionConcern",
//     "dependentsMaintenanceImportance",
//     "taxMinimizationPriority",
//     "estatePlanReviewConfidence",
//   ]);

//   addSectionToPDF("Assets", "Assets", [
//     "realEstateProperties",
//     "farmProperties",
//     "vehicleProperties",
//     "valuablePossessions",
//     "householdEffects",
//     "intellectualPropertyRights",
//     "assetsInTrust",
//     "investmentPortfolio",
//     "bankBalances",
//     "businessAssets",
//     "otherAssets",
//   ]);

//   addSectionToPDF("Liabilities", "Liabilities", [
//     "outstandingMortgageLoans",
//     "personalLoans",
//     "creditCardDebt",
//     "vehicleLoans",
//     "otherOutstandingDebts",
//     "strategyLiabilities",
//     "foreseeableFuture",
//   ]);

//   addSectionToPDF("Policies", "Policies", [
//     "lifeInsurancePolicies",
//     "healthInsurancePolicies",
//     "propertyInsurance",
//     "vehicleInsurance",
//     "disabilityInsurance",
//     "disabilityInsuranceType",
//     "disabilityInsuranceAwareness",
//     "contingentLiabilityInsurance",
//     "buySellInsurance",
//     "keyPersonInsurance",
//     "otherInsurance",
//     "funeralCoverInfo",
//   ]);

//   addSectionToPDF("Estate Duty", "EstateDuty", [
//     "estateBequeathToSpouse",
//     "bequeathToSpouseCondition",
//     "bequeathToSpousePercentage",
//     "estateDistributed",
//     "estateBequeathResidue",
//     "estateBequeathToTrust",
//     "estateBequeathProperty",
//     "estateBequeathWhom",
//     "estateBequeathDifference",
//   ]);

//   addSectionToPDF("Executor Fees", "ExecutorFees", ["noExecutorFeesPolicy"]);

//   addSectionToPDF("Liquidity Position", "LiquidityPosition", [
//     "liquiditySources",
//     "shortfallHeirContribution",
//     "borrowingFundsForShortfall",
//     "lifeAssuranceCashShortfall",
//   ]);

//   addSectionToPDF("Maintenance Claims", "MaintenanceClaims", [
//     "maintenanceClaimsAwareness",
//     "maintenanceCostOfEducation",
//     "maintenanceInsurancePolicy",
//   ]);

//   addSectionToPDF("Maintenance of Surviving Spouse", "MaintenanceSurvivingSpouse", [
//     "provisionsForSurvivingSpouse",
//     "reviewExistingProvisionsInfo",
//     "incomeMaintenanceTax",
//   ]);

//   addSectionToPDF("Provisions for Dependents", "ProvisionsDependents", [
//     "dependentsIncomeNeeds",
//     "shortfallHouseholdIncome",
//     "additionalLifeInsuranceDependents",
//   ]);

//   addSectionToPDF("Trusts", "Trusts", [
//     "familiarWithTrust",
//     "consideredSettingUpTrust",
//     "reasonTrustRelevant",
//     "trustAdvantages",
//   ]);

//   addSectionToPDF("Investment Trusts", "InvestmentTrusts", [
//     "settingUpInvestmentTrust",
//     "investmentTrustFlexibility",
//   ]);

//   // Save the PDF
//   doc.save(`Profile_${item.name}.pdf`);
// };


const handleDownloadPDF = async (item) => {
  try {
    // Call the backend API to generate the PDF
    const response = await fetch("/api/generatePdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item), // Pass the selected item data to the backend
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Convert the response to a Blob
    const pdfBlob = await response.blob();

    // Create a download link for the PDF
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

  // Pagination settings
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-700 text-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Date of Birth</th>
            <th className="py-2 px-4">Property Regime</th>
            <th className="py-2 px-4">Marital Status</th>
            <th className="py-2 px-4">Request to Remove</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td className="py-2 px-4 text-center">{item.name}</td>
              <td className="py-2 px-4 text-center">{item.emailAddress}</td>
              <td className="py-2 px-4 text-center">{item.dateOfBirth}</td>
              <td className="py-2 px-4 text-center">{item.propertyRegime}</td>
              <td className="py-2 px-4 text-center">{item.maritalStatus}</td>
              <td className="py-2 px-4 text-center">{item.deletionRequest || "No"}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  More Info
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="text-red-500 hover:underline mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleDownloadPDF(item)}
                  className="text-green-500 hover:underline"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-1">
        <button onClick={handlePrevPageSet} disabled={startPage === 1} className="px-3 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50">
          &lt;
        </button>
        
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
            {page}
          </button>
        ))}

        <button onClick={handleNextPageSet} disabled={endPage === totalPages} className="px-3 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50">
          &gt;
        </button>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} selectedItem={selectedItem} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} itemName={itemToDelete?.name} />
    </div>
  );
};

export default DataTableV2;
