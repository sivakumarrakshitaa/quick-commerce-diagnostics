import React from 'react';
import { Zap, RefreshCw, Activity } from 'lucide-react';

interface HeaderProps {
  onResetToSample: () => void;
  hasAnalyzed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetToSample, hasAnalyzed }) => {
  return (
    <header className="border-b border-gray-200/80 bg-white text-gray-900 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {/* Blinkit Iconic Yellow Logo Box */}
            <div className="w-10 h-10 rounded-xl bg-[#F8CB46] flex items-center justify-center shadow-xs text-[#0C831F] font-black">
              <Zap className="w-5 h-5 fill-[#0C831F] text-[#0C831F]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                  Quick Commerce Order Delay Analyzer
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F8CB46]/30 text-[#0C831F] border border-[#F8CB46]">
                  ⚡ 10-MIN DISPATCH OPS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Identify operational bottlenecks in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onResetToSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-all shadow-xs cursor-pointer active:scale-98"
              title="Load 20 realistic quick commerce orders"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#0C831F]" />
              <span>Load Sample Data</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
              <span className={`w-2 h-2 rounded-full ${hasAnalyzed ? 'bg-[#0C831F] ring-2 ring-green-200 animate-pulse' : 'bg-gray-400'}`} />
              <span>{hasAnalyzed ? 'Live Ops Active' : 'Awaiting Input'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

