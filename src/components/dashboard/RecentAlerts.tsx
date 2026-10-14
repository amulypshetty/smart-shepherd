'use client';

import React from 'react';
import { Bell, TriangleAlert, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { FlockAlert } from '@/types/dashboard';

interface RecentAlertsProps {
  alerts: FlockAlert[];
  onViewAll?: () => void;
  onSelectAlert?: (alert: FlockAlert) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  onViewAll,
  onSelectAlert,
  onAcknowledgeAlert,
}) => {
  // Show the top 3 active or recent alerts matching screenshot
  const displayAlerts = alerts.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h2 className="text-base font-bold text-slate-800">Recent Alerts</h2>
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

      {/* Alert List */}
      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
        {displayAlerts.map((alert) => {
          const isHigh = alert.severity === 'high';
          const isMedium = alert.severity === 'medium';

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert?.(alert)}
              className="py-3.5 first:pt-3 last:pb-1 flex items-start justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors"
            >
              {/* Left: Icon & Details */}
              <div className="flex items-start gap-3 min-w-0">
                {/* Severity Icon */}
                <div
                  className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                    isHigh
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : isMedium
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#DBEAFE] text-[#2563EB]'
                  }`}
                >
                  {isHigh ? (
                    <TriangleAlert className="w-4 h-4" />
                  ) : isMedium ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Right: Timestamp & Severity Pill */}
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <span className="text-xs font-medium text-slate-400">
                  {alert.timestamp}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                    isHigh
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : isMedium
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#DBEAFE] text-[#2563EB]'
                  }`}
                >
                  {isHigh ? 'High' : isMedium ? 'Medium' : 'Info'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer quick action */}
      <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>3 active alerts in pasture</span>
        <button
          onClick={onViewAll}
          className="text-blue-600 font-medium hover:underline text-[11px]"
        >
          Manage All &rarr;
        </button>
      </div>
    </div>
  );
};
