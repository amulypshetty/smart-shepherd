'use client';

import React, { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { HourlyFlockCount } from '@/types/dashboard';

interface FlockCountChartProps {
  data: HourlyFlockCount[];
  onViewDetails?: () => void;
}

export const FlockCountChart: React.FC<FlockCountChartProps> = ({
  data,
  onViewDetails,
}) => {
  // Default active index is 2 (which is 10 AM, exactly matching the screenshot)
  const [activeIndex, setActiveIndex] = useState<number>(2);

  // Chart Dimensions
  const width = 420;
  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 24;
  const paddingBottom = 28;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Y axis range: 0 to 60 (matching screenshot)
  const yMin = 0;
  const yMax = 60;
  const yTicks = [0, 10, 20, 30, 40, 50, 60];

  // Map data to coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.detected - yMin) / (yMax - yMin)) * chartHeight;
    return { x, y, ...d, index };
  });

  // Generate smooth SVG curve path (Catmull-Rom or cubic Bezier)
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      // Control points
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  // Close area under curve for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const activePoint = points[activeIndex] || points[2];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">
            Flock Count (Today)
          </h2>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-0.5"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[190px] mt-2 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="flockGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis numbers */}
          {yTicks.map((tick) => {
            const y = paddingTop + chartHeight - ((tick - yMin) / (yMax - yMin)) * chartHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#flockGradient)" />

          {/* Smooth Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points on Line */}
          {points.map((p) => {
            const isActive = p.index === activeIndex;
            return (
              <g
                key={p.timeLabel}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIndex(p.index)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 5 : 3}
                  className={`transition-all duration-150 ${
                    isActive
                      ? 'fill-white stroke-[#2563EB] stroke-[3]'
                      : 'fill-[#2563EB] hover:scale-125'
                  }`}
                />
                {/* Invisible hover hotspot */}
                <rect
                  x={p.x - 18}
                  y={paddingTop}
                  width="36"
                  height={chartHeight}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* X-axis time labels */}
          {points.map((p) => (
            <text
              key={`label-${p.timeLabel}`}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className={`text-[9px] font-medium transition-colors ${
                p.index === activeIndex ? 'fill-blue-600 font-bold' : 'fill-slate-400'
              }`}
            >
              {p.timeLabel}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Box matching Screenshot (positioned near active point) */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-200 -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100 - 8}%`,
            }}
          >
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-center">
              <div className="text-[10px] font-semibold text-slate-500">
                {activePoint.timeLabel}
              </div>
              <div className="text-xs font-bold text-slate-800 whitespace-nowrap">
                Detected: {activePoint.detected}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        <span>Min: 45 / Max: 50</span>
        <span className="text-emerald-600 font-semibold">96% Average In-Zone</span>
      </div>
    </div>
  );
};
