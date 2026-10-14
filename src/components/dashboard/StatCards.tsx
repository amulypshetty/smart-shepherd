'use client';

import React from 'react';
import { MapPin, TriangleAlert, ShieldCheck } from 'lucide-react';
import { SheepSilhouette } from '@/components/icons/SheepIcon';

interface StatCardsProps {
  totalSheep: number;
  detectedCount: number;
  unresponsiveCount: number;
  flockStatusText?: string;
  flockStatusSubtext?: string;
  onCardClick?: (type: 'total' | 'detected' | 'missing' | 'status') => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalSheep = 50,
  detectedCount = 48,
  unresponsiveCount = 2,
  flockStatusText = 'Mostly Safe',
  flockStatusSubtext = '2 sheep beyond safe zone',
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* 1. Total Sheep */}
      <div
        onClick={() => onCardClick?.('total')}
        className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4 group"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#E8F8EE] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <SheepSilhouette className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Sheep
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
            {totalSheep}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            Registered in the system
          </p>
        </div>
      </div>

      {/* 2. Currently Detected */}
      <div
        onClick={() => onCardClick?.('detected')}
        className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4 group"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <MapPin className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Currently Detected
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
            {detectedCount}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            In the grazing area
          </p>
        </div>
      </div>

      {/* 3. Missing / Unresponsive */}
      <div
        onClick={() => onCardClick?.('missing')}
        className="bg-white rounded-2xl p-5 border border-amber-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4 group"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#FFF5E6] text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <TriangleAlert className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Missing / Unresponsive
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
            {unresponsiveCount}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            Needs attention
          </p>
        </div>
      </div>

      {/* 4. Flock Status */}
      <div
        onClick={() => onCardClick?.('status')}
        className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4 group"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#E8F8EE] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Flock Status
          </p>
          <p className="text-2xl sm:text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
            {flockStatusText}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            {flockStatusSubtext}
          </p>
        </div>
      </div>
    </div>
  );
};
