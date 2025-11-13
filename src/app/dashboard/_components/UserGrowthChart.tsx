"use client";
import { Line } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { sortMonths } from "./utils";

interface UserGrowthChartProps {
  userGrowth: { [key: string]: number };
  selectedYear: string;
}

export default function UserGrowthChart({ 
  userGrowth, 
  selectedYear 
}: UserGrowthChartProps) {
  const sortedMonths = sortMonths(Object.keys(userGrowth));

  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Users who have started the journey",
        data: sortedMonths.map(month => userGrowth[month] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <ChartCard 
      title="User Growth Over Time" 
      selectedYear={selectedYear}
    >
      <Line data={chartData} options={{ responsive: true }} />
    </ChartCard>
  );
}

