"use client";
import { useEffect, useMemo, useState } from "react";
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
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const totalTemplates = templateBreakdown?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTemplates / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [templateBreakdown, selectedYear]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTemplates = useMemo(() => {
    if (!templateBreakdown || templateBreakdown.length === 0) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return templateBreakdown.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, templateBreakdown]);

  return (
    <ChartCard 
      title="Downloads (Per Month)" 
      selectedYear={selectedYear}
    >
      {/* Legend */}
      <div 
        className="mb-4 flex gap-4 text-sm"
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
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
      <Bar data={chartData} options={chartOptions} />
      
      {/* Template Breakdown Table */}
      {templateBreakdown && templateBreakdown.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h3 
              className="text-lg font-semibold text-gray-900"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: '20px',
              }}
            >
              Template Download Breakdown
            </h3>
            <div
              className="flex flex-col items-start gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:gap-3"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              }}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  }}
                >
                  Previous
                </button>
                <span className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalTemplates === 0}
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: '#1F2937',
                    }}
                  >
                    Template Name
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: '#1F2937',
                    }}
                  >
                    File Name
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: '#1F2937',
                    }}
                  >
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTemplates.map((template, index) => {
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                  return (
                    <tr 
                      key={`${template.fileName || template.fileLabel || "template"}-${globalIndex}`} 
                      className={globalIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td 
                        className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                        style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#1F2937',
                        }}
                      >
                        {template.fileLabel}
                      </td>
                      <td 
                        className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                        style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#1F2937',
                        }}
                      >
                        {template.fileName}
                      </td>
                      <td 
                        className="border border-gray-300 px-4 py-2 text-sm text-center font-semibold text-gray-900"
                        style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#1F2937',
                        }}
                      >
                        {template.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ChartCard>
  );
}

