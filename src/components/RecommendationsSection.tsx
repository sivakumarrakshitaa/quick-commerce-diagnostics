import React, { useState } from 'react';
import { Recommendation, AnalysisData } from '../types';
import { exportInsightsText, exportRecommendationsCSV } from '../utils/analyzer';
import {
  Lightbulb,
  Download,
  AlertOctagon,
  AlertTriangle,
  Info,
  TrendingUp,
  MapPin,
  Check,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

interface RecommendationsSectionProps {
  data: AnalysisData;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  data,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadText = () => {
    const content = exportInsightsText(data);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QuickCommerce_Delay_Insights_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Executive Text Summary downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadCSV = () => {
    const content = exportRecommendationsCSV(data);
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QuickCommerce_Recommendations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Recommendations CSV downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs text-gray-900">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#F8CB46]/20 text-[#0C831F] border border-[#F8CB46]/50">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Top 3 Operational Fixes (Ranked by Impact)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FEF9C3] text-amber-900 border border-amber-300">
                Action Plan
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Prioritized interventions targeting high-volume failure corridors
            </p>
          </div>
        </div>

        {/* Download Action Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadText}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0C831F] hover:bg-[#096918] text-white shadow-xs transition-all cursor-pointer active:scale-98"
            title="Download full operational insights report as a text document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Insights</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors shadow-xs active:scale-98"
            title="Download recommendations formatted as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#0C831F]" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 3 Numbered Recommendation Cards */}
      <div className="space-y-4">
        {data.recommendations.map((rec) => {
          // Priority Styling & Borders
          const isHigh = rec.priority === 'HIGH';
          const isMedium = rec.priority === 'MEDIUM';

          const borderLeftColor = isHigh
            ? 'border-l-[5px] border-l-rose-500'
            : isMedium
            ? 'border-l-[5px] border-l-[#F8CB46]'
            : 'border-l-[5px] border-l-[#0C831F]';

          const priorityBadge = isHigh ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              HIGH PRIORITY
            </span>
          ) : isMedium ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              MEDIUM PRIORITY
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-[#0C831F] border border-emerald-200 font-mono">
              <Info className="w-3.5 h-3.5 text-[#0C831F]" />
              LOW PRIORITY
            </span>
          );

          return (
            <div
              key={rec.id}
              className={`bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs ${borderLeftColor} transition-all duration-200 hover:border-gray-300`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-800">
                    {rec.rank}
                  </div>
                  <div>{priorityBadge}</div>
                </div>
                <span className="text-xs text-gray-500 font-mono font-medium">
                  Impact Rank #{rec.rank}
                </span>
              </div>

              {/* Card Body with Indentation and Scannable Typography */}
              <div className="pl-1 sm:pl-10 space-y-3">
                {/* 1. Problem Statement */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                    Problem Statement
                  </span>
                  <p className="text-base font-bold text-gray-900 tracking-tight">
                    {rec.problemStatement}
                  </p>
                </div>

                {/* 2. Root Cause */}
                <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                    Root Cause Diagnosis
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {rec.rootCause}
                  </p>
                </div>

                {/* 3. Recommendation */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#0C831F] font-bold block mb-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Recommended Operational Intervention
                  </span>
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    {rec.recommendation}
                  </p>
                </div>

                {/* 4. Expected Impact */}
                <div className="flex items-start gap-2 pt-1 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <TrendingUp className="w-4 h-4 text-[#0C831F] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#0C831F] font-medium">
                    <strong className="font-bold text-gray-900">Expected Impact: </strong>
                    {rec.expectedImpact}
                  </p>
                </div>

                {/* 5. Affected Zone-Categories */}
                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Target Corridors:
                  </span>
                  {rec.affectedZoneCategories.map((combo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {combo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
