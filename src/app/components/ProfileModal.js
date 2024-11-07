import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaBalanceScale, FaBuilding, FaFileInvoiceDollar, FaShieldAlt } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa';


// Define question texts for each field
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

const ProfileModal = ({ isOpen, onClose, selectedItem }) => {
  const [toggleQuestions, setToggleQuestions] = useState({});

  const handleToggleQuestion = (key) => {
    setToggleQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile Details</h2>
      <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {/* Objectives of Estate Planning */}
        <Section title="Objectives of Estate Planning" icon={<FaBalanceScale className="mr-2 text-blue-500" />}>
          {renderDisplayField("Estate Plan Flexibility", selectedItem?.ObjectivesOfEstatePlanning?.estatePlanFlexibility, "estatePlanFlexibility")}
          {renderDisplayField("Business Protection Importance", selectedItem?.ObjectivesOfEstatePlanning?.businessProtectionImportance, "businessProtectionImportance")}
          {renderDisplayField("Financial Safeguard Strategies", selectedItem?.ObjectivesOfEstatePlanning?.financialSafeguardStrategies, "financialSafeguardStrategies")}
          {renderDisplayField("Insolvency Protection Concern", selectedItem?.ObjectivesOfEstatePlanning?.insolvencyProtectionConcern, "insolvencyProtectionConcern")}
          {renderDisplayField("Dependents' Maintenance Importance", selectedItem?.ObjectivesOfEstatePlanning?.dependentsMaintenanceImportance, "dependentsMaintenanceImportance")}
          {renderDisplayField("Tax Minimization Priority", selectedItem?.ObjectivesOfEstatePlanning?.taxMinimizationPriority, "taxMinimizationPriority")}
          {renderDisplayField("Estate Plan Review Confidence", selectedItem?.ObjectivesOfEstatePlanning?.estatePlanReviewConfidence, "estatePlanReviewConfidence")}
        </Section>

        {/* Assets */}
        <Section title="Assets" icon={<FaBuilding className="mr-2 text-green-500" />}>
          {renderDisplayField("Real Estate Properties", selectedItem?.Assets?.realEstateProperties?.propertiesDetails, "realEstateProperties")}
          {renderDisplayField("Farm Properties", selectedItem?.Assets?.farmProperties?.propertiesDetails, "farmProperties")}
          {renderDisplayField("Vehicle Properties", selectedItem?.Assets?.vehicleProperties?.propertiesDetails, "vehicleProperties")}
          {renderDisplayField("Valuable Possessions", selectedItem?.Assets?.valuablePossessions?.propertiesDetails, "valuablePossessions")}
          {renderDisplayField("Household Effects", selectedItem?.Assets?.householdEffects?.propertiesDetails, "householdEffects")}
          {renderDisplayField("Intellectual Property Rights", selectedItem?.Assets?.intellectualPropertyRights?.propertiesDetails, "intellectualPropertyRights")}
                    {renderDisplayField("Assets in Trust", selectedItem?.Assets?.assetsInTrust?.propertiesDetails, "assetsInTrust")}
          {renderDisplayField("Investment Portfolio", selectedItem?.Assets?.investmentPortfolio?.propertiesDetails, "investmentPortfolio")}
          {renderDisplayField("Bank Balances", selectedItem?.Assets?.bankBalances?.propertiesDetails, "bankBalances")}
          {renderDisplayField("Business Assets", selectedItem?.Assets?.businessAssets?.propertiesDetails, "businessAssets")}
          {renderDisplayField("Other Assets", selectedItem?.Assets?.otherAssets?.propertiesDetails, "otherAssets")}
        </Section>

        {/* Liabilities */}
        <Section title="Liabilities" icon={<FaFileInvoiceDollar className="mr-2 text-red-500" />}>
          {renderDisplayField("Outstanding Mortgage Loans", selectedItem?.Liabilities?.outstandingMortgageLoans?.propertiesDetails, "outstandingMortgageLoans")}
          {renderDisplayField("Personal Loans", selectedItem?.Liabilities?.personalLoans?.propertiesDetails, "personalLoans")}
          {renderDisplayField("Credit Card Debt", selectedItem?.Liabilities?.creditCardDebt?.propertiesDetails, "creditCardDebt")}
          {renderDisplayField("Vehicle Loans", selectedItem?.Liabilities?.vehicleLoans?.propertiesDetails, "vehicleLoans")}
          {renderDisplayField("Other Outstanding Debts", selectedItem?.Liabilities?.otherOutstandingDebts?.propertiesDetails, "otherOutstandingDebts")}
          {renderDisplayField("Strategy for Liabilities", selectedItem?.Liabilities?.strategyLiabilities?.propertiesDetails, "strategyLiabilities")}
          {renderDisplayField("Foreseeable Future Liabilities", selectedItem?.Liabilities?.foreseeableFuture?.propertiesDetails, "foreseeableFuture")}
        </Section>

        {/* Policies */}
        <Section title="Policies" icon={<FaShieldAlt className="mr-2 text-purple-500" />}>
          {renderDisplayField("Life Insurance Policies", selectedItem?.Policies?.lifeInsurancePolicies?.details, "lifeInsurancePolicies")}
          {renderDisplayField("Health Insurance Policies", selectedItem?.Policies?.healthInsurancePolicies?.details, "healthInsurancePolicies")}
          {renderDisplayField("Property Insurance", selectedItem?.Policies?.propertyInsurance?.details, "propertyInsurance")}
          {renderDisplayField("Vehicle Insurance", selectedItem?.Policies?.vehicleInsurance?.details, "vehicleInsurance")}
          {renderDisplayField("Disability Insurance", selectedItem?.Policies?.disabilityInsurance?.answer, "disabilityInsurance")}
          {renderDisplayField("Disability Insurance Type", selectedItem?.Policies?.disabilityInsuranceType?.answer, "disabilityInsuranceType")}
          {renderDisplayField("Disability Insurance Awareness", selectedItem?.Policies?.disabilityInsuranceAwareness?.answer, "disabilityInsuranceAwareness")}
          {renderDisplayField("Contingent Liability Insurance", selectedItem?.Policies?.contingentLiabilityInsurance?.answer, "contingentLiabilityInsurance")}
          {renderDisplayField("Buy and Sell Insurance", selectedItem?.Policies?.buySellInsurance?.answer, "buySellInsurance")}
          {renderDisplayField("Key Person Insurance", selectedItem?.Policies?.keyPersonInsurance?.answer, "keyPersonInsurance")}
          {renderDisplayField("Other Insurance", selectedItem?.Policies?.otherInsurance?.details, "otherInsurance")}
          {renderDisplayField("Funeral Cover Information", selectedItem?.Policies?.funeralCoverInfo?.answer, "funeralCoverInfo")}
        </Section>

        {/* Estate Duty */}
        <Section title="Estate Duty" icon={<FaBalanceScale className="mr-2 text-blue-600" />}>
          {renderDisplayField("Bequeath Estate to Spouse", selectedItem?.EstateDuty?.estateBequeathToSpouse?.answer, "estateBequeathToSpouse")}
          {renderDisplayField("Conditions on Bequest to Spouse", selectedItem?.EstateDuty?.bequeathToSpouseCondition?.answer, "bequeathToSpouseCondition")}
          {renderDisplayField("Bequeath to Spouse Percentage", selectedItem?.EstateDuty?.bequeathToSpousePercentage?.answer, "bequeathToSpousePercentage")}
          {renderDisplayField("Estate Distributed", selectedItem?.EstateDuty?.estateDistributed?.answer, "estateDistributed")}
          {renderDisplayField("Residue of Estate to Spouse", selectedItem?.EstateDuty?.estateBequeathResidue?.answer, "estateBequeathResidue")}
          {renderDisplayField("Bequeath to Trust", selectedItem?.EstateDuty?.estateBequeathToTrust?.answer, "estateBequeathToTrust")}
          {renderDisplayField("Bequeath Specific Property", selectedItem?.EstateDuty?.estateBequeathProperty?.answer, "estateBequeathProperty")}
          {renderDisplayField("Bequeath to Whom", selectedItem?.EstateDuty?.estateBequeathWhom?.answer, "estateBequeathWhom")}
          {renderDisplayField("Massing of Assets", selectedItem?.EstateDuty?.estateBequeathDifference?.answer, "estateBequeathDifference")}
        </Section>

        {/* Executor Fees */}
        <Section title="Executor Fees" icon={<FaFileInvoiceDollar className="mr-2 text-red-500" />}>
          {renderDisplayField("Executor Fees Policy", selectedItem?.ExecutorFees?.noExecutorFeesPolicy?.answer, "noExecutorFeesPolicy")}
        </Section>

        {/* Liquidity Position */}
        <Section title="Liquidity Position" icon={<FaBalanceScale className="mr-2 text-blue-500" />}>
          {renderDisplayField("Liquidity Sources", selectedItem?.LiquidityPosition?.liquiditySources?.answer, "liquiditySources")}
          {renderDisplayField("Heir Contribution for Shortfall", selectedItem?.LiquidityPosition?.shortfallHeirContribution?.answer, "shortfallHeirContribution")}
          {renderDisplayField("Borrowing for Shortfall", selectedItem?.LiquidityPosition?.borrowingFundsForShortfall?.answer, "borrowingFundsForShortfall")}
          {renderDisplayField("Life Assurance for Shortfall", selectedItem?.LiquidityPosition?.lifeAssuranceCashShortfall?.answer, "lifeAssuranceCashShortfall")}
        </Section>

        {/* Maintenance Claims */}
        <Section title="Maintenance Claims" icon={<FaFileInvoiceDollar className="mr-2 text-red-500" />}>
          {renderDisplayField("Maintenance Claims Awareness", selectedItem?.MaintenanceClaims?.maintenanceClaimsAwareness?.answer, "maintenanceClaimsAwareness")}
          {renderDisplayField("Cost of Education", selectedItem?.MaintenanceClaims?.maintenanceCostOfEducation?.answer, "maintenanceCostOfEducation")}
          {renderDisplayField("Life Insurance for Maintenance", selectedItem?.MaintenanceClaims?.maintenanceInsurancePolicy?.answer, "maintenanceInsurancePolicy")}
        </Section>

        {/* Maintenance of Surviving Spouse */}
        <Section title="Maintenance of Surviving Spouse" icon={<FaBalanceScale className="mr-2 text-blue-500" />}>
          {renderDisplayField("Provisions for Surviving Spouse", selectedItem?.MaintenanceSurvivingSpouse?.provisionsForSurvivingSpouse?.answer, "provisionsForSurvivingSpouse")}
          {renderDisplayField("Review Provisions", selectedItem?.MaintenanceSurvivingSpouse?.reviewExistingProvisionsInfo?.answer, "reviewExistingProvisionsInfo")}
          {renderDisplayField("Income Maintenance after Tax", selectedItem?.MaintenanceSurvivingSpouse?.incomeMaintenanceTax?.answer, "incomeMaintenanceTax")}
        </Section>

        {/* Provisions for Dependents */}
        <Section title="Provisions for Dependents" icon={<FaBuilding className="mr-2 text-green-500" />}>
          {renderDisplayField("Income Needs for Dependents", selectedItem?.ProvisionsDependents?.dependentsIncomeNeeds?.answer, "dependentsIncomeNeeds")}
          {renderDisplayField("Household Income Shortfall", selectedItem?.ProvisionsDependents?.shortfallHouseholdIncome?.answer, "shortfallHouseholdIncome")}
          {renderDisplayField("Additional Life Insurance for Dependents", selectedItem?.ProvisionsDependents?.additionalLifeInsuranceDependents?.answer, "additionalLifeInsuranceDependents")}
        </Section>

        {/* Trusts */}
        <Section title="Trusts" icon={<FaShieldAlt className="mr-2 text-purple-500" />}>
          {renderDisplayField("Familiar with Trusts", selectedItem?.Trusts?.familiarWithTrust?.answer, "familiarWithTrust")}
          {renderDisplayField("Considered Setting Up Trust", selectedItem?.Trusts?.consideredSettingUpTrust?.answer, "consideredSettingUpTrust")}
          {renderDisplayField("Asset Protection Relevance", selectedItem?.Trusts?.reasonTrustRelevant?.answer, "reasonTrustRelevant")}
          {renderDisplayField("Advantages of Trust", selectedItem?.Trusts?.trustAdvantages?.answer, "trustAdvantages")}
        </Section>

        {/* Investment Trusts */}
        <Section title="Investment Trusts" icon={<FaChartLine className="mr-2 text-green-600" />}>
          {renderDisplayField("Setting Up Investment Trust", selectedItem?.InvestmentTrusts?.settingUpInvestmentTrust?.answer, "settingUpInvestmentTrust")}
          {renderDisplayField("Investment Trust Flexibility", selectedItem?.InvestmentTrusts?.investmentTrustFlexibility?.answer, "investmentTrustFlexibility")}
        </Section>

        <div className="text-right">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );

  // Function to render each field with toggle question functionality
  function renderDisplayField(label, value, fieldKey) {
    return (
      <div key={fieldKey} className="flex flex-col">
        <span className="font-medium text-gray-600 cursor-pointer" onClick={() => handleToggleQuestion(fieldKey)}>
          <b>{label}:</b> {value || 'N/A'}
        </span>
        {toggleQuestions[fieldKey] && (
          <small className="text-gray-500 mt-1">{questions[fieldKey]}</small>
        )}
      </div>
    );
  }
};

// Section component for reusable collapsible section structure
const Section = ({ title, icon, children }) => (
  <div className="mb-6">
    <h3 className="flex items-center text-xl font-semibold text-gray-700 mb-2">{icon} {title}</h3>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

export default ProfileModal;

