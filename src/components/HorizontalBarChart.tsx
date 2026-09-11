import React, { useState } from 'react';

export interface BarChartItem {
  id: string;
  label: string;
  value: number; // failure rate (%) or minutes
  totalOrders?: number;
  subValueLabel?: string;
  isHighlighted?: boolean;
  highlightTag?: string;
  customColor?: string;
}

interface HorizontalBarChartProps {
  title: string;
  subtitle?: string;
  items: BarChartItem[];
  valueUnit: '%' | 'min';
  maxValue?: number;
  xAxisLabel: string;
  yAxisLabel: string;
  accentColor?: string;
  defaultBarColor?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  subtitle,
  items,
  valueUnit,
  maxValue,
  xAxisLabel,
  yAxisLabel,
  accentColor = '#0C831F',
  defaultBarColor = '#0C831F',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute maximum scale value
  const calculatedMax = Math.max(...items.map((i) => i.value), 1);
  const scaleMax = maxValue || Math.max(Math.ceil(calculatedMax * 1.2 / 10) * 10, valueUnit === '%' ? 50 : 60);

  // Grid tick lines at 0%, 25%, 50%, 75%, 100%
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(ratio * scaleMax));

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Chart Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>
          <span className="text-[11px] text-gray-600 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
            {xAxisLabel}
          </span>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Main Chart Area */}
      <div className="relative flex-1 py-1">
        {/* Background Vertical Grid Lines */}
        <div className="absolute inset-0 flex justify-between pointer-events-none pl-28 pr-12">
          {ticks.map((tick, idx) => (
            <div key={idx} className="h-full border-r border-gray-100 flex flex-col justify-end">
              <span className="text-[10px] text-gray-400 font-mono transform translate-x-1/2 translate-y-5">
                {tick}{valueUnit}
              </span>
            </div>
          ))}
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-3 relative z-10">
          {items.map((item) => {
            const percentageWidth = Math.min(Math.max((item.value / scaleMax) * 100, 2), 100);
            const isHovered = hoveredId === item.id;
            const isHighlighted = item.isHighlighted;

            // Bar background & gradient in clean Blinkit palette
            let barBg = 'bg-[#0C831F]';
            let glow = '';
            if (isHighlighted) {
              barBg = 'bg-gradient-to-r from-[#F8CB46] to-amber-500';
              glow = 'shadow-xs';
            } else if (item.value > 30 && valueUnit === '%') {
              barBg = 'bg-rose-500';
            } else if (item.value > 15 && valueUnit === '%') {
              barBg = 'bg-amber-500';
            } else if (valueUnit === 'min') {
              barBg = 'bg-emerald-600';
            } else {
              barBg = 'bg-[#0C831F]';
            }

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group flex items-center text-xs transition-all duration-150 rounded-lg p-1.5 -mx-1.5 ${
                  isHovered ? 'bg-gray-50' : ''
                }`}
              >
                {/* Y-axis Label */}
                <div className="w-28 flex-shrink-0 pr-2 text-right">
                  <span
                    className={`font-semibold truncate block ${
                      isHighlighted ? 'text-amber-800 font-bold' : 'text-gray-800'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                  {item.highlightTag && (
                    <span className="text-[9px] text-amber-700 font-bold uppercase tracking-tight block bg-amber-100/80 px-1 py-0.2 rounded mt-0.5 inline-block">
                      {item.highlightTag}
                    </span>
                  )}
                </div>

                {/* Bar Track & Fill */}
                <div className="flex-1 relative flex items-center pr-14">
                  <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden border border-gray-200/70 flex items-center p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2 ${barBg} ${glow}`}
                      style={{ width: `${percentageWidth}%` }}
                    >
                      {/* Inline text marker if wide enough */}
                      {percentageWidth > 35 && (
                        <span className={`text-[10px] font-bold ${isHighlighted ? 'text-gray-950' : 'text-white'} drop-shadow-xs pr-0.5`}>
                          {item.value}
                          {valueUnit}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Value on End of Bar */}
                  <div className="absolute right-0 flex items-center space-x-1 pl-2">
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isHighlighted
                          ? 'text-amber-700'
                          : isHovered
                          ? 'text-gray-900'
                          : 'text-gray-700'
                      }`}
                    >
                      {item.value}
                      {valueUnit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Axis footers */}
      <div className="mt-7 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F8CB46] to-amber-500" />
          <span>Surge / Operational Bottleneck</span>
        </span>
        <span className="text-gray-400 font-mono">Max scale: {scaleMax}{valueUnit}</span>
      </div>
    </div>
  );
};

