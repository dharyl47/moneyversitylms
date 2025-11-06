export interface Profile {
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
  additionalConsideration?: {
    contactLegalAdviser?: string;
    legacyHeirlooms?: string;
    beneficiaryDesignations?: string;
    executorRemuneration?: string;
    informedNominated?: string;
    prepaidFuneral?: string;
    petCarePlanning?: string;
    setAReminder?: string;
  };
  [key: string]: any;
}

export interface Statistics {
  completedFlowByMonth: { [key: string]: number };
  usersByStage: { stage: string; count: number }[];
  propertyRegimeCount: { [key: string]: number };
  userGrowth: { [key: string]: number };
  reportDownloadsByMonth: { [key: string]: number };
  templateDownloadsByMonth: { [key: string]: number };
  totalReportDownloads: number;
  totalTemplateDownloads: number;
  templateBreakdown: { fileName: string; fileLabel: string; count: number }[];
}

