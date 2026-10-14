'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Sheep } from '@/types/dashboard';
import { SheepSilhouette } from '@/components/icons/SheepIcon';

interface RecentActivityTableProps {
  sheepList: Sheep[];
  onSelectSheep?: (sheep: Sheep) => void;
  onViewAll?: () => void;
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  sheepList,
  onSelectSheep,
  onViewAll,
}) => {
  // Specifically take the 5 prominent sheep from the screenshot (#12, #27, #34, #41, #46)
  const targetIds = ['#12', '#27', '#34', '#41', '#46'];
  const displaySheep = targetIds
    .map((id) => sheepList.find((s) => s.id === id))
    .filter((s): s is Sheep => s !== undefined);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SheepSilhouette className="w-4 h-4 text-slate-700" />
          <h2 className="text-base font-bold text-slate-800">
            Recent Sheep Activity
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto my-1 flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold">
              <th className="py-2 px-1">ID</th>
              <th className="py-2 px-2">Last Seen</th>
              <th className="py-2 px-2">Location</th>
              <th className="py-2 px-1 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {displaySheep.map((sheep) => {
              const isOutside = sheep.status === 'outside_zone';
              const isNoSignal = sheep.status === 'no_signal';

              return (
                <tr
                  key={sheep.id}
                  onClick={() => onSelectSheep?.(sheep)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-1 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {sheep.id}
                  </td>
                  <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">
                    {sheep.lastSeen}
                  </td>
                  <td className="py-2.5 px-2 text-slate-600 font-medium">
                    {sheep.locationName}
                  </td>
                  <td className="py-2.5 px-1 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                        isOutside
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : isNoSignal
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-[#E8F8EE] text-[#16A34A]'
                      }`}
                    >
                      {isOutside
                        ? 'Outside Zone'
                        : isNoSignal
                        ? 'No Signal'
                        : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>50 GPS collars paired</span>
        <span className="text-slate-500">Updated 10:24 AM</span>
      </div>
    </div>
  );
};
