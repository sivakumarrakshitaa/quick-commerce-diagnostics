import React, { useState } from 'react';
import { HeatmapCell } from '../types';

interface HeatmapMatrixProps {
  zones: string[];
  categories: string[];
  matrix: Record<string, HeatmapCell>;
  onCellClick?: (zone: string, category: string) => void;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  zones,
  categories,
  matrix,
  onCellClick,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    zone: string;
    category: string;
    cell: HeatmapCell;
  } | null>(null);

  const getCellDetails = (zone: string, category: string): HeatmapCell => {
    const key = `${zone}___${category}`;
    return (
      matrix[key] || {
        zone,
        category,
        totalOrders: 0,
        failedOrders: 0,
        failureRate: 0,
        colorClass: 'bg-gray-50 text-gray-400 border-gray-200',
        severityLevel: 'low',
      }
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Heatmap Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Heatmap: Zone × Category
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Failure rate (%) across 25 operational corridors
          </p>
        </div>
        <span className="text-[11px] text-gray-600 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
          5 × 5 Matrix
        </span>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[340px]">
          {/* Column Headers (Categories) */}
          <div className="grid grid-cols-6 gap-1 mb-1.5 text-[11px] font-bold text-gray-600 text-center">
            <div className="text-left pl-1 text-gray-400 font-medium">Zone \ Cat</div>
            {categories.map((cat) => (
              <div
                key={cat}
                className="py-1 px-0.5 truncate text-gray-700"
                title={cat}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Rows (Zones) */}
          <div className="space-y-1.5">
            {zones.map((zone) => (
              <div key={zone} className="grid grid-cols-6 gap-1.5 items-center">
                {/* Row Header (Zone name) */}
                <div
                  className="text-xs font-bold text-gray-800 pr-1 truncate text-left"
                  title={zone}
                >
                  {zone}
                </div>

                {/* 5 Cells for each category */}
                {categories.map((cat) => {
                  const cell = getCellDetails(zone, cat);
                  const rate = cell.failureRate;
                  const total = cell.totalOrders;

                  // Severity background & text color in clean Blinkit light palette
                  let cellStyle = '';
                  let badgeText = `${rate}%`;

                  if (total === 0) {
                    cellStyle =
                      'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300';
                    badgeText = '0%';
                  } else if (rate <= 10) {
                    cellStyle =
                      'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
                  } else if (rate <= 20) {
                    cellStyle =
                      'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
                  } else if (rate <= 30) {
                    cellStyle =
                      'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100';
                  } else {
                    // Critical >30%
                    cellStyle =
                      'bg-rose-100 text-rose-900 font-bold border-rose-300 shadow-2xs hover:bg-rose-200';
                  }

                  const isSelectedHotspot =
                    zone.toLowerCase().includes('north') &&
                    cat.toLowerCase().includes('electronic');

                  return (
                    <button
                      key={cat}
                      onClick={() => onCellClick && onCellClick(zone, cat)}
                      onMouseEnter={() =>
                        setHoveredCell({ zone, category: cat, cell })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-9 rounded-lg border flex flex-col items-center justify-center transition-all duration-150 cursor-pointer relative group ${cellStyle} ${
                        isSelectedHotspot ? 'ring-2 ring-rose-500' : ''
                      }`}
                      title={`${zone} × ${cat}: ${rate}% failure (${cell.failedOrders}/${total} orders)`}
                    >
                      <span className="text-xs font-bold tabular-nums">
                        {badgeText}
                      </span>
                      <span className="text-[9px] opacity-75 leading-none font-medium">
                        {total > 0 ? `${total} ord` : '–'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Information / Inspector preview */}
      <div className="h-6 text-[11px] text-gray-600 flex items-center justify-between px-1 mt-2">
        {hoveredCell ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              {hoveredCell.zone} × {hoveredCell.category}:
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                hoveredCell.cell.failureRate > 30
                  ? 'text-rose-800 bg-rose-100'
                  : hoveredCell.cell.failureRate > 20
                  ? 'text-orange-800 bg-orange-100'
                  : hoveredCell.cell.failureRate > 10
                  ? 'text-amber-800 bg-amber-100'
                  : 'text-emerald-800 bg-emerald-100'
              }`}
            >
              {hoveredCell.cell.failureRate}% failure
            </span>
            <span className="text-gray-500 font-medium">
              ({hoveredCell.cell.failedOrders} failed of {hoveredCell.cell.totalOrders} orders)
            </span>
          </div>
        ) : (
          <span className="text-gray-400 italic">
            Tip: Hover any cell to inspect corridor failure counts.
          </span>
        )}
      </div>

      {/* Color Scale Legend */}
      <div className="mt-2.5 pt-2 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-600">
          <span className="text-gray-500 font-semibold">Severity Scale:</span>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 inline-block" />
              <span>0-10% (Optimal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300 inline-block" />
              <span>10-20% (Moderate)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-orange-100 border border-orange-300 inline-block" />
              <span>20-30% (High)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-200 border border-rose-400 inline-block" />
              <span className="font-bold text-rose-800">&gt;30% (Critical)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

