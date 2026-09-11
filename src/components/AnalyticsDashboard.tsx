import React, { useState } from 'react';
import { AnalysisData } from '../types';
import { HorizontalBarChart, BarChartItem } from './HorizontalBarChart';
import { HeatmapMatrix } from './HeatmapMatrix';
import { SummaryStatBoxes } from './SummaryStatBoxes';
import {
  BarChart3,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Tag,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  data: AnalysisData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const [showDataTable, setShowDataTable] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');

  // Prepare Card 1: Delays by Time-of-Day items
  const timeBarItems: BarChartItem[] = data.timeMetrics.map((tm) => ({
    id: tm.bucket,
    label: tm.displayName,
    value: tm.failureRate,
    totalOrders: tm.totalOrders,
    isHighlighted: tm.isPeak,
    highlightTag: tm.isPeak ? 'PEAK SURGE' : undefined,
  }));

  // Prepare Card 2: Delays by Zone items
  const zoneBarItems: BarChartItem[] = data.zoneMetrics.map((zm) => ({
    id: zm.zone,
    label: zm.zone,
    value: zm.failureRate,
    totalOrders: zm.totalOrders,
    isHighlighted: zm.isHighlighted,
    highlightTag: zm.isHighlighted ? 'BOTTLENECK' : undefined,
  }));

  // Prepare Card 3: Delays by Category items
  const categoryBarItems: BarChartItem[] = data.categoryMetrics.map((cm) => ({
    id: cm.category,
    label: cm.category,
    value: cm.avgDeliveryMinutes,
    totalOrders: cm.totalOrders,
    isHighlighted: cm.isLongest,
    highlightTag: cm.isLongest ? 'LONGEST SLA' : undefined,
  }));

  // Filtered orders for table
  const filteredOrders = data.orders.filter((order) => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.zone.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'SUCCESS'
        ? order.success === 1
        : order.success === 0;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs text-gray-900">
      {/* Dashboard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#F8CB46]/20 text-[#0C831F] border border-[#F8CB46]/50">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Delay Breakdown Analysis
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-[#0C831F] border border-emerald-200">
                Live Metrics
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-dimensional failure rate & SLA duration diagnostics
            </p>
          </div>
        </div>

        {/* View Raw Data Toggle Button */}
        <button
          onClick={() => setShowDataTable(!showDataTable)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors shadow-xs self-start sm:self-auto cursor-pointer active:scale-98"
        >
          <TableIcon className="w-3.5 h-3.5 text-[#0C831F]" />
          <span>{showDataTable ? 'Hide Order Table' : 'Inspect Order Records'}</span>
          {showDataTable ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>
      </div>

      {/* 2x2 Grid of Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 (Top Left): Delays by Time-of-Day */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
          <HorizontalBarChart
            title="Delays by Time-of-Day"
            subtitle="Failure rate (%) segmented into operational shift buckets"
            items={timeBarItems}
            valueUnit="%"
            xAxisLabel="Failure Rate (%)"
            yAxisLabel="Time Period"
            accentColor="#F8CB46"
          />
        </div>

        {/* Card 2 (Top Right): Delays by Zone */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
          <HorizontalBarChart
            title="Delays by Zone"
            subtitle="Failure rate (%) segmented across metropolitan fulfillment zones"
            items={zoneBarItems}
            valueUnit="%"
            xAxisLabel="Failure Rate (%)"
            yAxisLabel="Fulfillment Zone"
            accentColor="#F8CB46"
          />
        </div>

        {/* Card 3 (Bottom Left): Delays by Category */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
          <HorizontalBarChart
            title="Delays by Category"
            subtitle="Average delivery time (minutes) by item taxonomy"
            items={categoryBarItems}
            valueUnit="min"
            xAxisLabel="Avg Delivery Time (min)"
            yAxisLabel="Product Category"
            accentColor="#0C831F"
          />
        </div>

        {/* Card 4 (Bottom Right): Heatmap: Zone × Category */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
          <HeatmapMatrix
            zones={data.heatmapGrid.zones}
            categories={data.heatmapGrid.categories}
            matrix={data.heatmapGrid.matrix}
          />
        </div>
      </div>

      {/* Summary Stat Boxes (below all 4 charts) */}
      <SummaryStatBoxes stats={data.summaryStats} />

      {/* Expandable Order Table Inspector */}
      {showDataTable && (
        <div className="mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Parsed Orders Table ({filteredOrders.length} of {data.orders.length})
              </h3>
              <p className="text-xs text-gray-500">
                Detailed audit log of parsed order entries with delivery metrics
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter order, zone, cat..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-gray-50 text-xs text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:bg-white focus:border-[#0C831F] w-48"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs">
                {(['ALL', 'SUCCESS', 'FAILED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-[#0C831F] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3.5 py-3">Order ID</th>
                  <th className="px-3.5 py-3">Timestamp</th>
                  <th className="px-3.5 py-3">Hour Bucket</th>
                  <th className="px-3.5 py-3">Zone</th>
                  <th className="px-3.5 py-3">Category</th>
                  <th className="px-3.5 py-3">Supplier</th>
                  <th className="px-3.5 py-3 text-right">Delivery (min)</th>
                  <th className="px-3.5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const isFailed = order.success === 0;
                  return (
                    <tr
                      key={order.order_id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isFailed ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="px-3.5 py-2.5 font-mono font-bold text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-3.5 py-2.5 text-gray-500 font-mono">
                        {order.timestamp}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          {order.hourBucket}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-gray-800 font-medium">{order.zone}</td>
                      <td className="px-3.5 py-2.5 text-gray-800 font-medium">{order.category}</td>
                      <td className="px-3.5 py-2.5 text-gray-500">{order.supplier}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-gray-900">
                        {order.delivery_minutes} m
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        {isFailed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            DELAYED (0)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#0C831F] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-[#0C831F]" />
                            ON-TIME (1)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
