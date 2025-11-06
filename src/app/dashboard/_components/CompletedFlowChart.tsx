"use client";
import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { sortMonths } from "./utils";

interface CompletedFlowChartProps {
  completedFlowByMonth: { [key: string]: number };
  selectedYear: string;
}

export default function CompletedFlowChart({ 
  completedFlowByMonth, 
  selectedYear 
}: CompletedFlowChartProps) {
  const sortedMonths = sortMonths(Object.keys(completedFlowByMonth));

  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Users Completed Flow",
        data: sortedMonths.map(month => completedFlowByMonth[month] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <ChartCard 
      title="Completed Flow (Per Month)" 
      selectedYear={selectedYear}
    >
      <Bar data={chartData} options={{ responsive: true }} />
    </ChartCard>
  );
}

