"use client";
import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { sortMonths } from "./utils";

interface DownloadsChartProps {
  reportDownloadsByMonth: { [key: string]: number };
  templateDownloadsByMonth: { [key: string]: number };
  totalReportDownloads: number;
  totalTemplateDownloads: number;
  templateBreakdown: { fileName: string; fileLabel: string; count: number }[];
  selectedYear: string;
}

export default function DownloadsChart({
  reportDownloadsByMonth,
  templateDownloadsByMonth,
  totalReportDownloads,
  totalTemplateDownloads,
  templateBreakdown,
  selectedYear,
}: DownloadsChartProps) {
  // Get all unique months from both download types
  const allDownloadMonths = new Set([
    ...Object.keys(reportDownloadsByMonth),
    ...Object.keys(templateDownloadsByMonth)
  ]);

  // Sort months for downloads
  const sortedDownloadMonths = sortMonths(Array.from(allDownloadMonths));

  const chartData = {
    labels: sortedDownloadMonths,
    datasets: [
      {
        label: `User Reports (Total: ${totalReportDownloads})`,
        data: sortedDownloadMonths.map(month => reportDownloadsByMonth[month] || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: `Resource Templates (Total: ${totalTemplateDownloads})`,
        data: sortedDownloadMonths.map(month => templateDownloadsByMonth[month] || 0),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <ChartCard 
      title="Downloads (Per Month)" 
      selectedYear={selectedYear}
    >
      {/* Legend */}
      <div 
        className="mb-4 flex gap-4 text-sm"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: 'rgba(153, 102, 255, 0.6)' }}
          ></div>
          <span className="text-gray-700">
            <strong>User Reports:</strong> {totalReportDownloads}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: 'rgba(255, 159, 64, 0.6)' }}
          ></div>
          <span className="text-gray-700">
            <strong>Resource Templates:</strong> {totalTemplateDownloads}
          </span>
        </div>
      </div>

      {/* Chart */}
      <Bar data={chartData} options={{ responsive: true }} />
      
      {/* Template Breakdown Table */}
      {templateBreakdown && templateBreakdown.length > 0 && (
        <div className="mt-6">
          <h3 
            className="text-lg font-semibold mb-3 text-gray-900"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: '20px',
            }}
          >
            Template Download Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '20px',
                      color: '#1F2937',
                    }}
                  >
                    Template Name
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '20px',
                      color: '#1F2937',
                    }}
                  >
                    File Name
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '20px',
                      color: '#1F2937',
                    }}
                  >
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody>
                {templateBreakdown.map((template, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td 
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#1F2937',
                      }}
                    >
                      {template.fileLabel}
                    </td>
                    <td 
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#1F2937',
                      }}
                    >
                      {template.fileName}
                    </td>
                    <td 
                      className="border border-gray-300 px-4 py-2 text-sm text-center font-semibold text-gray-900"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#1F2937',
                      }}
                    >
                      {template.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ChartCard>
  );
}

