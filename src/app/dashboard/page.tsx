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
    if (typeof obj !== "object" || obj === null) return false;
    return Object.values(obj).some((value: any) => {
      if (typeof value === "object" && value !== null) {
        return hasMeaningfulData(value);
      }
      return value !== null && value !== false && value !== "" && value !== "N/A";
    });
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
    "Step-by-step Guidance",
    "Objectives of Estate Planning",
    "Assets",
    "Liabilities",
    "Policies",
    "Investment Portfolios",
    "Estate Duty",
    "Current Will",
    "Maintenance Claims",
    "Maintenance of Surviving Spouse",
    "Provisions for Dependents",
    "Trusts",
    "The Investment Trust",
  ];

  const mapSchemaToStage: Record<string, string[]> = {
  "Personal Information": ["name", "dateOfBirth", "emailAddress"],
  "Step-by-step Guidance": ["ownBusiness", "ownFarm", "ownInvestmentPortfolio"],
  "Objectives of Estate Planning": ["ObjectivesOfEstatePlanning"],
  "Assets": ["Assets"],
  "Liabilities": ["Liabilities"],
  "Policies": ["Policies"],
  "Investment Portfolios": ["Assets.investmentPortfolio"],
  "Estate Duty": ["EstateDuty"],
  "Current Will": ["will", "willStatus"],
  "Maintenance Claims": ["MaintenanceClaims"],
  "Maintenance of Surviving Spouse": ["MaintenanceSurvivingSpouse"],
  "Provisions for Dependents": ["ProvisionsDependents"],
  "Trusts": ["Trusts"],
  "The Investment Trust": ["InvestmentTrusts"],
};


 const usersByStage = stages.map((stage) => {
  const schemaKeys = mapSchemaToStage[stage];

  return {
    stage,
    count: profiles.filter((profile) => {
      return schemaKeys.some((key: string) => {
        const keys = key.split(".");
        let value: any = profile;

        // Navigate nested objects
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
    <main className="bg-[#111827] text-white overflow-hidden">
      <Layout>
        <div className="p-6 min-h-screen container mx-auto pl-16">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {/* Completed Flow Chart */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Users Completed Flow</h2>
              <Bar data={completedFlowData} options={{ responsive: true }} />
            </div>

            {/* Users by Stage Chart */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Users by Stages Stopped</h2>
              <Bar data={stagesData} options={{ responsive: true }} />
            </div>

            {/* Property Regime Chart */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">User Property Regime</h2>
              <Pie data={propertyRegimeData} options={{ responsive: true }} />
            </div>

            {/* User Growth Over Time Chart */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">User Growth Over Time</h2>
              <Line data={userGrowthData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
