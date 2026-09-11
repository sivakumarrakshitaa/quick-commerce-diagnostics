import React from 'react';
import { Package, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryStatBoxesProps {
  stats: SummaryStats;
}

export const SummaryStatBoxes: React.FC<SummaryStatBoxesProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Stat 1: Total Orders Analyzed */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 transition-all duration-200 shadow-xs hover:border-[#0C831F]">
        <div className="flex items-center justify-between text-gray-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Total Orders Analyzed
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-[#0C831F]">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900 tracking-tight">
          {stats.totalOrders}
        </div>
        <p className="text-[11px] text-gray-400 mt-1 font-medium">
          Parsed dispatch records in dataset
        </p>
      </div>

      {/* Stat 2: Overall Failure Rate */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 transition-all duration-200 shadow-xs hover:border-amber-400">
        <div className="flex items-center justify-between text-gray-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Overall Failure Rate
          </span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle
              className={`w-4 h-4 ${
                stats.overallFailureRate > 25 ? 'text-rose-600' : 'text-amber-600'
              }`}
            />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-3xl font-black tracking-tight ${
              stats.overallFailureRate > 25
                ? 'text-rose-600'
                : stats.overallFailureRate > 15
                ? 'text-amber-600'
                : 'text-[#0C831F]'
            }`}
          >
            {stats.overallFailureRate}%
          </span>
          <span className="text-xs text-gray-500 font-medium">
            ({Math.round((stats.overallFailureRate * stats.totalOrders) / 100)} breached SLA)
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 font-medium">
          Benchmark SLA delay rate (&gt;15 min)
        </p>
      </div>

      {/* Stat 3: Worst Performing Hour (Blinkit Yellow Highlight) */}
      <div className="bg-white border-2 border-[#F8CB46] rounded-2xl p-4.5 transition-all duration-200 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            Worst Hour Bucket
          </span>
          <div className="p-1.5 rounded-lg bg-[#FEF9C3] text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
          {stats.worstHourBucket.bucket}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
            {stats.worstHourBucket.failureRate}% failure
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            ({stats.worstHourBucket.failed}/{stats.worstHourBucket.total} failed)
          </span>
        </div>
      </div>

      {/* Stat 4: Worst Performing Zone-Category Combo */}
      <div className="bg-white border-2 border-rose-300 rounded-2xl p-4.5 transition-all duration-200 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            Worst Zone-Category
          </span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="text-base sm:text-lg font-black text-gray-900 tracking-tight truncate" title={stats.worstZoneCategory.combo}>
          {stats.worstZoneCategory.combo}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 font-mono">
            {stats.worstZoneCategory.failureRate}% failure
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            ({stats.worstZoneCategory.failed}/{stats.worstZoneCategory.total} orders)
          </span>
        </div>
      </div>
    </div>
  );
};

