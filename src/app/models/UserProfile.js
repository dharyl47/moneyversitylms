import mongoose from 'mongoose';

// Define schema
const userProfileSchema = new mongoose.Schema({
  name: { type: String },
  dateCreated: { type: Date, default: Date.now },
  propertyRegime: { type: String, default: 'N/A' },
  deletionRequest: { type: String, default: 'N/A' },
  dependentsOver: { type: String, default: 'N/A' },
  ownBusiness: { type: String, default: 'N/A' },
  ownFarm: { type: String, default: 'N/A' },
  ownInvestmentPortfolio: { type: String, default: 'N/A' },
  ownRetirementFund: { type: String, default: 'N/A' },
  dependentsUnder: { type: String, default: 'N/A' },
  will: { type: String, default: 'N/A' },
  willStatus: { type: String, default: 'N/A' },
  emailAddress: { type: String, default: 'N/A' },
  dateOfBirth: { type: String, default: 'N/A' },
  dependants: {
    spouse: { type: Boolean, default: false },
    children: { type: Boolean, default: false },
    stepChildren: { type: Boolean, default: false },
    grandChildren: { type: Boolean, default: false },
    factualDependents: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
  },
  asset: {
    primaryResidents: { type: Boolean, default: false },
    otherRealEstate: { type: Boolean, default: false },
    bankAccounts: { type: Boolean, default: false },
    investmentAccounts: { type: Boolean, default: false },
    businessInterests: { type: Boolean, default: false },
    personalProperty: { type: Boolean, default: false },
    otherAsset: { type: Boolean, default: false },
  },
  maritalStatus: { type: String, default: 'Single' },
  investmentRisk: {
    lowRisk: { type: Boolean, default: false },
    mediumRisk: { type: Boolean, default: false },
    highRisk: { type: Boolean, default: false },
  },
  mvID: { type: String },
  templatesDownloaded: {
    will: { type: Boolean, default: false },
    trust: { type: Boolean, default: false },
    powerOfAttorney: { type: Boolean, default: false },
    livingWill: { type: Boolean, default: false },
  },
   ObjectivesOfEstatePlanning: {
    estatePlanFlexibility: { type: String, default: 'N/A' },
    businessProtectionImportance: { type: String, default: 'N/A' },
    financialSafeguardStrategies: { type: String, default: 'N/A' },
    insolvencyProtectionConcern: { type: String, default: 'N/A' },
    taxMinimizationPriority: { type: String, default: 'N/A' },
    estatePlanReviewConfidence: { type: String, default: 'N/A' },
  },
  Assets: {
    realEstateProperties: {
      uploadDocumentAtEndOfChat: { type: Boolean, default: false },  // Boolean to indicate document upload
      propertiesDetails: { type: String, default: '' },  // General property details
      inDepthDetails: {  // Nested object inside realEstateProperties
        propertyType: { type: String, default: 'N/A' },
        propertyLocation: { type: String, default: 'N/A' },
        propertySize: { type: String, default: 'N/A' },
        bedroomsAndBathroomCount: { type: String, default: 'N/A' },
        propertyCondition: { type: String, default: 'N/A' },
      },
    },
    farmProperties: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      vehicleProperties: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      valuablePossessions: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      householdEffects: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      investmentPortfolio: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      bankBalances: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      businessAssets: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      otherAssets: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      intellectualPropertyRights: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      assetsInTrust: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
    // You can add more asset-related fields here if needed in the future
  },
  Liabilities: { 
    outstandingMortgageLoans: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      personalLoans: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      creditCardDebt: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      vehicleLoans: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      otherOutstandingDebts: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      strategyLiabilities: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      foreseeableFuture: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
  },
    Policies: { 
      lifeInsurancePolicies: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        healthInsurancePolicies: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        propertyInsurance: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        vehicleInsurance: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        disabilityInsurance: {
          answer: { type: Boolean, default: false },
        },
        disabilityInsuranceType: {
          answer: { type: String, default: '' },
        },
        disabilityInsuranceAwareness: {
          answer: { type: Boolean, default: false },
        },
        disabilityInsuranceAssist: {
          answer: { type: Boolean, default: false },
        },
        contingentLiabilityInsurance: {
          answer: { type: Boolean, default: false },
        },
        buySellInsurance: {
          answer: { type: Boolean, default: false },
        },
        keyPersonInsurance: {
          answer: { type: Boolean, default: false },
        },
        keyPersonInsuranceAssist: {
          answer: { type: String, default: '' },
        },
        otherInsurance: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        reviewInsurancePolicy: {
          details: { type: String, default: '' },
        },
        considerFuneralCover: {
          answer: { type: String, default: '' },
        },
        nominatedFuneralCover: {
          answer: { type: String, default: '' },
        },
        funeralCoverInfo: {
          answer: { type: String, default: '' },
        },
    },
 EstateDuty: { 
      estateBequeathToSpouse: {
          answer: { type: String, default: '' },
        },
        bequeathToSpouseCondition: {
          answer: { type: String, default: '' },
        },
        bequeathToSpousePercentage: {
          answer: { type: String, default: '' },
        },
        estateDistributed: {
          answer: { type: String, default: '' },
        },
        bequeathToSpousePortionPercentage: {
          answer: { type: String, default: '' },
        },
        estateBequeathResidue: {
          answer: { type: String, default: '' },
        },
        estateBequeathToTrust: {
          answer: { type: String, default: '' },
        },
        willPlanForTrust: {
          answer: { type: Boolean, default: false },
        },
         estateBequeathProperty: {
          answer: { type: String, default: '' },
        },
        estateBequeathTrustDetails: {
          answer: { type: String, default: '' },
        },
        estateBequeathWhom: {
          answer: { type: String, default: '' },
        },
        estateBequeathDifference: {
          answer: { type: String, default: '' },
        },
         estateBequeathThirdParty: {
          answer: { type: String, default: '' },
        },
        estateBequeathTrustStructureAssist: {
         answer: { type: String, default: '' },
        },
        
        
  },
ExecutorFees: { 
      noExecutorFeesPolicy: {
          answer: { type: String, default: '' },
        },

  },

  LiquidityPosition: { 
      liquiditySources: {
          answer: { type: String, default: '' },
        },
        shortfallHeirContribution: {
          answer: { type: String, default: '' },
        },
        shortfallHeirAssist: {
          answer: { type: String, default: '' },
        },
        shortfallHeirContributionAssist: {
          answer: { type: String, default: '' },
        },
        shortfallCreditorsAssist: {
          answer: { type: String, default: '' },
        },
        alternativeFinancingForShortfall: {
          answer: { type: String, default: '' },
        },
        alternativeFinancingAssist: {
          answer: { type: String, default: '' },
        },
        borrowingFundsForShortfall: {
          answer: { type: String, default: '' },
        },
        borrowingFundsForShortfallAssist: {
          answer: { type: String, default: '' },
        },
        alternativeFinancingOptionsAssist: {
          answer: { type: String, default: '' },
        },
        lifeAssuranceCashShortfall: {
          answer: { type: String, default: '' },
        },
      },
MaintenanceClaims: { 
      maintenanceClaimsAwareness: {
          answer: { type: String, default: '' },
        },
        maintenanceClaimsCourtOrder: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        maintenanceClaimsInfo: {
          answer: { type: String, default: '' },
        },
        potentialClaimsInfo: {
          answer: { type: String, default: '' },
        },
        maintenanceCostOfEducation: {
          answer: { type: String, default: '' },
        },
        maintenanceInsurancePolicy: {
          answer: { type: String, default: '' },
        },
        maintenanceObligationAssist: {
          answer: { type: String, default: '' },
        },
        maintenanceConsiderationInfo: {
          answer: { type: String, default: '' },
        },
    },
MaintenanceSurvivingSpouse: { 
      provisionsForSurvivingSpouse: {
          answer: { type: String, default: '' },
        },
        reviewExistingProvisionsInfo: {
          answer: { type: String, default: '' },
        },
        makingProvisionsInfo: {
          answer: { type: String, default: '' },
        },
        implicationProvisionInfo: {
          answer: { type: String, default: '' },
        },
        incomeMaintenanceTax: {
          answer: { type: String, default: '' },
        },
        provisionConsidered: {
          answer: { type: String, default: '' },
        },
        provisionAssistanceInfo: {
          answer: { type: String, default: '' },
        },
        provisionImpactAssistanceInfo: {
          answer: { type: String, default: '' },
        },
        provisionInfluenceAssistanceInfo: {
          answer: { type: String, default: '' },
        },
        provisionsPreferences: {
          answer: { type: String, default: '' },
        },

  },
      ProvisionsDependents: { 
      dependentsIncomeNeeds: {
          answer: { type: String, default: '' },
        },
        shortfallHouseholdIncome: {
          answer: { type: String, default: '' },
        },
        potentialIncomeShortfallInfo: {
          answer: { type: String, default: '' },
        },
        evaluatingFinancialSituationInfo: {
          answer: { type: String, default: '' },
        },
        provideGuidanceFinancialInfo: {
          answer: { type: String, default: '' },
        },
        lifeInsuranceLinkedPurpose: {
          answer: { type: String, default: '' },
        },
        additionalLifeInsuranceDependents: {
          answer: { type: String, default: '' },
        },
        guidanceAssesingLifeInsuranceInfo: {
          answer: { type: String, default: '' },
        },
        guidanceExploringBenefitsInfo: {
          answer: { type: String, default: '' },
        },
        reviewFinancialBenefitsInfo: {
          answer: { type: String, default: '' },
        },

}, 

Trusts: { 
      familiarWithTrust: {
          answer: { type: String, default: '' },
        },
        exploreTrustInfo: {
          answer: { type: String, default: '' },
        },
         consideredSettingUpTrust: {
          answer: { type: String, default: '' },
        },
         trustConcern: {
          answer: { type: String, default: '' },
        },
        reasonTrustRelevant: {
          answer: { type: String, default: '' },
        },
        trustAdvantages: {
          answer: { type: String, default: '' },
        },
        consideringDonatingTrust: {
          answer: { type: String, default: '' },
        },
        awarePotentialDonations: {
          answer: { type: String, default: '' },
        },
        consideredSellingAssetTrust: {
          answer: { type: String, default: '' },
        },
        familiarTermsAndConditionTrust: {
          answer: { type: String, default: '' },
        },
        costAndTaxTrust: {
          answer: { type: String, default: '' },
        },

},
InvestmentTrusts: { 
      settingUpInvestmentTrust: {
          answer: { type: String, default: '' },
        },
        investmentTrustFlexibility: {
          answer: { type: String, default: '' },
        },

},
  mvID: { type: String },
});

// Use the collection name in lowercase to match MongoDB collection
const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
