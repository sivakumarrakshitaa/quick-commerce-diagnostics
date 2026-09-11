import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DataInputSection } from './components/DataInputSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RecommendationsSection } from './components/RecommendationsSection';
import { SAMPLE_20_RECORDS_CSV } from './data/sampleData';
import { parseCSV, analyzeOrderData } from './utils/analyzer';
import { AnalysisData } from './types';

export default function App() {
  const [csvInput, setCsvInput] = useState<string>(SAMPLE_20_RECORDS_CSV);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [zeroFailureNotice, setZeroFailureNotice] = useState(false);
  const [smallSampleWarning, setSmallSampleWarning] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);

  // Perform data analysis
  const handleAnalyze = () => {
    setErrorMessage(null);
    setZeroFailureNotice(false);
    setSmallSampleWarning(false);

    if (!csvInput.trim()) {
      // If user clears input and clicks analyze, reset everything
      setAnalysisData(null);
      setErrorMessage(
        'Invalid CSV format. Expected columns: order_id, timestamp, zone, category, supplier, delivery_minutes, success'
      );
      return;
    }

    const parseResult = parseCSV(csvInput);
    if (!parseResult.success) {
      setAnalysisData(null);
      setErrorMessage(parseResult.error || 'Invalid CSV format.');
      return;
    }

    const orders = parseResult.orders;
    setSampleCount(orders.length);

    if (orders.length <= 2) {
      setSmallSampleWarning(true);
    }

    const analyzed = analyzeOrderData(orders);
    setAnalysisData(analyzed);

    if (analyzed.hasZeroFailures) {
      setZeroFailureNotice(true);
    }
  };

  // Pre-fill 20 sample records
  const handleLoadSample = () => {
    setCsvInput(SAMPLE_20_RECORDS_CSV);
    setErrorMessage(null);

    const parseResult = parseCSV(SAMPLE_20_RECORDS_CSV);
    if (parseResult.success) {
      const analyzed = analyzeOrderData(parseResult.orders);
      setAnalysisData(analyzed);
      setSampleCount(parseResult.orders.length);
      setZeroFailureNotice(false);
      setSmallSampleWarning(false);
    }
  };

  // Reset/Clear input
  const handleClear = () => {
    setCsvInput('');
    setAnalysisData(null);
    setErrorMessage(null);
    setZeroFailureNotice(false);
    setSmallSampleWarning(false);
  };

  // Auto-analyze initial sample data on mount so user immediately sees the working dashboard
  useEffect(() => {
    handleLoadSample();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-gray-900 flex flex-col font-sans selection:bg-[#F8CB46] selection:text-[#0C831F]">
      {/* Top Header */}
      <Header
        onResetToSample={handleLoadSample}
        hasAnalyzed={analysisData !== null}
      />

      {/* Main Container with 3 Vertically Stacked Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SECTION 1: DATA INPUT */}
        <DataInputSection
          csvInput={csvInput}
          setCsvInput={setCsvInput}
          onAnalyze={handleAnalyze}
          onLoadSample={handleLoadSample}
          onClear={handleClear}
          errorMessage={errorMessage}
          zeroFailureNotice={zeroFailureNotice}
          smallSampleWarning={smallSampleWarning}
          sampleCount={sampleCount}
        />

        {/* SECTION 2: ANALYTICS DASHBOARD (appears after Analyze Data is clicked) */}
        {analysisData && (
          <AnalyticsDashboard data={analysisData} />
        )}

        {/* SECTION 3: INSIGHTS & RECOMMENDATIONS */}
        {analysisData && (
          <RecommendationsSection data={analysisData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-white py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-800">
              Quick Commerce Order Delay Analyzer
            </span>
            <span>•</span>
            <span>Dark Store Dispatch & Last-Mile SLA Engine</span>
          </div>
          <div className="text-gray-500 font-medium">
            Blinkit Brand Identity • Real-time Operations Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
