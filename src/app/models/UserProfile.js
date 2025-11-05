import mongoose from 'mongoose';

// Define schema
const userProfileSchema = new mongoose.Schema({
  name: { type: String },
  firstName: { type: String },
  sureName: { type: String },
  age: { type: String },
  auth: { type: String },
  guardianNamed: { type: String },
  childrenOrDependents: {
  hasDependents: { type: String, enum: ['Yes', 'No'], default: 'No' },
  details: { type: String, default: 'N/A' },
  },

  estatePlanGoals: {
    type: String,
    default: 'N/A'
  },




estateProfileV2: {
  ownsProperty: { type: String, default: 'N/A' },
  propertyDetails: { type: String, default: 'N/A' },

  ownsVehicle: { type: String, default: 'N/A' },
  vehicleDetails: { type: String, default: 'N/A' },

  ownsBusiness: { type: String, default: 'N/A' },
  businessDetails: { type: String, default: 'N/A' },

  ownsValuables: { type: String, default: 'N/A' },
  valuableDetails: { type: String, default: 'N/A' },

  hasDebts: { type: String, default: 'N/A' },
  debtDetails: { type: String, default: 'N/A' },
},

estateGoalsV2: {
  assetDistribution: { type: String, default: 'N/A' },
  careForDependents: { type: String, default: 'N/A' },
  minimizeTaxes: { type: String, default: 'N/A' },
  businessSuccession: { type: String, default: 'N/A' },
  incapacityPlanning: { type: String, default: 'N/A' },
  emergencyFund: { type: String, default: 'N/A' },
  financialPlan: { type: String, default: 'N/A' },
},


estateToolsV2: {
  trusts: [{ type: String }],
  will: { type: String, default: 'N/A' },
  willReview: { type: String, default: 'N/A' },
  trustSetup: { type: String, default: 'N/A' },
  donations: { type: String, default: 'N/A' },
  donationsProceedReview: { type: String, default: 'N/A' },
  donationsDetails: [
    {
      description: { type: String },
      value: { type: String },
      recipient: { type: String },
      notes: { type: String }
    }
  ],
  lifeInsurance: { type: String, default: 'N/A' },
  lifeInsuranceDetails: { type: String, default: 'N/A' },
  estateExpensePlan: { type: String, default: 'N/A' },
  marriagePropertyStatus: { type: String, default: 'N/A' },
  digitalAssets: { type: String, default: 'N/A' },
  digitalAssetsDetails: { type: String, default: 'N/A' },
},

estateTaxV2: {
estateDuty: { type: String, default: 'N/A' },
gainsTax: { type: String, default: 'N/A' },
incomeTax: { type: String, default: 'N/A' },
protectionClaims: { type: String, default: 'N/A' },
},

businessV2: {
businessPlan: { type: String, default: 'N/A' },
},

livingWillV2: {
createLivingWill: { type: String, default: 'N/A' },
healthCareDecisions: { type: String, default: 'N/A' },
},

reviewForeignAssetsV2: {
ownProperty: { type: String, default: 'N/A' },
},

additionalConsideration: {
  contactLegalAdviser: { type: String, default: 'N/A' },
  legacyHeirlooms: { type: String, default: 'N/A' },
  legacyHeirloomsDetails: [
    {
      item: { type: String },
      recipient: { type: String },
    }
  ],
  beneficiaryDesignations: { type: String, default: 'N/A' },
  executorRemuneration: { type: String, default: 'N/A' },
  informedNominated: { type: String, default: 'N/A' },
  prepaidFuneral: { type: String, default: 'N/A' },
  petCarePlanning: { type: String, default: 'N/A' },
  setAReminder: { type: String, default: 'N/A' },
},




  userChatInputs: [
    {
      input: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
   estatePlanningMessages: [
    {
      id: { type: String, required: true },
      content: { type: String, required: true },
      role: { type: String, enum: ["assistant", "user"], required: true },
    },
  ],
  messages: [
    {
      id: { type: String, required: true },
      content: { type: String, required: true },
      role: { type: String, enum: ["assistant", "user"], required: true },
    },
  ],
  flowNextResponse: { type: String, default: 'N/A' },
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
    parents: { type: Boolean, default: false },
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
    allTemplates: { type: Boolean, default: false },
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
      downloadAtEndOfChat: { type: Boolean, default: false },
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
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      vehicleProperties: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        downloadAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      valuablePossessions: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      householdEffects: {
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      investmentPortfolio: {
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      bankBalances: {
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        downloadAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      businessAssets: {
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      otherAssets: {
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      intellectualPropertyRights: {
        downloadAtEndOfChat: { type: Boolean, default: false },
        uploadDocumentAtEndOfChat: { type: Boolean, default: false },
        propertiesDetails: { type: String, default: '' },
      },
      assetsInTrust: {
        downloadAtEndOfChat: { type: Boolean, default: false },
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
          alreadyHave: { type: Boolean, default: false },
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
    InvestmentsPortfolio: {
      stocksEquities: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        bondsFixedIncome: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        mutualFunds: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        retirementFunds: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        investmentProperties: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        otherAssetClassess: {
           uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          details: { type: String, default: '' },
        },
        investmentGoalsRiskTolerance: {
          answer: { type: String, default: '' },
        },
        specificInvestmentChanges: {
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
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
          answer: { type: String, default: '' },
        },

  },

  LiquidityPosition: { 
      liquiditySources: {
          uploadDocumentAtEndOfChat: { type: Boolean, default: false },
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
