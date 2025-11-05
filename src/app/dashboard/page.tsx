"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState, useCallback } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend);

interface Profile {
  name: string;
  dateCreated: string;
  propertyRegime: string;
  ownBusiness?: string;
  Assets?: object;
  Liabilities?: object;
  Policies?: object;
  EstateDuty?: object;
  ExecutorFees?: object;
  LiquidityPosition?: object;
  MaintenanceClaims?: object;
  MaintenanceSurvivingSpouse?: object;
  ProvisionsDependents?: object;
  Trusts?: object;
  InvestmentTrusts?: object;
  InvestmentsPortfolio?: object;
  [key: string]: any; // Allow any additional fields
}

interface Statistics {
  completedFlowByMonth: { [key: string]: number };
  usersByStage: { stage: string; count: number }[];
  propertyRegimeCount: { [key: string]: number };
  userGrowth: { [key: string]: number };
}

// Helper function outside component
const hasMeaningfulData = (obj: any): boolean => {
  if (obj === null || obj === undefined) return false;

  // If it's a primitive value, directly check
  if (typeof obj !== "object") {
    return obj !== "" && obj !== false && obj !== "N/A";
  }

  // If it's an object, check its values recursively
  return Object.values(obj).some((value: any) => hasMeaningfulData(value));
};

export default function Dashboard() {
  const [profileData, setProfileData] = useState<Profile[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [statistics, setStatistics] = useState<Statistics>({
    completedFlowByMonth: {},
    usersByStage: [],
    propertyRegimeCount: {},
    userGrowth: {}
  });

  const calculateStatistics = useCallback((profiles: Profile[], year?: string) => {
    // Filter by year if specified
    let filteredProfiles = profiles;
    if (year && year !== "all") {
      filteredProfiles = profiles.filter((profile) => {
        const profileYear = new Date(profile.dateCreated).getFullYear().toString();
        return profileYear === year;
      });
    }

    // Calculate completed flows per month
    const completedFlowByMonth: { [key: string]: number } = {};
    filteredProfiles.forEach((profile) => {
      if (
        hasMeaningfulData(profile.Assets) &&
        hasMeaningfulData(profile.Liabilities) &&
        hasMeaningfulData(profile.Policies) &&
        hasMeaningfulData(profile.EstateDuty) &&
        hasMeaningfulData(profile.ExecutorFees) &&
        hasMeaningfulData(profile.LiquidityPosition) &&
        hasMeaningfulData(profile.MaintenanceClaims) &&
        hasMeaningfulData(profile.MaintenanceSurvivingSpouse) &&
        hasMeaningfulData(profile.ProvisionsDependents) &&
        hasMeaningfulData(profile.Trusts) &&
        hasMeaningfulData(profile.InvestmentTrusts) &&
        hasMeaningfulData(profile.InvestmentsPortfolio)
      ) {
        const date = new Date(profile.dateCreated);
        const monthKey = date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
        completedFlowByMonth[monthKey] = (completedFlowByMonth[monthKey] || 0) + 1;
      }
    });

const stages = [
  "Personal Information",
  "Net Worth Assessment",
  "Estate Planning Goals",
  "Choosing Estate Planning Tools",
  "Tax Planning and Minimization",
  "Business Succession Planning",
  "Living Will and Healthcare Directives",
  "Review of Foreign Assets",
  "Additional Considerations",
  "Final Review and Next Steps",
];
    
const mapSchemaToStage: Record<string, string[]> = {
  "Personal Information": [
    "name",
    "childrenOrDependents.hasDependents",
    "childrenOrDependents.details",
    "guardianNamed",
    "estatePlanGoals",
    "age",
    "adultDependents",
  ],

  "Net Worth Assessment": [
    // Assets - Real Estate
    "Assets.realEstateProperties.propertiesDetails",
    "Assets.realEstateProperties.inDepthDetails",
    // Assets - Farm
    "Assets.farmProperties.propertiesDetails",
    // Assets - Vehicles
    "Assets.vehicleProperties.propertiesDetails",
    // Assets - Valuables
    "Assets.valuablePossessions.propertiesDetails",
    // Assets - Household Effects
    "Assets.householdEffects.propertiesDetails",
    // Assets - Investment Portfolio
    "Assets.investmentPortfolio.propertiesDetails",
    // Assets - Bank Balances
    "Assets.bankBalances.propertiesDetails",
    // Assets - Business Assets
    "Assets.businessAssets.propertiesDetails",
    // Assets - Other Assets
    "Assets.otherAssets.propertiesDetails",
    // Assets - Intellectual Property
    "Assets.intellectualPropertyRights.propertiesDetails",
    // Assets - Assets in Trust
    "Assets.assetsInTrust.propertiesDetails",
    // Legacy fields
    "estateProfileV2.ownsProperty",
    "estateProfileV2.propertyDetails",
    "estateProfileV2.ownsVehicle",
    "estateProfileV2.vehicleDetails",
    "estateProfileV2.ownsBusiness",
    "estateProfileV2.businessDetails",
    "estateProfileV2.ownsValuables",
    "estateProfileV2.valuableDetails",
    // Liabilities
    "Liabilities.outstandingMortgageLoans.propertiesDetails",
    "Liabilities.personalLoans.propertiesDetails",
    "Liabilities.creditCardDebt.propertiesDetails",
    "Liabilities.vehicleLoans.propertiesDetails",
    "Liabilities.otherOutstandingDebts.propertiesDetails",
    "Liabilities.strategyLiabilities.propertiesDetails",
    "Liabilities.foreseeableFuture.propertiesDetails",
    // Legacy debt fields
    "estateProfileV2.hasDebts",
    "estateProfileV2.debtDetails",
    // Policies
    "Policies.lifeInsurancePolicies.details",
    "Policies.healthInsurancePolicies.details",
    "Policies.propertyInsurance.details",
    "Policies.vehicleInsurance.details",
    "Policies.disabilityInsurance.answer",
    "Policies.disabilityInsuranceType.answer",
    "Policies.disabilityInsuranceAwareness.answer",
    "Policies.disabilityInsuranceAssist.answer",
    "Policies.disabilityInsuranceAssist.alreadyHave",
    "Policies.contingentLiabilityInsurance.answer",
    "Policies.buySellInsurance.answer",
    "Policies.keyPersonInsurance.answer",
    "Policies.keyPersonInsuranceAssist.answer",
    "Policies.otherInsurance.details",
    "Policies.reviewInsurancePolicy.details",
    "Policies.considerFuneralCover.answer",
    "Policies.nominatedFuneralCover.answer",
    "Policies.funeralCoverInfo.answer",
    // InvestmentsPortfolio
    "InvestmentsPortfolio.stocksEquities.details",
    "InvestmentsPortfolio.bondsFixedIncome.details",
    "InvestmentsPortfolio.mutualFunds.details",
    "InvestmentsPortfolio.retirementFunds.details",
    "InvestmentsPortfolio.investmentProperties.details",
    "InvestmentsPortfolio.otherAssetClassess.details",
    "InvestmentsPortfolio.investmentGoalsRiskTolerance.answer",
    "InvestmentsPortfolio.specificInvestmentChanges.answer",
  ],

  "Estate Planning Goals": [
    "estateGoalsV2.assetDistribution",
    "estateGoalsV2.careForDependents",
    "estateGoalsV2.minimizeTaxes",
    "estateGoalsV2.businessSuccession",
    "estateGoalsV2.incapacityPlanning",
    "estateGoalsV2.emergencyFund",
    "estateGoalsV2.financialPlan",
  ],

  "Choosing Estate Planning Tools": [
    "estateToolsV2.trusts",
    "estateToolsV2.will",
    "estateToolsV2.willReview",
    "estateToolsV2.trustSetup",
    "estateToolsV2.donations",
    "estateToolsV2.donationsProceedReview",
    "estateToolsV2.donationsDetails",
    "estateToolsV2.lifeInsurance",
    "estateToolsV2.lifeInsuranceDetails",
    "estateToolsV2.estateExpensePlan",
    "estateToolsV2.marriagePropertyStatus",
    "estateToolsV2.digitalAssets",
    "estateToolsV2.digitalAssetsDetails",
    // Trusts
    "Trusts.familiarWithTrust.answer",
    "Trusts.exploreTrustInfo.answer",
    "Trusts.consideredSettingUpTrust.answer",
    "Trusts.trustConcern.answer",
    "Trusts.reasonTrustRelevant.answer",
    "Trusts.trustAdvantages.answer",
    "Trusts.consideringDonatingTrust.answer",
    "Trusts.awarePotentialDonations.answer",
    "Trusts.consideredSellingAssetTrust.answer",
    "Trusts.familiarTermsAndConditionTrust.answer",
    "Trusts.costAndTaxTrust.answer",
    // InvestmentTrusts
    "InvestmentTrusts.settingUpInvestmentTrust.answer",
    "InvestmentTrusts.investmentTrustFlexibility.answer",
  ],

  "Tax Planning and Minimization": [
    "estateTaxV2.estateDuty",
    "estateTaxV2.gainsTax",
    "estateTaxV2.incomeTax",
    "estateTaxV2.protectionClaims",
    // EstateDuty fields
    "EstateDuty.estateBequeathToSpouse.answer",
    "EstateDuty.bequeathToSpouseCondition.answer",
    "EstateDuty.bequeathToSpousePercentage.answer",
    "EstateDuty.estateDistributed.answer",
    "EstateDuty.bequeathToSpousePortionPercentage.answer",
    "EstateDuty.estateBequeathResidue.answer",
    "EstateDuty.estateBequeathToTrust.answer",
    "EstateDuty.willPlanForTrust.answer",
    "EstateDuty.estateBequeathProperty.answer",
    "EstateDuty.estateBequeathTrustDetails.answer",
    "EstateDuty.estateBequeathWhom.answer",
    "EstateDuty.estateBequeathDifference.answer",
    "EstateDuty.estateBequeathThirdParty.answer",
    "EstateDuty.estateBequeathTrustStructureAssist.answer",
    // ExecutorFees
    "ExecutorFees.noExecutorFeesPolicy.answer",
    "ExecutorFees.noExecutorFeesPolicy.uploadDocumentAtEndOfChat",
    // LiquidityPosition
    "LiquidityPosition.liquiditySources.answer",
    "LiquidityPosition.liquiditySources.uploadDocumentAtEndOfChat",
    "LiquidityPosition.shortfallHeirContribution.answer",
    "LiquidityPosition.shortfallHeirAssist.answer",
    "LiquidityPosition.shortfallHeirContributionAssist.answer",
    "LiquidityPosition.shortfallCreditorsAssist.answer",
    "LiquidityPosition.alternativeFinancingForShortfall.answer",
    "LiquidityPosition.alternativeFinancingAssist.answer",
    "LiquidityPosition.borrowingFundsForShortfall.answer",
    "LiquidityPosition.borrowingFundsForShortfallAssist.answer",
    "LiquidityPosition.alternativeFinancingOptionsAssist.answer",
    "LiquidityPosition.lifeAssuranceCashShortfall.answer",
  ],

  "Business Succession Planning": [
    "businessV2.businessPlan",
    "businessV2.keyPerson",
  ],

  "Living Will and Healthcare Directives": [
    "livingWillV2.createLivingWill",
    "livingWillV2.healthCareDecisions",
    "livingWillV2.healthcareDecisionMakers",
    "livingWillV2.emergencyHealthcareDecisionMakers",
  ],

  "Review of Foreign Assets": [
    "reviewForeignAssetsV2.ownProperty",
  ],

  "Additional Considerations": [
    "additionalConsideration.contactLegalAdviser",
    "additionalConsideration.legacyHeirlooms",
    "additionalConsideration.legacyHeirloomsDetails",
    "additionalConsideration.beneficiaryDesignations",
    "additionalConsideration.executorRemuneration",
    "additionalConsideration.informedNominated",
    "additionalConsideration.prepaidFuneral",
    "additionalConsideration.petCarePlanning",
    "additionalConsideration.setAReminder",
    // MaintenanceClaims
    "MaintenanceClaims.maintenanceClaimsAwareness.answer",
    "MaintenanceClaims.maintenanceClaimsCourtOrder.details",
    "MaintenanceClaims.maintenanceClaimsCourtOrder.uploadDocumentAtEndOfChat",
    "MaintenanceClaims.maintenanceClaimsInfo.answer",
    "MaintenanceClaims.potentialClaimsInfo.answer",
    "MaintenanceClaims.maintenanceCostOfEducation.answer",
    "MaintenanceClaims.maintenanceInsurancePolicy.answer",
    "MaintenanceClaims.maintenanceObligationAssist.answer",
    "MaintenanceClaims.maintenanceConsiderationInfo.answer",
    // MaintenanceSurvivingSpouse
    "MaintenanceSurvivingSpouse.provisionsForSurvivingSpouse.answer",
    "MaintenanceSurvivingSpouse.reviewExistingProvisionsInfo.answer",
    "MaintenanceSurvivingSpouse.makingProvisionsInfo.answer",
    "MaintenanceSurvivingSpouse.implicationProvisionInfo.answer",
    "MaintenanceSurvivingSpouse.incomeMaintenanceTax.answer",
    "MaintenanceSurvivingSpouse.provisionConsidered.answer",
    "MaintenanceSurvivingSpouse.provisionAssistanceInfo.answer",
    "MaintenanceSurvivingSpouse.provisionImpactAssistanceInfo.answer",
    "MaintenanceSurvivingSpouse.provisionInfluenceAssistanceInfo.answer",
    "MaintenanceSurvivingSpouse.provisionsPreferences.answer",
    // ProvisionsDependents
    "ProvisionsDependents.dependentsIncomeNeeds.answer",
    "ProvisionsDependents.shortfallHouseholdIncome.answer",
    "ProvisionsDependents.potentialIncomeShortfallInfo.answer",
    "ProvisionsDependents.evaluatingFinancialSituationInfo.answer",
    "ProvisionsDependents.provideGuidanceFinancialInfo.answer",
    "ProvisionsDependents.lifeInsuranceLinkedPurpose.answer",
    "ProvisionsDependents.additionalLifeInsuranceDependents.answer",
    "ProvisionsDependents.guidanceAssesingLifeInsuranceInfo.answer",
    "ProvisionsDependents.guidanceExploringBenefitsInfo.answer",
    "ProvisionsDependents.reviewFinancialBenefitsInfo.answer",
  ],

  "Final Review and Next Steps": [
    "templatesDownloaded.will",
    "templatesDownloaded.trust",
    "templatesDownloaded.powerOfAttorney",
    "templatesDownloaded.livingWill",
    "templatesDownloaded.allTemplates",
  ],
};
    
    const usersByStage = stages.map((stage) => {
      const schemaKeys = mapSchemaToStage[stage];
      
      // Handle Business Succession Planning conditionally
      if (stage === "Business Succession Planning") {
        return {
          stage,
          count: filteredProfiles.filter((profile) => {
            // Only count if ownBusiness is "Yes"
            if (profile.ownBusiness !== "Yes") return false;
            
            return schemaKeys.some((key: string) => {
              const keys = key.split(".");
              let value: any = profile;
              for (const subKey of keys) {
                value = value?.[subKey as keyof typeof value];
                if (!value) break;
              }
              return hasMeaningfulData(value);
            });
          }).length,
        };
      }
      
      return {
        stage,
        count: filteredProfiles.filter((profile) => {
          return schemaKeys.some((key: string) => {
            const keys = key.split(".");
            let value: any = profile;
            for (const subKey of keys) {
              value = value?.[subKey as keyof typeof value];
              if (!value) break;
            }
            return hasMeaningfulData(value);
          });
        }).length,
      };
    });

    const propertyRegimeCount = filteredProfiles.reduce((acc: { [key: string]: number }, profile) => {
      acc[profile.propertyRegime] = (acc[profile.propertyRegime] || 0) + 1;
      return acc;
    }, {});

    const userGrowth = filteredProfiles.reduce((acc: { [key: string]: number }, profile) => {
      const date = new Date(profile.dateCreated).toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setStatistics({ completedFlowByMonth, usersByStage, propertyRegimeCount, userGrowth });
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/userprofiles");
        const result = await response.json();
        
        if (result && result.success) {
          setProfileData(result.data);
          calculateStatistics(result.data, selectedYear);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [calculateStatistics, selectedYear]);

  // Recalculate statistics when year filter changes
  useEffect(() => {
    if (profileData.length > 0) {
      calculateStatistics(profileData, selectedYear);
    }
  }, [selectedYear, profileData, calculateStatistics]);

  // Get available years from profile data
  const availableYears = profileData.length > 0 
    ? Array.from(new Set(profileData.map(p => new Date(p.dateCreated).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))
    : [];

  // Sort months properly for completed flow
  const sortedMonths = Object.keys(statistics.completedFlowByMonth).sort((a, b) => {
    // Parse "Jan 2024" format
    const parseDate = (str: string) => {
      const [month, year] = str.split(' ');
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return new Date(parseInt(year), monthMap[month] || 0);
    };
    return parseDate(a).getTime() - parseDate(b).getTime();
  });

  const completedFlowData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Users Completed Flow",
        data: sortedMonths.map(month => statistics.completedFlowByMonth[month]),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const stagesData = {
    labels: statistics.usersByStage.map((stage) => stage.stage),
    datasets: [
      {
        label: "Users by Stage",
        data: statistics.usersByStage.map((stage) => stage.count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const propertyRegimeData = {
    labels: Object.keys(statistics.propertyRegimeCount),
    datasets: [
      {
        label: "Property Regime Distribution",
        data: Object.values(statistics.propertyRegimeCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const userGrowthData = {
    labels: Object.keys(statistics.userGrowth),
    datasets: [
      {
        label: "User Growth Over Time",
        data: Object.values(statistics.userGrowth),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <main className="bg-white text-gray-900 overflow-hidden">
      <Layout>
        <div className="p-2 min-h-screen container mx-auto pl-16">
          <h1 className="text-3xl mb-4 text-gray-900" 
          style={{
            fontFamily:
              'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
            fontSize: "27px",
          }}
          >Dashboard</h1>
          
          {/* Year Filter */}
          <div className="mb-4 flex items-center gap-2">
            <label 
              htmlFor="yearFilter" 
              className="text-sm font-medium text-gray-700"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
              }}
            >
              Filter by Year:
            </label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
                minWidth: '150px',
                fontSize: '14px',
                zIndex: 10,
              }}
            >
              <option value="all" style={{ backgroundColor: '#ffffff', color: '#000000' }}>All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year} style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Completed Flow Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
                fontSize: "20px",
              }}
              >User Journey Completed (Per Month)</h2>
              <Bar data={completedFlowData} options={{ responsive: true }} />
            </div>

            {/* Users by Stage Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
                fontSize: "20px",
              }}
              >Users in Progress {selectedYear !== "all" && `(${selectedYear})`}</h2>
              <Bar data={stagesData} options={{ responsive: true }} />
            </div>

            {/* User Growth Over Time Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
                fontSize: "20px",
              }}
              >User Growth Over Time {selectedYear !== "all" && `(${selectedYear})`}</h2>
              <Line data={userGrowthData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
