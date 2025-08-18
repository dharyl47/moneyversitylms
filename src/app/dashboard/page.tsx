"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend);

interface Profile {
  name: string;
  dateCreated: string;
  propertyRegime: string;
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
}

interface Statistics {
  completedFlowCount: number;
  usersByStage: { stage: string; count: number }[];
  propertyRegimeCount: { [key: string]: number };
  userGrowth: { [key: string]: number };
}

export default function Dashboard() {
  const [profileData, setProfileData] = useState<Profile[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    completedFlowCount: 0,
    usersByStage: [],
    propertyRegimeCount: {},
    userGrowth: {}
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/userprofiles");
        const result = await response.json();
        
        if (result && result.success) {
          setProfileData(result.data);
          calculateStatistics(result.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const hasMeaningfulData = (obj: any): boolean => {
    if (obj === null || obj === undefined) return false;
  
    // If it's a primitive value, directly check
    if (typeof obj !== "object") {
      return obj !== "" && obj !== false && obj !== "N/A";
    }
  
    // If it's an object, check its values recursively
    return Object.values(obj).some((value: any) => hasMeaningfulData(value));
  };
  

  const calculateStatistics = (profiles: Profile[]) => {
    const completedFlowCount = profiles.filter((profile) =>
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
      hasMeaningfulData(profile.InvestmentTrusts)
    ).length;

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
];
    
const mapSchemaToStage: Record<string, string[]> = {
  "Personal Information": [
    "name",
    "childrenOrDependents.hasDependents",    // Yes/No is still meaningful
    "childrenOrDependents.details",
    "guardianNamed",
    "estatePlanGoals",
  ],

  "Net Worth Assessment": [
    "estateProfileV2.ownsProperty",
    "estateProfileV2.propertyDetails",
    "estateProfileV2.ownsVehicle",
    "estateProfileV2.vehicleDetails",
    "estateProfileV2.ownsBusiness",
    "estateProfileV2.businessDetails",
    "estateProfileV2.ownsValuables",
    "estateProfileV2.valuableDetails",
    "estateProfileV2.hasDebts",
    "estateProfileV2.debtDetails",
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
    "estateToolsV2.trusts",                 // array counts when non-empty
    "estateToolsV2.will",
    "estateToolsV2.willReview",
    "estateToolsV2.trustSetup",
    "estateToolsV2.donations",
    "estateToolsV2.donationsProceedReview",
    "estateToolsV2.donationsDetails",       // array of objects
    "estateToolsV2.lifeInsurance",
    "estateToolsV2.lifeInsuranceDetails",
    "estateToolsV2.estateExpensePlan",
    "estateToolsV2.marriagePropertyStatus",
    "estateToolsV2.digitalAssets",
    "estateToolsV2.digitalAssetsDetails",
  ],

  "Tax Planning and Minimization": [
    "estateTaxV2.estateDuty",
    "estateTaxV2.gainsTax",
    "estateTaxV2.incomeTax",
    "estateTaxV2.protectionClaims",
  ],

  "Business Succession Planning": [
    "businessV2.businessPlan",
  ],

  "Living Will and Healthcare Directives": [
    "livingWillV2.createLivingWill",
    "livingWillV2.healthCareDecisions",
  ],

  "Review of Foreign Assets": [
    "reviewForeignAssetsV2.ownProperty",
  ],

  "Additional Considerations": [
    "additionalConsideration.contactLegalAdviser",
    "additionalConsideration.legacyHeirlooms",
    "additionalConsideration.legacyHeirloomsDetails", // array of {item, recipient}
    "additionalConsideration.beneficiaryDesignations",
    "additionalConsideration.executorRemuneration",
    "additionalConsideration.informedNominated",
    "additionalConsideration.prepaidFuneral",
    "additionalConsideration.petCarePlanning",
    "additionalConsideration.setAReminder",
  ],

};
    
    const usersByStage = stages.map((stage) => {
      const schemaKeys = mapSchemaToStage[stage];
      return {
        stage,
        count: profiles.filter((profile) => {
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

    const propertyRegimeCount = profiles.reduce((acc: { [key: string]: number }, profile) => {
      acc[profile.propertyRegime] = (acc[profile.propertyRegime] || 0) + 1;
      return acc;
    }, {});

    const userGrowth = profiles.reduce((acc: { [key: string]: number }, profile) => {
      const date = new Date(profile.dateCreated).toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setStatistics({ completedFlowCount, usersByStage, propertyRegimeCount, userGrowth });
  };

  const completedFlowData = {
    labels: ["Completed Flow"],
    datasets: [
      {
        label: "Users Completed Flow",
        data: [statistics.completedFlowCount],
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
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Completed Flow Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900"
              style={{
                fontFamily:
                  'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
                fontSize: "20px",
              }}
              >User Journey Completed</h2>
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
              >Users in Progress</h2>
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
              >User Growth Over Time</h2>
              <Line data={userGrowthData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
