"use client";
import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";

interface UsersByStageChartProps {
  usersByStage: { stage: string; count: number }[];
  selectedYear: string;
}

export default function UsersByStageChart({ 
  usersByStage, 
  selectedYear 
}: UsersByStageChartProps) {
  const chartData = {
    labels: usersByStage.map((stage) => stage.stage),
    datasets: [
      {
        label: "Users by Stage",
        data: usersByStage.map((stage) => stage.count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <ChartCard 
      title="Users in Progress" 
      selectedYear={selectedYear}
    >
      <Bar data={chartData} options={{ responsive: true }} />
    </ChartCard>
  );
}

