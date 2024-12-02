import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Parse request body
    const userProfile = await req.json();
    console.log("mydata", userProfile)

    // Path to the PDF template
    const templatePath = path.join(
      process.cwd(),
      "public/downloadables/OM_EstatePlanning_BlankReport.pdf"
    );

    // Read the template PDF file as Buffer and convert to Uint8Array
    const pdfBuffer = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));

    // Get the form
    const form = pdfDoc.getForm();

    // Populate text fields
    const textFields = {
  name: userProfile?.name || "N/A",
  propertyRegime: userProfile?.propertyRegime || "N/A",
  email: userProfile?.emailAddress || "N/A",
  birthday: userProfile?.dateOfBirth || "N/A",
  maritalStatus: userProfile?.maritalStatus || "N/A",
  estatePlanReviewConfidence: userProfile?.ObjectivesOfEstatePlanning?.estatePlanReviewConfidence || "N/A",
  businessProtectionImportance: userProfile?.ObjectivesOfEstatePlanning?.businessProtectionImportance || "N/A",
  insolvencyProtectionConcern: userProfile?.ObjectivesOfEstatePlanning?.insolvencyProtectionConcern || "N/A",
  taxMinimizationPriority: userProfile?.ObjectivesOfEstatePlanning?.taxMinimizationPriority || "N/A",
  additionalLifeInsuranceDependents_answer: userProfile?.ProvisionsDependents?.additionalLifeInsuranceDependents?.answer || "N/A",
  awarePotentialDonations_answer: userProfile?.Trusts?.awarePotentialDonations?.answer || "N/A",
  bequeathToSpouseCondition_answer: userProfile?.EstateDuty?.bequeathToSpouseCondition?.answer || "N/A",
  bequeathToSpousePercentage_answer: userProfile?.EstateDuty?.bequeathToSpousePercentage?.answer || "N/A",
  borrowingFundsForShortfall_answer: userProfile?.LiquidityPosition?.borrowingFundsForShortfall?.answer || "N/A",
  consideredSellingAssetTrust_answer: userProfile?.Trusts?.consideredSellingAssetTrust?.answer || "N/A",
  consideredSettingUpTrust_answer: userProfile?.Trusts?.consideredSettingUpTrust?.answer || "N/A",
  consideringDonatingTrust_answer: userProfile?.Trusts?.consideringDonatingTrust?.answer || "N/A",
  contingentLiabilityInsurance_answer: userProfile?.Policies?.contingentLiabilityInsurance?.answer || "N/A",
  creditCardDebt_dl: userProfile?.Liabilities?.creditCardDebt?.propertiesDetails || "N/A",
  disabilityInsuranceAwareness_answer: userProfile?.Policies?.disabilityInsuranceAwareness?.answer || "N/A",
  disabilityInsuranceType_answer: userProfile?.Policies?.disabilityInsuranceType?.answer || "N/A",
  estateBequeathDifference_answer: userProfile?.EstateDuty?.estateBequeathDifference?.answer || "N/A",
  estateBequeathProperty_answer: userProfile?.EstateDuty?.estateBequeathProperty?.answer || "N/A",
  estateBequeathResidue_answer: userProfile?.EstateDuty?.estateBequeathResidue?.answer || "N/A",
  estateBequeathToSpouse_answer: userProfile?.EstateDuty?.estateBequeathToSpouse?.answer || "N/A",
  estateBequeathToTrust_answer: userProfile?.EstateDuty?.estateBequeathToTrust?.answer || "N/A",
  incomeMaintenanceTax_answer: userProfile?.MaintenanceSurvivingSpouse?.incomeMaintenanceTax?.answer || "N/A",
  investmentTrustFlexibility_answer: userProfile?.InvestmentTrusts?.investmentTrustFlexibility?.answer || "N/A",
  keyPersonInsurance_answer: userProfile?.Policies?.keyPersonInsurance?.answer || "N/A",
  lifeAssuranceCashShortfall_answer: userProfile?.LiquidityPosition?.lifeAssuranceCashShortfall?.answer || "N/A",
  liquiditySources_answer: userProfile?.LiquidityPosition?.liquiditySources?.answer || "N/A",
  maintenanceClaimsAwareness_answer: userProfile?.MaintenanceClaims?.maintenanceClaimsAwareness?.answer || "N/A",
  maintenanceCostOfEducation_answer: userProfile?.MaintenanceClaims?.maintenanceCostOfEducation?.answer || "N/A",
  maintenanceInsurancePolicy_answer: userProfile?.MaintenanceClaims?.maintenanceInsurancePolicy?.answer || "N/A",
  noExecutorFeesPolicy_answer: userProfile?.ExecutorFees?.noExecutorFeesPolicy?.answer || "N/A",
  provideGuidanceFinancialInfo_answer: userProfile?.ProvisionsDependents?.provideGuidanceFinancialInfo?.answer || "N/A",
  provisionConsidered_answer: userProfile?.MaintenanceSurvivingSpouse?.provisionConsidered?.answer || "N/A",
  provisionsForSurvivingSpouse_answer: userProfile?.MaintenanceSurvivingSpouse?.provisionsForSurvivingSpouse?.answer || "N/A",
  reasonTrustRelevant_answer: userProfile?.Trusts?.reasonTrustRelevant?.answer || "N/A",
  reviewExistingProvisionsInfo_answer: userProfile?.MaintenanceSurvivingSpouse?.reviewExistingProvisionsInfo?.answer || "N/A",
  settingUpInvestmentTrust_answer: userProfile?.InvestmentTrusts?.settingUpInvestmentTrust?.answer || "N/A",
  shortfallHeirContribution_answer: userProfile?.LiquidityPosition?.shortfallHeirContribution?.answer || "N/A",
  shortfallHouseholdIncome_answer: userProfile?.ProvisionsDependents?.shortfallHouseholdIncome?.answer || "N/A",
  trustAdvantages_answer: userProfile?.Trusts?.trustAdvantages?.answer || "N/A",
};


    for (const [field, value] of Object.entries(textFields)) {
      form.getTextField(field).setText(value?.toString() || "N/A");
    }

    // Fields requiring "✓" based on truthy values
    const dependantFields = {
  spouse: userProfile?.dependants?.spouse,
  grandchildren: userProfile?.dependants?.grandChildren,
  children: userProfile?.dependants?.children,
  factualdependents: userProfile?.dependants?.factualDependents,
  stepchildren: userProfile?.dependants?.stepChildren,
  otherDependents: userProfile?.dependants?.other,
};

// Process dependant fields
for (const [field, value] of Object.entries(dependantFields)) {
  if (value) {
    const textField = form.getTextField(field);
    textField.setText("X"); // Mark as "X" for true values
  }
}

// Process other check fields requiring "X" based on truthy values
const otherCheckFields = {
  currentWill: userProfile?.will,
  farm: userProfile?.ownFarm,
  trust: userProfile?.templatesDownloaded?.trust,
  investmentPortfolio: userProfile?.ownInvestmentPortfolio,
  business: userProfile?.asset?.businessInterests,
  retirementFund: userProfile?.ownRetirementFund,
  establishTrust: userProfile?.Trusts?.consideredSettingUpTrust?.answer,
  buySellAgreement: userProfile?.Policies?.buySellInsurance?.answer,
  businessSuccessionPlanning: userProfile?.ownBusiness,
  separationPersonal: userProfile?.asset?.personalProperty,
  setUpInsurance: userProfile?.Policies?.setUpInsurance,
  contingentLiabilityInsurance: userProfile?.Policies?.contingentLiabilityInsurance?.answer,
  debtRepaymentPlan: userProfile?.Liabilities?.strategyLiabilities?.propertiesDetails,
  legalAgreements: userProfile?.asset?.legalAgreements,
  diversifiedInvestment: userProfile?.InvestmentsPortfolio?.stocksEquities?.details,
  assetProtectionPlanning: userProfile?.ObjectivesOfEstatePlanning?.financialSafeguardStrategies,
  realEstateProperties_up: userProfile?.Assets?.realEstateProperties?.uploadDocumentAtEndOfChat,
  vehicleProperties_up: userProfile?.Assets?.vehicleProperties?.uploadDocumentAtEndOfChat,
  vehicleProperties_dl: userProfile?.Assets?.vehicleProperties?.downloadAtEndOfChat,
  valuablePossessions_up: userProfile?.Assets?.valuablePossessions?.uploadDocumentAtEndOfChat,
  valuablePossessions_dl: userProfile?.Assets?.valuablePossessions?.downloadAtEndOfChat,
  householdEffects_up: userProfile?.Assets?.householdEffects?.uploadDocumentAtEndOfChat,
  householdEffects_dl: userProfile?.Assets?.householdEffects?.downloadAtEndOfChat,
  assetsInTrust_up: userProfile?.Assets?.assetsInTrust?.uploadDocumentAtEndOfChat,
  assetsInTrust_dl: userProfile?.Assets?.assetsInTrust?.downloadAtEndOfChat,
  investmentPortfolio_up: userProfile?.Assets?.investmentPortfolio?.uploadDocumentAtEndOfChat,
  investmentPortfolio_dl: userProfile?.Assets?.investmentPortfolio?.downloadAtEndOfChat,
  outstandingMortgageLoans_up: userProfile?.Liabilities?.outstandingMortgageLoans?.uploadDocumentAtEndOfChat,
  personalLoans_up: userProfile?.Liabilities?.personalLoans?.uploadDocumentAtEndOfChat,
  creditCardDebt_up: userProfile?.Liabilities?.creditCardDebt?.uploadDocumentAtEndOfChat,
  vehicleLoans_up: userProfile?.Liabilities?.vehicleLoans?.uploadDocumentAtEndOfChat,
  lifeInsurancePolicies_up: userProfile?.Policies?.lifeInsurancePolicies?.uploadDocumentAtEndOfChat,
  healthInsurancePolicies_up: userProfile?.Policies?.healthInsurancePolicies?.uploadDocumentAtEndOfChat,
  propertyInsurance_up: userProfile?.Policies?.propertyInsurance?.uploadDocumentAtEndOfChat,
  vehicleInsurance_up: userProfile?.Policies?.vehicleInsurance?.uploadDocumentAtEndOfChat,
  disabilityInsurance_up: userProfile?.Policies?.disabilityInsurance?.answer,
  otherInsurance_up: userProfile?.Policies?.otherInsurance?.uploadDocumentAtEndOfChat,
};

for (const [field, value] of Object.entries(otherCheckFields)) {
  if (value) {
    const textField = form.getTextField(field);
    textField.setText("X"); // Mark as "X" for true values
  }
}

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();

    // Return the filled PDF as a response
    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="filled_estate_planning_report.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      { status: 500 }
    );
  }
}