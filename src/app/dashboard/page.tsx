"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState, useCallback } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend } from 'chart.js';
import CompletedFlowChart from "./_components/CompletedFlowChart";
import UsersByStageChart from "./_components/UsersByStageChart";
import UserGrowthChart from "./_components/UserGrowthChart";
import DownloadsChart from "./_components/DownloadsChart";
import { Profile, Statistics } from "./_components/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend);

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
    userGrowth: {},
    reportDownloadsByMonth: {},
    templateDownloadsByMonth: {},
    totalReportDownloads: 0,
    totalTemplateDownloads: 0,
    templateBreakdown: []
  });
  const [downloadLogs, setDownloadLogs] = useState<any[]>([]);

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
    // A user has completed the journey if they reached "Final Review and Next Steps"
    // which is equivalent to having ALL Additional Considerations fields filled
    const completedFlowByMonth: { [key: string]: number } = {};
    const fieldNames = [
      'contactLegalAdviser',
      'legacyHeirlooms',
      'beneficiaryDesignations',
      'executorRemuneration',
      'informedNominated',
      'prepaidFuneral',
      'petCarePlanning',
      'setAReminder',
    ];
    
    console.log('=== USER JOURNEY COMPLETED ANALYSIS ===');
    console.log(`Total profiles to analyze: ${filteredProfiles.length}`);
    console.log(`Year filter: ${year || 'all'}`);
    
    let completedCount = 0;
    let incompleteCount = 0;
    
    filteredProfiles.forEach((profile, index) => {
      // Check if user has ANY meaningful data in Additional Considerations (Final Review and Next Steps)
      const additionalConsiderationFields = [
        profile.additionalConsideration?.contactLegalAdviser,
        profile.additionalConsideration?.legacyHeirlooms,
        profile.additionalConsideration?.beneficiaryDesignations,
        profile.additionalConsideration?.executorRemuneration,
        profile.additionalConsideration?.informedNominated,
        profile.additionalConsideration?.prepaidFuneral,
        profile.additionalConsideration?.petCarePlanning,
        profile.additionalConsideration?.setAReminder,
      ];
      
      // Check if ANY field has meaningful data (simplified - any data = completed)
      const hasAnyAdditionalConsiderations = additionalConsiderationFields.some(field => hasMeaningfulData(field));
      const filledFieldsCount = additionalConsiderationFields.filter(field => hasMeaningfulData(field)).length;
      
      const date = new Date(profile.dateCreated);
      const monthKey = date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
      
      if (hasAnyAdditionalConsiderations) {
        completedCount++;
        completedFlowByMonth[monthKey] = (completedFlowByMonth[monthKey] || 0) + 1;
        
        console.log(`\n✅ COMPLETED User ${index + 1}:`);
        console.log(`   Name: ${profile.name || 'N/A'}`);
        console.log(`   Date: ${monthKey}`);
        console.log(`   Fields filled: ${filledFieldsCount}/8`);
      } else {
        incompleteCount++;
        console.log(`\n❌ INCOMPLETE User ${index + 1}:`);
        console.log(`   Name: ${profile.name || 'N/A'}`);
        console.log(`   Date: ${monthKey}`);
        console.log(`   Fields filled: ${filledFieldsCount}/8`);
      }
    });
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`✅ Completed users: ${completedCount}`);
    console.log(`❌ Incomplete users: ${incompleteCount}`);
    console.log(`Completed by month:`, completedFlowByMonth);
    
    // Export all users as JSON for inspection
    const completedUsers = filteredProfiles.filter((profile) => {
      const additionalConsiderationFields = [
        profile.additionalConsideration?.contactLegalAdviser,
        profile.additionalConsideration?.legacyHeirlooms,
        profile.additionalConsideration?.beneficiaryDesignations,
        profile.additionalConsideration?.executorRemuneration,
        profile.additionalConsideration?.informedNominated,
        profile.additionalConsideration?.prepaidFuneral,
        profile.additionalConsideration?.petCarePlanning,
        profile.additionalConsideration?.setAReminder,
      ];
      return additionalConsiderationFields.every(field => hasMeaningfulData(field));
    });
    
    const incompleteUsers = filteredProfiles.filter((profile) => {
      const additionalConsiderationFields = [
        profile.additionalConsideration?.contactLegalAdviser,
        profile.additionalConsideration?.legacyHeirlooms,
        profile.additionalConsideration?.beneficiaryDesignations,
        profile.additionalConsideration?.executorRemuneration,
        profile.additionalConsideration?.informedNominated,
        profile.additionalConsideration?.prepaidFuneral,
        profile.additionalConsideration?.petCarePlanning,
        profile.additionalConsideration?.setAReminder,
      ];
      return !additionalConsiderationFields.every(field => hasMeaningfulData(field));
    });
    
    console.log(`\n=== JSON DATA FOR INSPECTION ===`);
    
    // Create a detailed breakdown with Additional Considerations data
    const detailedCompletedUsers = completedUsers.map(profile => ({
      name: profile.name,
      emailAddress: profile.emailAddress,
      dateCreated: profile.dateCreated,
      additionalConsideration: profile.additionalConsideration,
      // Include other relevant fields
      ownBusiness: profile.ownBusiness,
      propertyRegime: profile.propertyRegime,
      maritalStatus: profile.maritalStatus,
    }));
    
    const detailedIncompleteUsers = incompleteUsers.map(profile => ({
      name: profile.name,
      emailAddress: profile.emailAddress,
      dateCreated: profile.dateCreated,
      additionalConsideration: profile.additionalConsideration,
      // Include other relevant fields
      ownBusiness: profile.ownBusiness,
      propertyRegime: profile.propertyRegime,
      maritalStatus: profile.maritalStatus,
    }));
    
    console.log(`\n📋 COMPLETED USERS - Additional Considerations Data (${completedUsers.length}):`);
    console.log(JSON.stringify(detailedCompletedUsers, null, 2));
    
    console.log(`\n📋 INCOMPLETE USERS - Additional Considerations Data (${incompleteUsers.length}):`);
    console.log(JSON.stringify(detailedIncompleteUsers, null, 2));
    
    console.log(`\n📋 ALL COMPLETED USERS - Full Data (${completedUsers.length}):`);
    console.log(JSON.stringify(completedUsers, null, 2));
    
    console.log(`\n📋 ALL INCOMPLETE USERS - Full Data (${incompleteUsers.length}):`);
    console.log(JSON.stringify(incompleteUsers, null, 2));
    
    console.log(`\n📋 ALL PROFILES - Full Data (${filteredProfiles.length}):`);
    console.log(JSON.stringify(filteredProfiles, null, 2));

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
    // Note: This stage doesn't collect any data (informational only)
    // Users reach here after completing Additional Considerations
    // We can't track this stage since no data is saved
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

      // Helper function to check if user has ANY meaningful data in Additional Considerations
      const hasAnyAdditionalConsiderations = (profile: Profile): boolean => {
        const additionalConsiderationFields = [
          "additionalConsideration.contactLegalAdviser",
          "additionalConsideration.legacyHeirlooms",
          "additionalConsideration.beneficiaryDesignations",
          "additionalConsideration.executorRemuneration",
          "additionalConsideration.informedNominated",
          "additionalConsideration.prepaidFuneral",
          "additionalConsideration.petCarePlanning",
          "additionalConsideration.setAReminder",
        ];
        
        return additionalConsiderationFields.some((key: string) => {
          const keys = key.split(".");
          let value: any = profile;
          for (const subKey of keys) {
            value = value?.[subKey as keyof typeof value];
            if (!value) break;
          }
          return hasMeaningfulData(value);
        });
      };

      // Handle Additional Considerations - count users who have ANY Additional Considerations data
      // (but they will also appear in Final Review if they have any data)
      if (stage === "Additional Considerations") {
        return {
          stage,
          count: filteredProfiles.filter((profile) => {
            // Check if user has ANY Additional Considerations data
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

      // Handle Final Review and Next Steps - count users who have ANY Additional Considerations data
      if (stage === "Final Review and Next Steps") {
        const finalReviewCount = filteredProfiles.filter((profile) => {
          return hasAnyAdditionalConsiderations(profile);
        }).length;
        
        console.log(`\n📊 Final Review and Next Steps count: ${finalReviewCount}`);
        
        return {
          stage,
          count: finalReviewCount,
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

    console.log(`\n=== USERS IN PROGRESS BY STAGE ===`);
    usersByStage.forEach((stageData, index) => {
      console.log(`${index + 1}. ${stageData.stage}: ${stageData.count} users`);
    });
    
    console.log(`\n=== COMPARISON ===`);
    const totalCompleted = Object.values(completedFlowByMonth).reduce((sum, count) => sum + count, 0);
    const finalReviewCount = usersByStage.find(s => s.stage === "Final Review and Next Steps")?.count || 0;
    console.log(`Total Completed (sum of all months): ${totalCompleted}`);
    console.log(`Final Review and Next Steps count: ${finalReviewCount}`);
    console.log(`Match: ${totalCompleted === finalReviewCount ? '✅ YES' : '❌ NO - MISMATCH!'}`);
    
    // Export to global scope for easy access in console
    (window as any).dashboardData = {
      completedUsers,
      incompleteUsers,
      allProfiles: filteredProfiles,
      completedUsersDetailed: detailedCompletedUsers,
      incompleteUsersDetailed: detailedIncompleteUsers,
      statistics: {
        completedFlowByMonth,
        usersByStage,
        propertyRegimeCount,
        userGrowth
      }
    };
    
    console.log(`\n💡 TIP: You can access this data in the console using:`);
    console.log(`   window.dashboardData.completedUsers`);
    console.log(`   window.dashboardData.incompleteUsers`);
    console.log(`   window.dashboardData.allProfiles`);
    console.log(`   window.dashboardData.statistics`);
    
    console.log(`\n=== END OF ANALYSIS ===\n`);

    setStatistics(prev => ({ 
      ...prev,
      completedFlowByMonth, 
      usersByStage, 
      propertyRegimeCount, 
      userGrowth, 
    }));
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

  // Fetch download logs (all types)
  useEffect(() => {
    const fetchDownloadLogs = async () => {
      try {
        const url = `/api/downloadlogs${selectedYear !== 'all' ? `?year=${selectedYear}` : ''}`;
        console.log('📊 Fetching download logs from:', url);
        const response = await fetch(url);
        const result = await response.json();
        
        console.log('📊 Download logs response:', {
          success: result.success,
          count: result.count,
          totalCount: result.totalCount,
          stats: result.stats,
          dataLength: result.data?.length
        });
        
        if (result && result.success) {
          setDownloadLogs(result.data || []);
          
          // Calculate downloads per month by type
          const reportDownloadsByMonth: { [key: string]: number } = {};
          const templateDownloadsByMonth: { [key: string]: number } = {};
          let totalReportDownloads = 0;
          let totalTemplateDownloads = 0;
          const templateCounts: { [key: string]: { fileName: string; fileLabel: string; count: number } } = {};
          
          if (result.data && result.data.length > 0) {
            result.data.forEach((log: any) => {
              const date = new Date(log.downloadDate);
              const monthKey = date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
              
              if (log.downloadType === 'user_report') {
                reportDownloadsByMonth[monthKey] = (reportDownloadsByMonth[monthKey] || 0) + 1;
                totalReportDownloads++;
              } else if (log.downloadType === 'resource_template') {
                templateDownloadsByMonth[monthKey] = (templateDownloadsByMonth[monthKey] || 0) + 1;
                totalTemplateDownloads++;
                
                // Track individual template downloads
                const templateKey = log.fileName || 'Unknown';
                if (!templateCounts[templateKey]) {
                  templateCounts[templateKey] = {
                    fileName: log.fileName || 'Unknown',
                    fileLabel: log.fileLabel || log.fileName || 'Unknown',
                    count: 0
                  };
                }
                templateCounts[templateKey].count++;
              }
            });
            
            // Convert template counts object to array and sort by count
            const templateBreakdown = Object.values(templateCounts).sort((a, b) => b.count - a.count);
            
            console.log('📊 Report downloads by month:', reportDownloadsByMonth);
            console.log('📊 Template downloads by month:', templateDownloadsByMonth);
            console.log('📊 Total report downloads:', totalReportDownloads);
            console.log('📊 Total template downloads:', totalTemplateDownloads);
            console.log('📊 Template breakdown:', templateBreakdown);
          } else {
            console.log('⚠️ No download logs found');
          }
          
          setStatistics(prev => ({
            ...prev,
            reportDownloadsByMonth,
            templateDownloadsByMonth,
            totalReportDownloads,
            totalTemplateDownloads,
            templateBreakdown: Object.values(templateCounts).sort((a, b) => b.count - a.count)
          }));
        } else {
          console.error('❌ Failed to fetch download logs:', result);
        }
      } catch (error) {
        console.error("❌ Error fetching download logs:", error);
      }
    };

    fetchDownloadLogs();
  }, [selectedYear]);

  // Recalculate statistics when year filter changes
  useEffect(() => {
    if (profileData.length > 0) {
      calculateStatistics(profileData, selectedYear);
    }
  }, [selectedYear, profileData, calculateStatistics]);

  // Get available years from profile data
  const availableYears = profileData.length > 0 
    ? Array.from(new Set(
        profileData
          .map((p) => new Date(p.dateCreated).getFullYear())
          .filter((year) => year >= 2025)
          .map((year) => year.toString())
      )).sort((a, b) => b.localeCompare(a))
    : [];

  return (
    <main className="bg-[#F9F9F9] min-h-screen">
      <Layout>
        <div className="min-h-screen w-full">
          <div className="bg-[#F9F9F9] rounded-lg p-6">
            <h1 className="text-2xl mb-4 text-[#282828]" 
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: "26px",
              fontWeight: 600,
              color: '#282828',
            }}
            >Dashboard</h1>
          
          {/* Year Filter */}
          <div className="mb-4 flex items-center gap-2">
            <label 
              htmlFor="yearFilter" 
              className="text-sm font-medium text-gray-700"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
              }}
            >
              Filter by Year:
            </label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 bg-white text-black"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                minWidth: '150px',
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <CompletedFlowChart 
              completedFlowByMonth={statistics.completedFlowByMonth}
              selectedYear={selectedYear}
            />

            <UsersByStageChart 
              usersByStage={statistics.usersByStage}
              selectedYear={selectedYear}
            />

            <div className="self-start">
              <UserGrowthChart 
                userGrowth={statistics.userGrowth}
                selectedYear={selectedYear}
              />
            </div>

            <DownloadsChart
              reportDownloadsByMonth={statistics.reportDownloadsByMonth}
              templateDownloadsByMonth={statistics.templateDownloadsByMonth}
              totalReportDownloads={statistics.totalReportDownloads}
              totalTemplateDownloads={statistics.totalTemplateDownloads}
              templateBreakdown={statistics.templateBreakdown}
              selectedYear={selectedYear}
            />
          </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
