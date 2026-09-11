import React from 'react';
import {
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import { PLACEHOLDER_CSV } from '../data/sampleData';

interface DataInputSectionProps {
  csvInput: string;
  setCsvInput: (val: string) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  errorMessage: string | null;
  zeroFailureNotice: boolean;
  smallSampleWarning: boolean;
  sampleCount: number;
}

export const DataInputSection: React.FC<DataInputSectionProps> = ({
  csvInput,
  setCsvInput,
  onAnalyze,
  onLoadSample,
  onClear,
  errorMessage,
  zeroFailureNotice,
  smallSampleWarning,
  sampleCount,
}) => {
  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#F8CB46]/20 text-[#0C831F] border border-[#F8CB46]/50">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              Data Input
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste or load dispatch records in standard comma-separated format
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FEF9C3] hover:bg-[#FEF08A] text-amber-900 border border-amber-300 transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sample Data (20 orders)</span>
          </button>
          {csvInput && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Text Area Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="csv-data-input"
            className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2"
          >
            <span>Paste Order Data (CSV format)</span>
            <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              7 required columns
            </span>
          </label>
          <span className="text-xs text-gray-400 font-mono">
            {csvInput ? `${csvInput.split('\n').filter(Boolean).length} lines` : 'Empty'}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="csv-data-input"
            rows={8}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder={PLACEHOLDER_CSV}
            className="w-full font-mono text-xs p-3.5 rounded-xl bg-gray-50/70 text-gray-800 border border-gray-200 focus:bg-white focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/15 placeholder:text-gray-400 outline-none leading-relaxed transition-all"
          />
        </div>

        {/* Expected Format Tip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-600 bg-emerald-50/60 px-3.5 py-2.5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#0C831F] flex-shrink-0" />
            <span>
              <strong className="font-semibold text-gray-900">Format: </strong>
              <code className="text-gray-700 font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                order_id,timestamp,zone,category,supplier,delivery_minutes,success
              </code>
            </span>
          </div>
          <span className="text-gray-500 text-[10px]">
            success: 1 = On-time, 0 = Delayed/Failed
          </span>
        </div>

        {/* Error Handling Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">CSV Error</p>
              <p className="mt-0.5 text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Zero Failure Edge Case Notice */}
        {zeroFailureNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Great news: 0% failure rate in this dataset! 100% of orders met the 10-minute quick commerce SLA.
            </span>
          </div>
        )}

        {/* Small Sample Warning Edge Case */}
        {smallSampleWarning && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Warning: Sample size is small ({sampleCount} orders). For high statistical confidence across zones and suppliers, load 20+ records.
            </span>
          </div>
        )}

        {/* Action Button Row with Blinkit Signature Green */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Blinkit Green Analyze Data Button */}
          <button
            type="button"
            onClick={onAnalyze}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0C831F] hover:bg-[#096918] text-white shadow-sm transition-all cursor-pointer transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Analyze Data</span>
          </button>

          {/* Sample Data Button */}
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#F8CB46]" />
            <span>Pre-fill Sample Data (20 records)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
